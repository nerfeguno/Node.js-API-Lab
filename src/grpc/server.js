const path = require("node:path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "user.proto"),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);
const loaded = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();

server.addService(loaded.UserService.service, {
  GetUser(call, callback) {
    const id = call.request.id;
    callback(null, {
      id,
      name: id === 1 ? "John" : "Sample User",
      email: id === 1 ? "john@example.com" : "user@example.com"
    });
  }
});

server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) throw error;
    server.start();
    console.log(`gRPC server listening on ${port}`);
  }
);
