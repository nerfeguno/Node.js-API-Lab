# Node.js API Lab

A hands-on learning repository that demonstrates eight common API communication styles and patterns using small Node.js programs.

## What you'll learn

| Example | What it demonstrates | Local endpoint |
|---|---|---|
| REST | Resources, HTTP methods, status codes, JSON | `http://localhost:3001` |
| GraphQL | Schema, queries, mutations | `http://localhost:3002/graphql` |
| SOAP-style XML | XML request/response parsing | `http://localhost:3003/soap` |
| WebSocket | Persistent, two-way messaging | `ws://localhost:3004` |
| JSON-RPC | Calling named remote methods | `http://localhost:3005/rpc` |
| gRPC | Typed RPC with Protocol Buffers | `127.0.0.1:50051` |
| Webhook | Receiving event notifications | `http://localhost:3006/webhooks/events` |
| SSE | Server-to-client event streaming | `http://localhost:3007/events` |

> **Learning project:** examples use local servers and mostly in-memory data. They are not production-ready. Add authentication, authorization, validation, rate limits, logging, monitoring, and secure transport before deploying.

## Requirements

- Node.js 20+
- npm
- A terminal and code editor
- Optional: Postman, Insomnia, or curl for HTTP examples

Check your installation:

```bash
node --version
npm --version
```

## Install and run

```bash
git clone https://github.com/nerfeguno/Node.js-API-Lab.git
cd Node.js-API-Lab
npm install
```

Start each example in its own terminal:

```bash
npm run rest
npm run graphql
npm run soap
npm run websocket
npm run rpc
npm run grpc
npm run webhook
npm run sse
```

Each command starts only that example. Stop a server with `Ctrl+C`.

## Quick tests

### 1. REST

```bash
curl http://localhost:3001/users
curl http://localhost:3001/users/1
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Amina","email":"amina@example.com"}'
curl -X PATCH http://localhost:3001/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated"}'
curl -X DELETE http://localhost:3001/users/2
```

REST organizes data as resources. HTTP methods communicate the intended operation: GET reads, POST creates, PATCH partially updates, and DELETE removes.

### 2. GraphQL

Send a POST request to `http://localhost:3002/graphql` with JSON:

```json
{"query":"{ users { id name email } }"}
```

Mutation:

```json
{"query":"mutation { addUser(name: \"Amina\", email: \"amina@example.com\") { id name email } }"}
```

GraphQL lets the client request exactly the fields it needs from a typed schema.

### 3. SOAP-style XML

```bash
curl -X POST http://localhost:3003/soap \
  -H "Content-Type: text/xml" \
  --data-binary @examples/soap-request.xml
```

This is a simplified XML-over-HTTP teaching example, **not a fully standards-compliant SOAP implementation**. Full SOAP commonly involves strict envelopes, namespaces, faults, and WSDL contracts.

### 4. WebSocket

Run `npm run websocket`, then open `examples/websocket-client.html` in two browser tabs. Send a message in one tab and observe it in the other. WebSockets keep a connection open for two-way communication.

### 5. JSON-RPC

```bash
curl -X POST http://localhost:3005/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"add","params":{"a":10,"b":20},"id":1}'
```

Expected result contains `"result":30`. JSON-RPC represents a remote procedure call as a JSON request.

### 6. gRPC

Terminal 1:

```bash
npm run grpc
```

Terminal 2:

```bash
npm run grpc:client
```

Read `src/grpc/user.proto` to see the service contract. gRPC commonly uses Protocol Buffers and HTTP/2 for efficient typed communication.

### 7. Webhook

```bash
curl -X POST http://localhost:3006/webhooks/events \
  -H "Content-Type: application/json" \
  -d '{"event":"order.created","data":{"orderId":"ORD-1001"}}'
```

A webhook is an event-delivery pattern: another service sends an HTTP request to your application when something happens. This demo does not verify signatures; never trust public webhook payloads without verification.

### 8. Server-Sent Events (SSE)

Run `npm run sse`, then open `examples/sse-client.html`. SSE streams updates from server to browser over a single HTTP connection. Unlike WebSocket, it is primarily server-to-client.

## Repository structure

```text
.
├── docs/
│   └── api-types.md
├── examples/
│   ├── soap-request.xml
│   ├── sse-client.html
│   └── websocket-client.html
├── src/
│   ├── rest/server.js
│   ├── graphql/server.js
│   ├── soap/server.js
│   ├── websocket/server.js
│   ├── rpc/server.js
│   ├── grpc/{client.js,server.js,user.proto}
│   ├── webhook/server.js
│   └── sse/server.js
├── package.json
└── README.md
```

## Important concepts

An API is an interface or contract that lets software communicate. Not every API type describes the same layer: REST is an architectural style, GraphQL is a query language/runtime, SOAP and WebSocket are protocols, gRPC is an RPC framework, and webhooks are an event-delivery pattern.

Access classifications are separate from communication styles:
- **Public API:** offered to external developers, sometimes with keys or quotas.
- **Private API:** restricted to an organization's internal systems.
- **Partner API:** available to approved external organizations.
- **Composite API:** combines multiple operations or services into one interface.

For more detail, see [API Types Reference](docs/api-types.md).

## Production checklist

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

1. HTTP, JSON, request/response, and status codes.
2. REST endpoints and CRUD operations.
3. Calling APIs with Node.js `fetch`.
4. GraphQL schemas, queries, and mutations.
5. Webhooks and SSE.
6. WebSockets.
7. JSON-RPC and gRPC.
8. Authentication, testing, documentation, and deployment.

## Contributing

Beginner-friendly improvements are welcome. Open an issue to suggest a topic, report a problem, or propose another example. Keep examples small, runnable, and clearly documented.

## License

No license has been added yet. Add a license file before accepting reuse or contributions under specific terms.
