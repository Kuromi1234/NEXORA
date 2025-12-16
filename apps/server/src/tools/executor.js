import axios from "axios";
import { sandboxRun } from "./sandbox.js";
import { pluginRegistry } from "../plugins/registry.js";
import { logger } from "../utils/logger.js";

export async function executeTool({ pluginName, actionId, payload }) {
  const plugin = pluginRegistry.getPlugin(pluginName);
  if (!plugin) throw new Error("Plugin not found");

  const action = plugin.actions.find(a => a.id === actionId);
  if (!action) throw new Error("Invalid plugin action");

  const url = plugin.base_url + action.endpoint;

  const final = await sandboxRun(async () => {
    const res = await axios({
      url,
      method: action.method,
      headers: plugin.headers || {},
      params: payload
    });
    return res.data;
  });

  logger.info(`🛠️ Tool executed: ${pluginName}.${actionId}`);
  return final;
}
