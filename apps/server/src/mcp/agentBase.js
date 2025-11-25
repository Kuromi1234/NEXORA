export class BaseAgent {
  constructor({ id, name, role, capabilities = [] }) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.capabilities = capabilities;
    this.status = "idle";
  }

  async handleTask(task) {
    console.log(`🧠 [${this.name}] handling task:`, task);
    // Later: Add LLM logic, API call, or plugin trigger here
    return { status: "success", data: `Result from ${this.name}` };
  }
}
