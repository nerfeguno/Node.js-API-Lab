const express = require("express");
const { XMLParser, XMLBuilder } = require("fast-xml-parser");

const app = express();
const parser = new XMLParser({ ignoreAttributes: false });
const builder = new XMLBuilder({ ignoreAttributes: false });

app.post("/soap", express.text({ type: ["text/xml", "application/soap+xml"], limit: "20kb" }), (req, res) => {
  try {
    const parsed = parser.parse(req.body);
    const envelope = parsed["soap:Envelope"] || parsed.Envelope || parsed;
    const body = envelope["soap:Body"] || envelope.Body || envelope;
    const operation = body.GetUser || body["m:GetUser"];
    if (!operation) return res.status(400).type("text/plain").send("Expected GetUser XML operation");

    const userId = String(operation.UserId ?? "");
    const xml = builder.build({
      "soap:Envelope": {
        "@_xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
        "soap:Body": {
          GetUserResponse: { UserId: userId, Name: "John Example" }
        }
      }
    });
    res.status(200).type("application/xml").send(`<?xml version="1.0"?>${xml}`);
  } catch {
    res.status(400).type("text/plain").send("Invalid XML");
  }
});

app.listen(3003, () => console.log("SOAP-style XML demo: http://localhost:3003/soap"));
