const express = require("express");
const app = express();
app.use(express.json({ limit: "20kb" }));

let users = [
  { id: 1, name: "John", email: "john@example.com" },
  { id: 2, name: "Maria", email: "maria@example.com" }
];
let nextId = 3;

app.get("/", (_req, res) => {
  res.json({ message: "REST API Lab", endpoints: ["/users", "/users/:id"] });
});

app.get("/users", (_req, res) => res.json(users));

app.get("/users/:id", (req, res) => {
  const user = users.find(item => item.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

app.post("/users", (req, res) => {
  const { name, email } = req.body || {};
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "name is required" });
  }
  const user = { id: nextId++, name: name.trim(), email: typeof email === "string" ? email : null };
  users.push(user);
  res.status(201).json(user);
});

app.patch("/users/:id", (req, res) => {
  const user = users.find(item => item.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  if (typeof req.body?.name === "string" && req.body.name.trim()) user.name = req.body.name.trim();
  if (typeof req.body?.email === "string") user.email = req.body.email;
  res.json(user);
});

app.delete("/users/:id", (req, res) => {
  const before = users.length;
  users = users.filter(item => item.id !== Number(req.params.id));
  if (users.length === before) return res.status(404).json({ error: "User not found" });
  res.status(204).end();
});

app.listen(3001, () => console.log("REST API: http://localhost:3001"));
