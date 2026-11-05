# API Architecture and Sequence Diagrams

This guide visualizes how the eight communication styles in **Node.js API Lab** work between clients, application servers, and external services.

The diagrams are conceptual learning examples. They explain common communication flows; they do not imply that every component shown is implemented in this repository.

## 1. High-level API architecture

A single application can use several API styles. Choose the communication pattern that best matches each interaction rather than forcing every feature through one protocol.

~~~mermaid
flowchart TB
    Client["Web / Mobile Client"]
    Admin["Admin Dashboard"]
    Partner["External Partner / Payment Provider"]

    subgraph App["Application Platform"]
        REST["REST API"]
        GQL["GraphQL API"]
        WS["WebSocket Server"]
        RPC["JSON-RPC Endpoint"]
        SSE["SSE Endpoint"]
        Webhook["Webhook Receiver"]
        SOAP["SOAP Integration"]
        GRPC["gRPC Services"]
        Domain["Business Logic"]
        DB[("Database")]
        Events[("Event / Message Broker")]
    end

    Client -->|"HTTP JSON"| REST
    Client -->|"GraphQL query / mutation"| GQL
    Client <-->|"WebSocket messages"| WS
    Client -->|"JSON-RPC request"| RPC
    Client <--|"Event stream"| SSE
    Admin -->|"HTTP / GraphQL"| REST
    Partner -->|"SOAP XML"| SOAP
    Partner -->|"Event POST"| Webhook

    REST --> Domain
    GQL --> Domain
    WS --> Domain
    RPC --> Domain
    SOAP --> Domain
    Webhook --> Domain
    Domain <--> DB
    Domain --> Events
    Events --> SSE
    Events --> WS
    Domain <-->|"Typed RPC"| GRPC
~~~

**How to read it:**
- Clients use REST, GraphQL, JSON-RPC, WebSocket, or SSE according to the feature's needs.
- External systems may integrate through SOAP or send webhook events.
- Internal services can communicate using gRPC.
- Business logic and persistent storage sit behind the API boundary.
- An event broker is a common production design for distributing updates to WebSocket and SSE clients; it is illustrative here.

## 2. REST — request and response

**Scenario:** A shopping app retrieves a product and creates an order. REST uses resource URLs and standard HTTP methods.

~~~mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant App as Shopping App
    participant API as REST API
    participant Service as Order / Product Logic
    participant DB as Database

    Customer->>App: Open product page
    App->>API: GET /products/42
    API->>Service: Get product 42
    Service->>DB: Read product
    DB-->>Service: Product record
    Service-->>API: Product data
    API-->>App: 200 OK + JSON
    App-->>Customer: Display product

    Customer->>App: Place order
    App->>API: POST /orders + JSON
    API->>Service: Validate and create order
    Service->>DB: Save order
    DB-->>Service: Saved order
    Service-->>API: Order created
    API-->>App: 201 Created + order JSON
    App-->>Customer: Show order confirmation
~~~

**Key points:** The client initiates each request. The server responds with a status code and representation. GET reads a resource; POST commonly creates one.

## 3. GraphQL — client-selected fields

**Scenario:** A social app requests only the profile fields needed for a screen. The client sends a GraphQL document to one GraphQL endpoint.

~~~mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as Social App
    participant GQL as GraphQL Endpoint
    participant Resolver as Query Resolvers
    participant DB as Data Sources

    User->>App: Open profile
    App->>GQL: POST /graphql with profile query
    GQL->>GQL: Parse and validate query
    GQL->>Resolver: Resolve user(id: 42)
    Resolver->>DB: Read user record
    DB-->>Resolver: User data
    Resolver-->>GQL: Resolved fields
    GQL-->>App: 200 + requested JSON fields
    App-->>User: Render profile

    User->>App: Update profile name
    App->>GQL: POST /graphql with mutation
    GQL->>GQL: Validate mutation
    GQL->>Resolver: Resolve update operation
    Resolver->>DB: Save updated profile
    DB-->>Resolver: Updated record
    Resolver-->>GQL: Mutation result
    GQL-->>App: Mutation response
    App-->>User: Show updated profile
~~~

**Key points:** The schema defines available types and operations. Queries read data; mutations change data. The response follows the requested selection set.

## 4. SOAP — XML service integration

**Scenario:** An enterprise application requests policy information from a partner system that requires SOAP. This is a conceptual standards-based SOAP exchange, not the simplified XML-over-HTTP demo implementation in this repository.

~~~mermaid
sequenceDiagram
    autonumber
    participant Client as Insurance Application
    participant Gateway as SOAP Endpoint
    participant Contract as Contract / Validation
    participant Service as Policy Service
    participant DB as Policy Database

    Client->>Gateway: HTTP POST with SOAP XML envelope
    Gateway->>Contract: Validate envelope and operation
    Contract-->>Gateway: Message is valid
    Gateway->>Service: GetPolicy(policyId)
    Service->>DB: Find policy
    DB-->>Service: Policy record
    Service-->>Gateway: Policy details
    Gateway->>Gateway: Build SOAP response envelope
    Gateway-->>Client: HTTP response with SOAP XML
~~~

**Key points:** Real SOAP systems use defined envelope and fault structures, namespaces, and often WSDL/XSD contracts. Security and other WS-* features depend on the integration requirements.

## 5. WebSocket — persistent two-way communication

**Scenario:** A customer and support agent exchange chat messages. Both sides can send messages after the connection is established.

~~~mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Browser as Customer Browser
    participant WS as WebSocket Server
    participant Router as Conversation Router
    participant Agent as Agent Browser

    Customer->>Browser: Open support chat
    Browser->>WS: WebSocket handshake
    WS-->>Browser: Connection accepted
    Agent->>WS: Connect to support channel
    WS-->>Agent: Connection accepted

    Customer->>Browser: Send message
    Browser->>WS: message event
    WS->>Router: Validate and route message
    Router-->>WS: Deliver to agent connection
    WS-->>Agent: message event
    Agent->>WS: Agent reply
    WS->>Router: Route reply
    Router-->>WS: Deliver to customer connection
    WS-->>Browser: message event
    Browser-->>Customer: Display reply
~~~

**Key points:** The connection stays open, and either endpoint can send data. Production systems need authentication, authorization, room routing, reconnect handling, and horizontal message distribution.

## 6. JSON-RPC — call a named method

**Scenario:** A client asks a remote service to calculate a shipping price. JSON-RPC uses a method name, parameters, and request ID.

~~~mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as Checkout App
    participant RPC as JSON-RPC Endpoint
    participant Methods as Method Dispatcher
    participant Pricing as Pricing Logic

    User->>App: Request shipping estimate
    App->>RPC: JSON-RPC calculateShipping(params, id=7)
    RPC->>RPC: Validate JSON-RPC request
    RPC->>Methods: Dispatch calculateShipping
    Methods->>Pricing: Calculate destination and package cost
    Pricing-->>Methods: Shipping amount
    Methods-->>RPC: Result
    RPC-->>App: JSON-RPC result with id=7
    App-->>User: Display shipping estimate
~~~

**Key points:** The response ID correlates with the request. A failed call returns a structured JSON-RPC error instead of a result. Expose only explicitly allowed methods.

## 7. gRPC — typed service-to-service call

**Scenario:** An order service asks a courier service for courier details. Both services share a Protocol Buffers contract.

~~~mermaid
sequenceDiagram
    autonumber
    participant Order as Order Service
    participant Client as Generated gRPC Client
    participant Network as HTTP/2 + Protobuf
    participant Server as Courier gRPC Server
    participant DB as Courier Database

    Order->>Client: GetCourier(courierId)
    Client->>Client: Encode typed request
    Client->>Network: Send gRPC call
    Network->>Server: Deliver RPC request
    Server->>Server: Decode and validate request
    Server->>DB: Find courier
    DB-->>Server: Courier record
    Server->>Server: Build typed response
    Server-->>Network: Protobuf response + gRPC status
    Network-->>Client: Return response
    Client-->>Order: GetCourier response
~~~

**Key points:** The .proto file defines messages and service methods. gRPC commonly uses HTTP/2 and Protocol Buffers. Deadlines, cancellation, status codes, TLS, and compatible schema evolution matter in real systems.

## 8. Webhooks — event notification from an external service

**Scenario:** A payment provider notifies a store when a payment succeeds. The store should verify and safely process the event before changing order state.

~~~mermaid
sequenceDiagram
    autonumber
    participant Provider as Payment Provider
    participant Endpoint as Store Webhook Endpoint
    participant Verify as Signature Verification
    participant Queue as Event Queue
    participant Worker as Payment Worker
    participant DB as Order Database

    Provider->>Endpoint: POST payment.succeeded + signature
    Endpoint->>Verify: Verify signature and timestamp
    Verify-->>Endpoint: Signature valid
    Endpoint->>DB: Check whether event ID was processed
    DB-->>Endpoint: Event is new
    Endpoint->>Queue: Persist / enqueue event
    Queue-->>Endpoint: Event accepted
    Endpoint-->>Provider: 2xx acknowledgement
    Queue->>Worker: Deliver queued event
    Worker->>DB: Mark order as paid
    DB-->>Worker: Update committed
~~~

**Key points:** Providers may retry delivery. Verify signatures, deduplicate event IDs, process idempotently, persist before acknowledging when appropriate, and monitor failures. The repository's webhook example does not implement these production safeguards.

## 9. Server-Sent Events (SSE) — one-way live updates

**Scenario:** A browser tracks an order. The browser opens one HTTP event stream and the server sends status updates as they occur.

~~~mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Browser as Order Tracking Page
    participant SSE as SSE Endpoint
    participant Events as Order Event Source
    participant DB as Order Database

    Customer->>Browser: Open tracking page
    Browser->>SSE: GET /events (EventSource)
    SSE-->>Browser: 200 text/event-stream
    Events->>DB: Observe order status changes
    DB-->>Events: Status changed to Preparing
    Events->>SSE: Publish order update
    SSE-->>Browser: event: update + data
    Browser-->>Customer: Show Preparing

    Events->>DB: Observe next status change
    DB-->>Events: Status changed to Out for delivery
    Events->>SSE: Publish order update
    SSE-->>Browser: event: update + data
    Browser-->>Customer: Show Out for delivery
~~~

**Key points:** SSE is server-to-client. Browsers can reconnect using EventSource; robust applications should plan event IDs, replay behavior, authorization, heartbeats, and proxy buffering.

## 10. Choosing the right communication pattern

| Requirement | Good starting point |
|---|---|
| Read, create, update, and delete resources | REST |
| Request selected fields from related data | GraphQL |
| Integrate with a SOAP-required system | SOAP |
| Two-way real-time communication | WebSocket |
| Invoke named operations with JSON | JSON-RPC |
| Typed internal service calls | gRPC |
| Receive external event notifications | Webhooks |
| Stream server updates to a browser | SSE |

These approaches can coexist. Prefer the least complex option that meets the requirements, and design authentication, authorization, validation, observability, and failure handling around the chosen protocol.
