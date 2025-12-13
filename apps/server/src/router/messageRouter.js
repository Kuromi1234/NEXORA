import { v4 as uuid } from "uuid";
import { agentManager } from "../agents/AgentManager.js";
import { logger } from "../utils/logger.js";

export async function routeMessage({ from, to, content }) {
  const correlationId = uuid();

  logger.info(`📨 Routing message`, {
    from, to, content, correlationId
  });

  const targetAgent = agentManager.get(to);

  if (!targetAgent) {
    logger.error(`❌ Agent ${to} not found`);
    return;
  }

  targetAgent.onMessage({
    content,
    from,
    correlationId,
    timestamp: Date.now()
  });
}
