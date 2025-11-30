import { z } from "zod";

export const PluginSchema = z.object({
  name: z.string(),
  type: z.enum(["api", "scraper", "tool"]),
  base_url: z.string().url().optional(),
  auth_type: z.enum(["none", "bearer", "api_key"]).optional(),
  headers: z.record(z.string()).optional(),
  actions: z.array(
    z.object({
      id: z.string(),
      method: z.enum(["GET", "POST"]),
      endpoint: z.string(),
      description: z.string().optional(),
      params: z.record(z.any()).optional()
    })
  )
});
