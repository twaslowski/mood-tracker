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

export interface CreateMetricInput {
  name: string;
  description: string;
  metric_type: "discrete" | "continuous" | "duration";
  labels?: Record<string, string>;
  min_value?: number;
  max_value?: number;
  owner_id?: string; // Defaults to 'SYSTEM'
}

export function isValidMetricType(
  type: string,
): type is "discrete" | "continuous" | "duration" {
  return ["discrete", "continuous", "duration"].includes(type);
}
