import { type MetricTracking, MetricTrackingSchema } from "@/types/tracking";
import { createClient } from "@/lib/supabase/server";
import { getUserId } from "@/lib/service/userService";
import { Metric, MetricSchema } from "@/types/metric";

export const getTrackedMetrics = async (): Promise<MetricTracking[]> => {
  const supabase = await createClient();
  const userId = await getUserId(supabase);

  return getUserTrackedMetrics(userId);
};

export const getUserTrackedMetrics = async (
  userId: string,
): Promise<MetricTracking[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("metric_tracking")
    .select("user_id, baseline, tracked_at, metric(*)")
    .eq("user_id", userId);

  if (error || !data) {
    throw new Error(`Error fetching user tracked metrics: ${error?.message}`);
  }

  return data.map((item) => MetricTrackingSchema.parse(item));
};

export const getAllMetrics = async (): Promise<Metric[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("metric")
    .select("*")
    .order("name");

  if (error || !data) {
    throw new Error(`Error fetching all metrics: ${error?.message}`);
  }

  return data.map((item) => MetricSchema.parse(item));
};

export const getTrackedMetricIds = async (): Promise<Set<string>> => {
  const trackedMetrics = await getTrackedMetrics();
  return new Set(trackedMetrics.map((tm) => tm.metric.id));
};
