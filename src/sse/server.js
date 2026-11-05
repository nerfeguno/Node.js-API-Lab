const express = require("express");
const app = express();

app.get("/events", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });
  res.flushHeaders();

  let count = 0;
  const timer = setInterval(() => {
    count += 1;
    res.write(`id: ${count}\n`);
    res.write("event: update\n");
    res.write(`data: ${JSON.stringify({ message: `Update ${count}`, timestamp: new Date().toISOString() })}\n\n`);
    if (count >= 10) {
      clearInterval(timer);
      res.end();
    }
  }, 1000);

  req.on("close", () => clearInterval(timer));
});

app.listen(3007, () => console.log("SSE demo: http://localhost:3007/events"));
