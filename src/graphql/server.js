const express = require("express");
const { buildSchema } = require("graphql");
const { createHandler } = require("graphql-http/lib/use/express");

const app = express();
let users = [
  { id: "1", name: "John", email: "john@example.com" },
  { id: "2", name: "Maria", email: "maria@example.com" }
];
let nextId = 3;

const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String
  }
  type Query {
    users: [User!]!
    user(id: ID!): User
  }
  type Mutation {
    addUser(name: String!, email: String): User!
  }
`);

const root = {
  users: () => users,
  user: ({ id }) => users.find(user => user.id === id) || null,
  addUser: ({ name, email }) => {
    const user = { id: String(nextId++), name, email: email || null };
    users.push(user);
    return user;
  }
};

app.all("/graphql", createHandler({ schema, rootValue: root }));
app.listen(3002, () => console.log("GraphQL API: http://localhost:3002/graphql"));
