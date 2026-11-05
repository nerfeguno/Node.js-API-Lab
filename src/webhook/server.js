const express = require("express");
const app = express();
app.use(express.json({ limit: "100kb" }));

app.post("/webhooks/events", (req, res) => {
  const event = req.body;
  if (!event || typeof event.event !== "string") {
    return res.status(400).json({ error: "event field is required" });
  }

  console.log("Received webhook event:", event.event, event.data || {});
  // Production: verify the provider signature against the raw request body.
  // Store provider event IDs and process idempotently to handle retries safely.
  res.status(202).json({ accepted: true });
});

app.listen(3006, () => console.log("Webhook receiver: http://localhost:3006/webhooks/events"));
