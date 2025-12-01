import fs from "fs";
import path from "path";
import YAML from "yaml";
import { PluginSchema } from "./validator.js";
import { logger } from "../utils/logger.js";

export function loadPlugin(filePath) {
  try {
    const file = fs.readFileSync(filePath, "utf-8");
    const isYaml = filePath.endsWith(".yaml") || filePath.endsWith(".yml");
    const raw = isYaml ? YAML.parse(file) : JSON.parse(file);

    const parsed = PluginSchema.parse(raw);

    logger.info(`📦 Plugin Loaded: ${parsed.name}`);
    return parsed;

  } catch (error) {
    logger.error(`❌ Plugin load failed (${filePath}): ${error.message}`);
    return null;
  }
}
