import { z } from "zod";

export const MetricSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  labels: z.record(z.number(), z.string()),
  owner_id: z.string(),
  creation_timestamp: z.string(),
  update_timestamp: z.string(),
  metric_type: z.enum(["discrete", "continuous", "duration"]),
  min_value: z.number().nullable(),
  max_value: z.number().nullable(),
});

export const EntryValueSchema = z.object({
  value: z.number(),
  metric_id: z.number(),
});

export const EntrySchema = z.object({
  id: z.number(),
  user_id: z.string(),
  recorded_at: z.string(),
  creation_timestamp: z.string(),
  updated_timestamp: z.string(),
  values: z.array(EntryValueSchema),
});
