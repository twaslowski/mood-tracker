import { z } from "zod";

export const DefaultSchema = z.object({
  metric_id: z.string(),
  baseline: z.number(),
});

export type Default = z.infer<typeof DefaultSchema>;
