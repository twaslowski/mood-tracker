import { Metric } from "@/types/metric";

export interface MetricTracking {
  user_id: string;
  metric_id: string;
  tracked_at: string;
  baseline: number;
}

export interface TrackingWithMetric extends MetricTracking {
  metric: Metric;
}
