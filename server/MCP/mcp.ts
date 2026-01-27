export type MCPMessage = {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  timestamp: number;
};

export type MCPContext = {
  sessionId: string;
  messages: MCPMessage[];
};

export interface MCP {
  receiveUserMessage(
    sessionId: string,
    content: string
  ): Promise<void>;

  dispatchToAgent(
    agentName: string,
    context: MCPContext
  ): Promise<void>;

  registerAgent(agent: Agent): void;
}
