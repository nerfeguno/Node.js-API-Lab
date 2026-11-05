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
- [Real-world examples and practical use cases](#real-world-examples-and-practical-use-cases)
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


## Real-world examples and practical use cases

The examples below connect each API style to a realistic software product. These are **industry scenarios**, not claims that the small demo servers already implement a complete production system. Use them to understand where each approach fits, what data moves between systems, and why a team might choose it.

### 1. REST — an online store's product and order API

**Real-life scenario:** An e-commerce website has a product catalog, shopping cart, customer accounts, and order history. Its web app and mobile app need a predictable way to read and change this information.

**Typical interaction:**
1. A mobile app sends `GET /products` to retrieve the catalog.
2. The customer opens a product and the app sends `GET /products/42`.
3. The customer places an order using `POST /orders` with the selected products and delivery address.
4. The customer checks progress using `GET /orders/ORD-1001`.
5. If the customer changes a delivery instruction, the app may send `PATCH /orders/ORD-1001`.

**Why REST fits:** The system's information naturally maps to resources such as products, customers, and orders. Standard HTTP methods and status codes make the interface understandable to browsers, mobile applications, third-party clients, and API tools.

**How this repository relates:** The REST demo uses a `/users` resource to demonstrate listing, reading, creating, updating, and deleting records. A real store would replace the in-memory user array with database-backed product and order resources, add authentication and authorization, validate inventory and prices on the server, and document its endpoints.

**Use REST when:** You are building conventional CRUD services, public developer APIs, mobile backends, or resource-oriented business systems.

**Think about:** Pagination, filtering, versioning, validation, authorization, idempotency for retryable operations, and consistent error responses.

### 2. GraphQL — a social network profile and feed screen

**Real-life scenario:** A social networking app's profile screen needs a person's name, avatar, recent posts, follower count, and a small amount of information about each post's author. A REST design might require several requests or return fields the screen does not need.

**Typical interaction:** The app sends one GraphQL query asking for the exact fields required by the screen. The GraphQL server resolves the profile, posts, and related author data and returns a response shaped like the query.

Example query:

```graphql
query ProfileScreen {
  user(id: "42") {
    id
    name
    email
  }
}
```

A mutation changes data, for example creating a post or updating a profile:

```graphql
mutation AddProfileUser {
  addUser(name: "Amina", email: "amina@example.com") {
    id
    name
    email
  }
}
```

**Why GraphQL fits:** The client chooses the fields it needs through a typed schema. This can be useful when web, mobile, and other clients need different views of related data.

**How this repository relates:** The GraphQL demo defines a `User` type, `users` and `user` queries, and an `addUser` mutation. It illustrates schema-driven requests; it is not yet a social network feed or a multi-service data graph.

**Use GraphQL when:** Many clients need flexible combinations of related data, and your team can manage schema evolution and resolver performance.

**Think about:** Query depth and complexity limits, authorization at field/resolver level, caching strategy, pagination, schema governance, and avoiding N+1 database calls. GraphQL is not automatically faster or better than REST.

### 3. SOAP — bank, insurance, or government system integration

**Real-life scenario:** An insurance company connects to a long-established partner system that exposes operations using SOAP and XML. The partner's contract specifies exact message structures and fault formats. Both organizations need to exchange policy or claim information in a predictable, formally described way.

**Typical interaction:**
1. The insurance application builds an XML SOAP envelope containing an operation such as `GetPolicy`.
2. It sends the envelope to the partner's SOAP endpoint over HTTP or another supported transport.
3. The partner validates the message and processes the operation.
4. The partner returns a SOAP XML response or a SOAP fault describing the error.

**Why SOAP fits:** Some enterprise environments depend on formal service contracts, XML schemas, established SOAP tooling, and WS-* standards for concerns such as security or reliable messaging.

**How this repository relates:** The SOAP-style demo accepts an XML request with a `GetUser` operation and returns XML. It is deliberately simplified XML-over-HTTP: it is **not a complete SOAP implementation**, does not provide a WSDL contract, and does not implement SOAP fault handling or WS-Security. The included `examples/soap-request.xml` is a learning request, not a production banking integration.

**Use SOAP when:** A partner, vendor, or enterprise platform requires SOAP or when an existing integration contract mandates it.

**Think about:** WSDL and XSD contracts, namespaces, SOAP version, fault handling, message-size limits, TLS, authentication, WS-Security requirements, and compatibility testing. Do not choose SOAP merely because XML is involved.

### 4. WebSocket — live customer support chat or multiplayer game

**Real-life scenario:** A customer support website lets a customer and an agent exchange messages. Both parties need messages to appear immediately without repeatedly refreshing or polling the server. A multiplayer game may similarly need frequent low-latency updates between connected players and the game server.

**Typical interaction:**
1. The browser opens a WebSocket connection to the application server.
2. The server accepts the connection and keeps it open.
3. The customer sends a chat message through that connection.
4. The server validates the message and distributes it to the appropriate agent or chat participants.
5. The agent's reply travels back through the same persistent connection.

**Why WebSocket fits:** It supports full-duplex communication: client and server can both send messages at any time over one long-lived connection.

**How this repository relates:** The WebSocket demo sends a connection greeting and broadcasts chat messages to connected clients. Open `examples/websocket-client.html` in two browser tabs to see the interaction. The demo broadcasts to all connected clients; a real support system must route messages to the correct conversation and participants.

**Use WebSocket when:** You need interactive two-way updates such as chat, collaborative editing, multiplayer games, live dashboards with client input, or device-control sessions.

**Think about:** Authentication during connection setup, authorization per channel or room, reconnect behavior, heartbeats, message validation, backpressure, horizontal scaling with a message broker, and graceful connection shutdown. For one-way server updates, SSE may be simpler.

### 5. JSON-RPC — a remote calculation or application command service

**Real-life scenario:** A desktop application delegates calculations to a central service. It calls named operations such as `calculateShipping`, `convertCurrency`, or `generateInvoice` and receives a result associated with the request ID.

**Typical interaction:** The client sends a JSON-RPC 2.0 request with a method name, parameters, and an ID. The server executes the named method and returns either a result or a structured error with the same ID.

Example request:

```json
{
  "jsonrpc": "2.0",
  "method": "add",
  "params": { "a": 10, "b": 20 },
  "id": 1
}
```

Example response:

```json
{
  "jsonrpc": "2.0",
  "result": 30,
  "id": 1
}
```

**Why JSON-RPC fits:** It focuses on calling procedures rather than manipulating resource URLs. The protocol gives a consistent request, response, ID, and error structure.

**How this repository relates:** The demo exposes `add` and `multiply` methods at `POST /rpc`. It also demonstrates a method-not-found error. A real calculation service would define its supported methods and parameter schemas, enforce limits, and protect sensitive operations.

**Use JSON-RPC when:** Your application is naturally command-oriented and you want a compact JSON request/response protocol for remote method calls.

**Think about:** Method allowlists, parameter validation, authentication, authorization, request correlation, timeouts, safe error details, and whether standard REST or gRPC conventions would better suit the ecosystem.

### 6. gRPC — communication between microservices in a delivery platform

**Real-life scenario:** A delivery platform has separate order, customer, pricing, and courier services. When an order is assigned, the order service needs to call the courier service to retrieve courier details. The teams want a strongly defined service contract and generated client code.

**Typical interaction:**
1. Engineers define a service and message types in a `.proto` file.
2. A client uses the generated or loaded service definition to call a method such as `GetUser` or `GetCourier`.
3. The gRPC server receives a typed request and invokes the matching handler.
4. The server returns a typed response or a gRPC status error.

**Why gRPC fits:** Protocol Buffers provide a compact schema-based message format, while gRPC provides remote procedure calls over HTTP/2. It supports unary calls and streaming patterns.

**How this repository relates:** The demo defines `UserService` in `src/grpc/user.proto`, starts a gRPC server, and includes a Node.js client that calls `GetUser`. It demonstrates a typed service call between processes; it is not yet a full microservices platform.

**Use gRPC when:** Internal services need typed contracts, efficient service-to-service communication, generated clients, or streaming RPCs across supported languages.

**Think about:** TLS and service identity, deadlines, cancellation, retries with safe idempotency rules, backward-compatible protobuf changes, observability, load balancing, and browser compatibility. Browser clients commonly need gRPC-Web or a gateway rather than a direct native gRPC connection.

### 7. Webhooks — payment confirmation from an online payment provider

**Real-life scenario:** A customer pays for an order through an external payment provider. The customer may close the browser before the payment finishes, so the store cannot rely only on the browser redirect to learn the final payment result.

**Typical interaction:**
1. The store registers a webhook endpoint with the payment provider.
2. A payment succeeds or fails.
3. The provider sends an HTTP POST event such as `payment.succeeded` to the store's endpoint.
4. The store verifies the provider's signature and checks the event ID.
5. The store records the event and updates the order's payment state.
6. The endpoint acknowledges receipt; slower business processing can be handled asynchronously.

**Why webhooks fit:** The provider notifies your application when an event happens. Your application does not need to continuously poll the provider asking whether the payment status changed.

**How this repository relates:** The webhook demo accepts an event name and data at `POST /webhooks/events`, then responds with HTTP 202. It demonstrates receiving an event only. It does **not** verify a signature, persist events, deduplicate retries, or update an order.

**Use webhooks when:** An external service needs to notify your application about payment changes, repository events, form submissions, shipping updates, or other asynchronous events.

**Think about:** Verify signatures against the raw request body, validate timestamps where supported, prevent replay attacks, store event IDs, process idempotently, acknowledge quickly, retry safely, and monitor failed deliveries. Never treat an unverified webhook payload as proof of payment.

### 8. Server-Sent Events (SSE) — live order tracking or monitoring dashboard

**Real-life scenario:** A customer opens an order-tracking page. The page needs to receive status changes such as `Order confirmed`, `Preparing`, `Courier assigned`, and `Delivered`. The customer does not need to send continuous messages back over the same connection.

**Typical interaction:**
1. The browser opens an HTTP connection using the JavaScript `EventSource` API.
2. The server responds with the `text/event-stream` content type.
3. When the order status changes, the server writes an event with an optional ID, event name, and data.
4. The browser receives the event and updates the page.
5. If the connection drops, EventSource can reconnect automatically; event IDs can help an application resume delivery when supported by its server design.

**Why SSE fits:** It provides a straightforward one-way stream from server to browser over HTTP. It is often simpler than WebSockets when the browser only needs to receive updates.

**How this repository relates:** The SSE demo sends ten `update` events, one per second, to a connected browser. Open `examples/sse-client.html` to see the stream. A real order-tracking service would publish actual order state changes, authenticate the subscriber, and scope each stream to orders that the customer is allowed to view.

**Use SSE when:** A browser needs live server updates such as order progress, notifications, job progress, logs, or monitoring metrics, and the client does not need a two-way message channel.

**Think about:** Authentication, authorization for each stream, reconnect and replay behavior, event IDs, heartbeat strategy, proxy buffering, connection limits, and cleanup when clients disconnect. Use WebSockets if the client also needs frequent real-time messages.

### How these APIs can work together in one real application

Imagine an online ordering platform. It would rarely use only one API style. Different parts of the same product can benefit from different communication patterns:

| Business requirement | Possible API choice | Example |
|---|---|---|
| Mobile app reads products and places orders | REST | `GET /products`, `POST /orders` |
| A complex screen needs selected customer and order fields | GraphQL | Query order details and customer profile |
| An existing supplier requires an XML contract | SOAP | Submit a purchase order to the supplier |
| Customer and support agent exchange live messages | WebSocket | Two-way support chat |
| A service requests a calculation by method name | JSON-RPC | Calculate shipping cost |
| Internal services exchange typed requests | gRPC | Order service calls inventory service |
| Payment provider reports a completed transaction | Webhook | Notify the store that payment succeeded |
| Customer watches delivery progress | SSE | Stream order status updates to the browser |

**Example end-to-end order journey:**

1. The mobile app uses REST to submit an order.
2. The order service calls an internal inventory service using gRPC to reserve stock.
3. The payment provider processes the payment and sends a webhook when it succeeds.
4. The backend validates and records the event, then marks the order as paid.
5. The order-tracking page receives status changes through SSE.
6. If the customer contacts support, a WebSocket connection can provide live chat.

This is one possible architecture, not a mandatory design. Select technologies based on the actual clients, integration contracts, traffic, operational skills, security requirements, and complexity of the problem.

### Quick decision guide

| If your main requirement is... | Consider... | Because... |
|---|---|---|
| Standard resource operations and broad compatibility | REST | Familiar HTTP semantics and resource URLs |
| Flexible selection of related data | GraphQL | Clients specify the fields they need |
| Integration with a SOAP-required enterprise partner | SOAP | Formal XML service contracts and ecosystem compatibility |
| Continuous two-way interaction | WebSocket | Both sides can send messages over a persistent connection |
| Calling named operations using JSON | JSON-RPC | Method-oriented request and response structure |
| Typed, efficient service-to-service calls | gRPC | Protobuf contracts and HTTP/2-based RPC |
| Receiving event notifications from another system | Webhooks | The sender notifies your endpoint when something happens |
| One-way live updates to a browser | SSE | Simple HTTP event streaming from server to client |

No API style is universally best. A good design starts with the communication requirement and chooses the simplest approach that satisfies it.

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
