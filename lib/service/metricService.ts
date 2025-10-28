"use server";

import { TrackingWithMetric } from "@/types/metricTracking";
import { createClient } from "@/lib/supabase/server";

export const getTrackedMetrics = async (): Promise<TrackingWithMetric[]> => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error(`Error fetching user: ${error?.message}`);
  }

  return getUserTrackedMetrics(user.id);
};

export const getUserTrackedMetrics = async (
  userId: string,
): Promise<TrackingWithMetric[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("metric_tracking")
    .select("metric_id, baseline, tracked_at, metric(*)")
    .eq("user_id", userId);

  if (error || !data) {
    throw new Error(`Error fetching user tracked metrics: ${error?.message}`);
  }

  return data as TrackingWithMetric[];
};
