import chokidar from "chokidar";
import path from "path";
import { loadPlugin } from "./loader.js";
import { logger } from "../utils/logger.js";

class PluginRegistry {
  constructor() {
    this.plugins = new Map();
  }

  register(filePath) {
    const plugin = loadPlugin(filePath);
    if (!plugin) return;

    this.plugins.set(plugin.name, plugin);
    logger.info(`🔌 Registered plugin: ${plugin.name}`);
  }

  unregister(name) {
    this.plugins.delete(name);
    logger.warn(`🔌 Removed plugin: ${name}`);
  }

  getPlugin(name) {
    return this.plugins.get(name);
  }

  listPlugins() {
    return Array.from(this.plugins.values());
  }
}

export const pluginRegistry = new PluginRegistry();

export function initPluginWatcher() {
  const pluginFolder = path.resolve("src/plugins_data");

  chokidar
    .watch(pluginFolder, { ignoreInitial: false })
    .on("add", (file) => pluginRegistry.register(file))
    .on("change", (file) => pluginRegistry.register(file))
    .on("unlink", (file) => {
      const pluginName = path.basename(file).split(".")[0];
      pluginRegistry.unregister(pluginName);
    });

  logger.info("👀 Plugin hot-reload watcher active...");
}
