import { z } from "zod";

export const MetricSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  labels: z.record(z.string(), z.number()),
  owner_id: z.string(),
  creation_timestamp: z.string(),
  update_timestamp: z.string(),
  metric_type: z.enum(["discrete", "continuous", "duration"]),
  min_value: z.number().nullable(),
  max_value: z.number().nullable(),
});

export type Metric = z.infer<typeof MetricSchema>;
