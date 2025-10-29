export interface Metric {
  id: string;
  name: string;
  description: string;
  labels: Record<string, string> | null;
  owner_id: string;
  creation_timestamp: string;
  update_timestamp: string;
  metric_type: "discrete" | "continuous" | "duration" | string;
  min_value: number | null;
  max_value: number | null;
}
