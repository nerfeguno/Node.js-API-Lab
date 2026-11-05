const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const net = require("node:net");
const path = require("node:path");
const WebSocket = require("ws");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const root = path.resolve(__dirname, "..");
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function waitForPort(port, child, timeoutMs = 10000) {
  const started = Date.now();

  return new Promise((resolve, reject) => {
    function check() {
      if (child.exitCode !== null) {
        return reject(new Error(`Server exited early (code ${child.exitCode})`));
      }

      const socket = net.createConnection({ host: "127.0.0.1", port });
      socket.once("connect", () => {
        socket.destroy();
        resolve();
      });
      socket.once("error", async () => {
        socket.destroy();
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`Timed out waiting for port ${port}`));
        } else {
          await wait(100);
          check();
        }
      });
    }
    check();
  });
}

async function withServer(script, port, run) {
  const child = spawn(process.execPath, [path.join(root, script)], {
    cwd: root,
    stdio: ["ignore", "ignore", "pipe"]
  });
  let stderr = "";
  child.stderr.on("data", chunk => { stderr += chunk.toString(); });

  try {
    await waitForPort(port, child);
    await run();
  } catch (error) {
    if (stderr) error.message += `\nServer output: ${stderr}`;
    throw error;
  } finally {
    child.kill("SIGTERM");
    await Promise.race([
      new Promise(resolve => child.once("exit", resolve)),
      wait(1500)
    ]);
    if (child.exitCode === null) child.kill("SIGKILL");
  }
}

function postJson(url, body) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

test("REST supports listing, creating, updating, and deleting users", async () => {
  await withServer("src/rest/server.js", 3001, async () => {
    const list = await fetch("http://127.0.0.1:3001/users");
    assert.equal(list.status, 200);
    assert.equal((await list.json()).length, 2);

    const createdResponse = await postJson("http://127.0.0.1:3001/users", {
      name: "Test User",
      email: "test@example.com"
    });
    assert.equal(createdResponse.status, 201);
    const created = await createdResponse.json();
    assert.equal(created.name, "Test User");

    const updatedResponse = await fetch(`http://127.0.0.1:3001/users/${created.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Updated User" })
    });
    assert.equal((await updatedResponse.json()).name, "Updated User");

    const deletedResponse = await fetch(`http://127.0.0.1:3001/users/${created.id}`, {
      method: "DELETE"
    });
    assert.equal(deletedResponse.status, 204);
  });
});

test("GraphQL resolves a users query and addUser mutation", async () => {
  await withServer("src/graphql/server.js", 3002, async () => {
    const response = await postJson("http://127.0.0.1:3002/graphql", {
      query: "{ users { id name email } }"
    });
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(result.data.users.length, 2);

    const mutation = await postJson("http://127.0.0.1:3002/graphql", {
      query: 'mutation { addUser(name: "Test User", email: "test@example.com") { id name email } }'
    });
    const mutationResult = await mutation.json();
    assert.equal(mutationResult.data.addUser.name, "Test User");
  });
});

test("SOAP-style XML endpoint parses a GetUser request", async () => {
  await withServer("src/soap/server.js", 3003, async () => {
    const xml = `<?xml version="1.0"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body><GetUser><UserId>1</UserId></GetUser></soap:Body>
      </soap:Envelope>`;
    const response = await fetch("http://127.0.0.1:3003/soap", {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body: xml
    });
    const body = await response.text();
    assert.equal(response.status, 200);
    assert.match(body, /GetUserResponse/);
    assert.match(body, /John Example/);
  });
});

test("WebSocket accepts a connection and broadcasts chat messages", async () => {
  await withServer("src/websocket/server.js", 3004, async () => {
    const socket = new WebSocket("ws://127.0.0.1:3004");
    const messages = [];
    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("WebSocket connection timed out")), 3000);
        socket.once("open", () => {
          socket.once("message", raw => {
            messages.push(JSON.parse(raw.toString()));
            clearTimeout(timeout);
            resolve();
          });
        });
        socket.once("error", reject);
      });

      assert.equal(messages[0].type, "system");
      const reply = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("WebSocket broadcast timed out")), 3000);
        socket.on("message", raw => {
          const message = JSON.parse(raw.toString());
          if (message.type === "chat") {
            clearTimeout(timeout);
            resolve(message);
          }
        });
      });
      socket.send("Automated test message");
      assert.equal((await reply).message, "Automated test message");
    } finally {
      socket.close();
    }
  });
});

test("JSON-RPC executes methods and reports unknown methods", async () => {
  await withServer("src/rpc/server.js", 3005, async () => {
    const success = await postJson("http://127.0.0.1:3005/rpc", {
      jsonrpc: "2.0", method: "add", params: { a: 10, b: 20 }, id: 1
    });
    assert.deepEqual(await success.json(), {
      jsonrpc: "2.0", result: 30, id: 1
    });

    const missing = await postJson("http://127.0.0.1:3005/rpc", {
      jsonrpc: "2.0", method: "missingMethod", params: {}, id: 2
    });
    const error = await missing.json();
    assert.equal(error.error.code, -32601);
  });
});

test("gRPC GetUser returns the requested user record", async () => {
  await withServer("src/grpc/server.js", 50051, async () => {
    const definition = protoLoader.loadSync(path.join(root, "src/grpc/user.proto"), {
      keepCase: true, longs: String, enums: String, defaults: true, oneofs: true
    });
    const loaded = grpc.loadPackageDefinition(definition);
    const client = new loaded.UserService(
      "127.0.0.1:50051",
      grpc.credentials.createInsecure()
    );

    try {
      const user = await new Promise((resolve, reject) => {
        client.GetUser({ id: 1 }, { deadline: new Date(Date.now() + 3000) }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
      assert.equal(user.id, 1);
      assert.equal(user.name, "John");
      assert.equal(user.email, "john@example.com");
    } finally {
      client.close();
    }
  });
});

test("webhook receiver accepts valid events and rejects invalid payloads", async () => {
  await withServer("src/webhook/server.js", 3006, async () => {
    const accepted = await postJson("http://127.0.0.1:3006/webhooks/events", {
      event: "order.created", data: { orderId: "TEST-100" }
    });
    assert.equal(accepted.status, 202);
    assert.deepEqual(await accepted.json(), { accepted: true });

    const rejected = await postJson("http://127.0.0.1:3006/webhooks/events", {
      data: { orderId: "TEST-100" }
    });
    assert.equal(rejected.status, 400);
  });
});

test("SSE endpoint streams update events", async () => {
  await withServer("src/sse/server.js", 3007, async () => {
    const controller = new AbortController();
    try {
      const response = await fetch("http://127.0.0.1:3007/events", {
        signal: controller.signal
      });
      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type"), /text\/event-stream/);

      const reader = response.body.getReader();
      let received = "";
      while (!received.includes("event: update") || !received.includes("Update 1")) {
        const { value, done } = await reader.read();
        if (done) break;
        received += new TextDecoder().decode(value);
      }
      assert.match(received, /event: update/);
      assert.match(received, /Update 1/);
      await reader.cancel();
    } finally {
      controller.abort();
    }
  });
});
