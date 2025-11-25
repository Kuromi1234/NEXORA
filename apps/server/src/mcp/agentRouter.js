import { agentRegistry } from "./agentRegistry.js";

class TaskRouter {
  async route(task) {
    console.log("📨 Incoming Task:", task);

    const availableAgents = agentRegistry.listAgents();

    if (availableAgents.length === 0)
      return { error: "No active agents available" };

    // Simple routing logic for now — later we’ll do skill-based routing
    const agent = availableAgents[0];
    const result = await agent.handleTask(task);
    return result;
  }
}

export const taskRouter = new TaskRouter();
