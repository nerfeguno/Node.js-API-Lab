const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3004, maxPayload: 1024 * 16 });

wss.on("connection", socket => {
  socket.send(JSON.stringify({ type: "system", message: "Connected to the demo chat" }));

  socket.on("message", raw => {
    const message = raw.toString().slice(0, 500);
    const payload = JSON.stringify({ type: "chat", message });
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) client.send(payload);
    }
  });
});

console.log("WebSocket server: ws://localhost:3004");
