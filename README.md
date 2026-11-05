# Node.js API Lab

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

A beginner-friendly, hands-on repository that demonstrates **eight API communication styles and patterns** using small, runnable Node.js examples. Explore how applications exchange data, send events, and communicate in real time.

## Table of contents

- [What you'll learn](#what-youll-learn)
- [Requirements](#requirements)
- [Installation](#installation)
- [Run the examples](#run-the-examples)
- [Try each API](#try-each-api)
- [Postman collection](#postman-collection)
- [Automated tests](#automated-tests)
- [Project structure](#project-structure)
- [Important concepts](#important-concepts)
- [Production considerations](#production-considerations)
- [Suggested learning path](#suggested-learning-path)
- [Contributing](#contributing)
- [License](#license)

## What you'll learn

| Example | What it demonstrates | Local endpoint |
|---|---|---|
| REST | Resources, HTTP methods, status codes, and JSON | `http://localhost:3001` |
| GraphQL | Schemas, queries, and mutations | `http://localhost:3002/graphql` |
| SOAP-style XML | XML request and response parsing | `http://localhost:3003/soap` |
| WebSocket | Persistent, two-way messaging | `ws://localhost:3004` |
| JSON-RPC | Calling named remote methods | `http://localhost:3005/rpc` |
| gRPC | Typed RPC with Protocol Buffers | `127.0.0.1:50051` |
| Webhooks | Receiving event notifications | `http://localhost:3006/webhooks/events` |
| Server-Sent Events (SSE) | Server-to-client event streaming | `http://localhost:3007/events` |

> **Learning project:** These examples run locally and mostly use in-memory data. They are intended for education, not production deployment. Review the security and production considerations before adapting them for a real application.

## Requirements

- [Node.js 20 or later](https://nodejs.org/)
- npm (included with Node.js)
- A terminal and code editor
- Optional: [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), or `curl` for HTTP requests

Check your versions:

```bash
node --version
npm --version
```

## Installation

Clone this repository and install its dependencies:

```bash
git clone https://github.com/nerfeguno/Node.js-API-Lab.git
cd Node.js-API-Lab
npm install
```

## Run the examples

Start each example using its npm script. Run each server in a separate terminal:

| Example | Command |
|---|---|
| REST | `npm run rest` |
| GraphQL | `npm run graphql` |
| SOAP-style XML | `npm run soap` |
| WebSocket | `npm run websocket` |
| JSON-RPC | `npm run rpc` |
| gRPC server | `npm run grpc` |
| gRPC client | `npm run grpc:client` |
| Webhook | `npm run webhook` |
| SSE | `npm run sse` |

Stop a running server with `Ctrl+C`.

## Try each API

### 1. REST

Start the server:

```bash
npm run rest
```

Try these requests:

```bash
# Read all users
curl http://localhost:3001/users

# Read one user
curl http://localhost:3001/users/1

# Create a user
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Amina","email":"amina@example.com"}'

# Partially update a user
curl -X PATCH http://localhost:3001/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated"}'

# Delete a user
curl -X DELETE http://localhost:3001/users/2
```

REST organizes data as resources. HTTP methods communicate the intended operation: GET reads, POST creates, PATCH partially updates, and DELETE removes.

### 2. GraphQL

Start the server:

```bash
npm run graphql
```

Send a POST request to `http://localhost:3002/graphql` with this JSON body:

```json
{"query":"{ users { id name email } }"}
```

Example mutation:

```json
{"query":"mutation { addUser(name: \\"Amina\\", email: \\"amina@example.com\\") { id name email } }"}
```

GraphQL lets clients request the fields they need from a typed schema.

### 3. SOAP-style XML

Start the server:

```bash
npm run soap
```

Send the included XML example:

```bash
curl -X POST http://localhost:3003/soap \
  -H "Content-Type: text/xml" \
  --data-binary @examples/soap-request.xml
```

This is a simplified XML-over-HTTP teaching example, **not a fully standards-compliant SOAP implementation**. Full SOAP commonly involves defined envelopes, namespaces, faults, and WSDL contracts.

### 4. WebSocket

Start the server:

```bash
npm run websocket
```

Open `examples/websocket-client.html` in two browser tabs. Send a message from one tab and observe it in the other. WebSockets keep a connection open for two-way communication.

### 5. JSON-RPC

Start the server:

```bash
npm run rpc
```

Call the `add` method:

```bash
curl -X POST http://localhost:3005/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"add","params":{"a":10,"b":20},"id":1}'
```

The response should contain `"result":30`. JSON-RPC represents a remote procedure call as a JSON request.

### 6. gRPC

Open two terminals. Start the server in the first:

```bash
npm run grpc
```

Run the client in the second:

```bash
npm run grpc:client
```

Read `src/grpc/user.proto` to explore the service contract. gRPC commonly uses Protocol Buffers and HTTP/2 for efficient, typed communication.

### 7. Webhooks

Start the server:

```bash
npm run webhook
```

Send a sample event:

```bash
curl -X POST http://localhost:3006/webhooks/events \
  -H "Content-Type: application/json" \
  -d '{"event":"order.created","data":{"orderId":"ORD-1001"}}'
```

A webhook is an event-delivery pattern: another service sends an HTTP request to your application when something happens. This demo does not verify signatures. Never trust public webhook payloads without verifying them.

### 8. Server-Sent Events (SSE)

Start the server:

```bash
npm run sse
```

Open `examples/sse-client.html` in your browser. SSE streams updates from a server to a browser over one HTTP connection. Unlike WebSockets, it is primarily server-to-client.

## Project structure

```text
Node.js-API-Lab/
├── docs/
│   └── api-types.md
├── examples/
│   ├── soap-request.xml
│   ├── sse-client.html
│   └── websocket-client.html
├── postman/
│   └── Node.js-API-Lab.postman_collection.json
├── tests/
│   └── api.test.js
├── .github/
│   └── workflows/ci.yml
├── src/
│   ├── rest/server.js
│   ├── graphql/server.js
│   ├── soap/server.js
│   ├── websocket/server.js
│   ├── rpc/server.js
│   ├── grpc/
│   │   ├── client.js
│   │   ├── server.js
│   │   └── user.proto
│   ├── webhook/server.js
│   └── sse/server.js
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```


## Postman collection

Import the ready-to-use collection into Postman:

[`postman/Node.js-API-Lab.postman_collection.json`](postman/Node.js-API-Lab.postman_collection.json)

In Postman, select **Import**, choose the collection JSON file, and run the example servers you want to test. The collection includes requests for REST, GraphQL, SOAP-style XML, JSON-RPC, and webhooks. Requests include basic Postman test assertions.

The WebSocket, gRPC, and SSE demonstrations use their respective protocols rather than ordinary HTTP request/response flows. Run them using the instructions above and the browser examples in `examples/`.

## Automated tests

The project uses the built-in Node.js test runner, so no separate test framework is required.

Run the complete integration test suite:

```bash
npm test
```

The tests start and stop local demo servers automatically and check all eight examples:

- REST CRUD operations
- GraphQL query and mutation
- SOAP-style XML request handling
- WebSocket connection and message broadcast
- JSON-RPC success and error responses
- gRPC user lookup
- Webhook acceptance and invalid payload handling
- SSE event streaming

Tests use the same local ports as the demos. Make sure those ports are available before running the suite.

A GitHub Actions workflow at `.github/workflows/ci.yml` runs the test suite on pushes and pull requests targeting `main`.

## Important concepts

An API (Application Programming Interface) is a contract that allows software systems to communicate. The examples in this repository do not all describe the same technical layer:

- **REST** is an architectural style.
- **GraphQL** is a query language and runtime for APIs.
- **SOAP** is a messaging protocol.
- **WebSocket** is a communication protocol for full-duplex connections.
- **JSON-RPC** is a remote procedure call protocol.
- **gRPC** is a remote procedure call framework.
- **Webhooks** are an event-delivery pattern.
- **SSE** is a server-to-client streaming mechanism over HTTP.

API access classifications are a separate concept:

- **Public API:** available to external developers, sometimes with API keys or usage quotas.
- **Private API:** restricted to an organization's internal systems.
- **Partner API:** available to approved external organizations.
- **Composite API:** combines multiple operations or services behind one interface.

For a deeper explanation, see the [API Types Reference](docs/api-types.md).

## Production considerations

These projects are simplified learning examples. Before using similar code in a real application:

- Use HTTPS/TLS and secure gRPC credentials.
- Validate request bodies, parameters, and message sizes.
- Authenticate callers and authorize every protected action.
- Store secrets in environment variables or a secrets manager.
- Add rate limiting, timeouts, and safe error responses.
- Verify webhook signatures using the provider's documented algorithm and raw request body.
- Make webhook processing idempotent because providers may retry delivery.
- Use a database for persistent data.
- Add automated tests, structured logs, metrics, and API documentation.
- Avoid exposing stack traces or internal details to clients.

## Suggested learning path

1. Understand HTTP, JSON, requests, responses, and status codes.
2. Build REST endpoints and CRUD operations.
3. Call APIs with Node.js `fetch`.
4. Explore GraphQL schemas, queries, and mutations.
5. Experiment with webhooks and SSE.
6. Build real-time features with WebSockets.
7. Explore JSON-RPC and gRPC.
8. Learn authentication, testing, documentation, and deployment.

## Contributing

Contributions and beginner-friendly improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test the example.
4. Open a pull request with a clear description.

You can also open an issue to suggest a topic, report a bug, or request another API example. Keep examples small, runnable, and clearly documented.

## License

This project is licensed under the **MIT License**. You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the conditions in the license.

See the [LICENSE](LICENSE) file for the full license text.
