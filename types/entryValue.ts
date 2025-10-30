import { z } from "zod";

export const EntryValueSchema = z.object({
  value: z.number(),
  metric_id: z.string(),
});

export type EntryValue = z.infer<typeof EntryValueSchema>;
