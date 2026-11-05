const path = require("node:path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "user.proto"),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);
const loaded = grpc.loadPackageDefinition(packageDefinition);
const client = new loaded.UserService(
  "127.0.0.1:50051",
  grpc.credentials.createInsecure()
);

client.GetUser({ id: 1 }, (error, user) => {
  if (error) {
    console.error(error.message);
    process.exitCode = 1;
  } else {
    console.log("gRPC response:", user);
  }
  client.close();
});
