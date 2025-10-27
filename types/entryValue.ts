import { Metric } from "@/types/metric";

export interface CreateEntryValue {
  metric_id: string;
  value: number;
}

export interface EntryValue extends CreateEntryValue {
  entry_id: number;
}

export function validateEntryValue(value: number, metric: Metric): boolean {
  if (metric.min_value !== null && value < metric.min_value) return false;
  if (metric.max_value !== null && value > metric.max_value) return false;
  return true;
}
