import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { initWebSocket } from "./mcp/websocket.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => res.send("✅ NEXORA MCP Server live"));

const server = http.createServer(app);
initWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
