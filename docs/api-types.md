# API Types: Beginner Reference

## Communication styles and protocols

| Type | Communication model | Common use |
|---|---|---|
| REST | Resource-oriented HTTP requests | Web and mobile backends |
| GraphQL | Client requests fields through a schema | Flexible data fetching |
| SOAP | Structured XML messages | Enterprise and legacy integrations |
| WebSocket | Persistent two-way connection | Chat, games, collaboration |
| RPC / JSON-RPC | Client invokes a named method | Remote operations |
| gRPC | Typed RPC, commonly HTTP/2 + Protobuf | Service-to-service systems |
| Webhook | Provider sends an event to a receiver | Payments, shipping, automation |
| SSE | Server streams events over HTTP | Notifications and live feeds |

## Simple mental models

- **REST:** "Give me this resource" or "Create this resource."
- **GraphQL:** "Give me these exact fields."
- **SOAP:** "Here is a structured XML message that follows a formal contract."
- **WebSocket:** "Keep this connection open so we can both send messages."
- **RPC:** "Run this named function remotely."
- **gRPC:** "Call this strongly typed remote service method."
- **Webhook:** "Notify my server when this event occurs."
- **SSE:** "Keep sending updates from the server to my browser."

## Access and composition categories

These are API governance or design categories, not wire protocols:

- **Public:** intended for external developers.
- **Private:** restricted to internal applications or teams.
- **Partner:** available to approved external organizations.
- **Composite:** combines multiple operations or backend services.

An API can belong to more than one category. For example, a private REST API can also be composite.

## Key distinctions

1. An API is an interface or contract, not necessarily a protocol.
2. REST is an architectural style; HTTP is a protocol.
3. GraphQL defines a query language and execution model.
4. SOAP messages use XML and formal envelope rules.
5. WebSockets support full-duplex communication over a persistent connection.
6. Webhooks are a pattern for event delivery, usually over HTTP.
7. SSE is unidirectional: server to client.
8. gRPC uses service definitions and message types, often described with Protocol Buffers.

## Choosing an approach

- Choose REST for straightforward resource-based services and broad tooling support.
- Consider GraphQL when clients need flexible field selection across related data.
- Use SOAP when integrating with a system that requires SOAP contracts or standards.
- Use WebSockets for frequent, low-latency two-way updates.
- Use webhooks when one system needs to notify another about events.
- Use SSE when the browser mainly needs a continuous stream from the server.
- Consider gRPC for typed, efficient communication between backend services.
- Use JSON-RPC when a lightweight method-call protocol fits the integration.

The best choice depends on clients, network constraints, reliability needs, ecosystem, and existing contracts—not on which technology is newest.
