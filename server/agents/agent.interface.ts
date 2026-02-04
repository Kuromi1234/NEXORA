import { MCPContext } from "../MCP/mcp";

export interface Agent {
  name: string;
  description: string;

  onMessage(context: MCPContext): Promise<void>;

  reportStatus(): {
    healthy: boolean;
    lastActiveAt: number;
  };
}
