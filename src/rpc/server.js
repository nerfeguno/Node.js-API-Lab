const express = require("express");
const app = express();
app.use(express.json({ limit: "20kb" }));

const methods = {
  add: ({ a, b }) => Number(a) + Number(b),
  multiply: ({ a, b }) => Number(a) * Number(b)
};

app.post("/rpc", (req, res) => {
  const { jsonrpc, method, params = {}, id } = req.body || {};
  if (jsonrpc !== "2.0" || typeof method !== "string") {
    return res.status(400).json({
      jsonrpc: "2.0", error: { code: -32600, message: "Invalid Request" }, id: id ?? null
    });
  }
  if (!Object.prototype.hasOwnProperty.call(methods, method)) {
    return res.json({
      jsonrpc: "2.0", error: { code: -32601, message: "Method not found" }, id: id ?? null
    });
  }
  try {
    return res.json({ jsonrpc: "2.0", result: methods[method](params), id: id ?? null });
  } catch {
    return res.json({
      jsonrpc: "2.0", error: { code: -32603, message: "Internal error" }, id: id ?? null
    });
  }
});

app.listen(3005, () => console.log("JSON-RPC demo: http://localhost:3005/rpc"));
