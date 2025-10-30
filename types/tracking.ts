import { MetricSchema } from "@/types/metric";
import { z } from "zod";

export const MetricTrackingSchema = z.object({
  user_id: z.string(),
  tracked_at: z.string(),
  baseline: z.number(),
  metric: MetricSchema,
});

export type MetricTracking = z.infer<typeof MetricTrackingSchema>;
