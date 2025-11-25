import { z } from "zod";

const MetricType = z.enum(["discrete", "continuous", "event"]);

export const MetricSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  labels: z.record(z.string(), z.number()),
  owner_id: z.string(),
  creation_timestamp: z.string(),
  update_timestamp: z.string(),
  metric_type: MetricType,
  min_value: z.number().nullable(),
  max_value: z.number().nullable(),
});

export const deriveHumanReadableMetricType = (metricType: MetricType) => {
  switch (metricType) {
    case "discrete":
      return "🎨 Vibe";
    case "continuous":
      return "🔢 Measurement";
    case "event":
      return "⭐ Moment";
  }
};

export type MetricType = z.infer<typeof MetricType>;
export type Metric = z.infer<typeof MetricSchema>;
