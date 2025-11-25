import { BaseAgent } from "./agentBase.js";
import { v4 as uuidv4 } from "uuid";

class AgentRegistry {
  constructor() {
    this.agents = new Map();
  }

  registerAgent(agentConfig) {
    const id = uuidv4();
    const agent = new BaseAgent({ id, ...agentConfig });
    this.agents.set(id, agent);
    console.log(`✅ Registered agent: ${agent.name}`);
    return agent;
  }

  unregisterAgent(id) {
    this.agents.delete(id);
    console.log(`❌ Agent removed: ${id}`);
  }

  getAgent(id) {
    return this.agents.get(id);
  }

  listAgents() {
    return Array.from(this.agents.values());
  }
}

export const agentRegistry = new AgentRegistry();
