"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserId } from "@/lib/service/user.ts";
import { revalidatePath } from "next/cache";
import { MetricType } from "@/types/metric.ts";

export const trackMetric = async (metricId: string, baseline: number = 0) => {
  const supabase = await createClient();
  const userId = await getUserId(supabase);

  const { error } = await supabase.from("metric_tracking").insert({
    user_id: userId,
    metric_id: metricId,
    baseline: baseline,
    tracked_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Failed to track metric: ${error.message}`);
  }

  revalidatePath("/protected/metrics");
};

export const untrackMetric = async (metricId: string) => {
  const supabase = await createClient();
  const userId = await getUserId(supabase);

  const { error } = await supabase
    .from("metric_tracking")
    .delete()
    .eq("user_id", userId)
    .eq("metric_id", metricId);

  if (error) {
    throw new Error(`Failed to untrack metric: ${error.message}`);
  }

  revalidatePath("/protected/metrics");
};

export const updateBaseline = async (metricId: string, baseline: number) => {
  const supabase = await createClient();
  const userId = await getUserId(supabase);

  const { error } = await supabase
    .from("metric_tracking")
    .update({ baseline })
    .eq("user_id", userId)
    .eq("metric_id", metricId);

  if (error) {
    throw new Error(`Failed to update baseline: ${error.message}`);
  }

  revalidatePath("/protected/metrics");
};

export const createMetric = async (metricData: {
  name: string;
  description: string;
  metric_type: MetricType;
  labels: Record<string, number>;
  min_value: number | null;
  max_value: number | null;
}) => {
  const supabase = await createClient();
  const userId = await getUserId(supabase);

  const { data, error } = await supabase
    .from("metric")
    .insert({
      name: metricData.name,
      description: metricData.description,
      metric_type: metricData.metric_type,
      labels: metricData.labels,
      min_value: metricData.min_value,
      max_value: metricData.max_value,
      owner_id: userId,
      creation_timestamp: new Date().toISOString(),
      update_timestamp: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create metric: ${error.message}`);
  }

  revalidatePath("/protected/metrics");
  return data;
};

export const updateMetric = async (
  metricId: string,
  metricData: {
    name: string;
    description: string;
    metric_type: MetricType;
    labels: Record<string, number>;
    min_value: number | null;
    max_value: number | null;
  },
) => {
  const supabase = await createClient();
  const userId = await getUserId(supabase);

  const { data, error } = await supabase
    .from("metric")
    .update({
      name: metricData.name,
      description: metricData.description,
      metric_type: metricData.metric_type,
      labels: metricData.labels,
      min_value: metricData.min_value,
      max_value: metricData.max_value,
      update_timestamp: new Date().toISOString(),
    })
    .eq("id", metricId)
    .eq("owner_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update metric: ${error.message}`);
  }

  revalidatePath("/protected/metrics");
  return data;
};

export const deleteMetric = async (metricId: string) => {
  const supabase = await createClient();
  const userId = await getUserId(supabase);

  const { error } = await supabase
    .from("metric")
    .delete()
    .eq("id", metricId)
    .eq("owner_id", userId);

  if (error) {
    throw new Error(`Failed to delete metric: ${error.message}`);
  }
  revalidatePath("/protected/metrics");
};
