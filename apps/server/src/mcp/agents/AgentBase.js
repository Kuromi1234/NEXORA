import { v4 as uuidv4 } from "uuid";

export class AgentBase {
  constructor(id, name) {
    this.id = id || uuidv4();
    this.name = name || "unnamed-agent";
    this.memory = new Map(); // temporary memory
  }

  // incoming messages
  onMessage(msg) {
    throw new Error("onMessage must be implemented by derived agent");
  }

  // tool usage
  async onToolUse(tool, payload) {
    throw new Error("onToolUse must be overridden");
  }

  // health/status
  reportStatus() {
    return {
      id: this.id,
      name: this.name,
      memorySize: this.memory.size,
      timestamp: Date.now()
    };
  }
}
