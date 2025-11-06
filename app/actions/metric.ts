"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserId } from "@/lib/service/userService";
import { revalidatePath } from "next/cache";

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

  revalidatePath("/protected/settings");
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

  revalidatePath("/protected/settings");
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

  revalidatePath("/protected/settings");
};
