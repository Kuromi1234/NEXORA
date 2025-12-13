import { AgentBase } from "./AgentBase.js";
import { logger } from "../utils/logger.js";

class AgentManager {
  constructor() {
    this.agents = new Map();
  }

  register(agentInstance) {
    if (!(agentInstance instanceof AgentBase)) {
      throw new Error("Invalid agent type");
    }

    this.agents.set(agentInstance.id, agentInstance);
    logger.info(`🤖 Agent registered: ${agentInstance.name}`);
    return agentInstance.id;
  }

  get(id) {
    return this.agents.get(id);
  }

  broadcast(msg) {
    for (let agent of this.agents.values()) {
      agent.onMessage(msg);
    }
  }
}

export const agentManager = new AgentManager();
