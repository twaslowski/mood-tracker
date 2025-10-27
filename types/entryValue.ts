import { Metric } from "@/types/metric";

export interface EntryValue {
  record_id: number;
  metric_id: number;
  value: number;
}

export interface EntryValueWithMetric extends EntryValue {
  metric: Metric;
}

export function validateEntryValue(value: number, metric: Metric): boolean {
  if (metric.min_value !== null && value < metric.min_value) return false;
  if (metric.max_value !== null && value > metric.max_value) return false;
  return true;
}
