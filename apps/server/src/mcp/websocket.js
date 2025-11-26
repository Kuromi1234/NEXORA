import { WebSocketServer } from "ws";
import { verifyToken } from "../utils/jwt.js";
import { agentRegistry } from "./agentRegistry.js";
import { logger } from "../utils/logger.js";

export function initWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws, req) => {
    try {
      const token = new URL(req.url, "http://localhost").searchParams.get("token");
      const decoded = verifyToken(token);
      const agentId = decoded.agentId;

      logger.info(`🔗 Agent connected: ${agentId}`);

      ws.on("message", (msg) => {
        const message = JSON.parse(msg.toString());
        handleMessage(agentId, message, ws);
      });

      ws.on("close", () => {
        logger.warn(`❌ Agent disconnected: ${agentId}`);
        agentRegistry.unregisterAgent(agentId);
      });
    } catch (err) {
      logger.error("❌ WebSocket auth failed:", err.message);
      ws.close();
    }
  });

  return wss;
}

function handleMessage(agentId, message, ws) {
  logger.info(`📩 [${agentId}] -> ${message.type}`, { message });

  // Handle internal communication
  if (message.type === "ping") {
    ws.send(JSON.stringify({ type: "pong" }));
  }
}
