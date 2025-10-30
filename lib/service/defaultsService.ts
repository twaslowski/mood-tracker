"use server";

import { createClient } from "@/lib/supabase/server";
import { Default, DefaultSchema } from "@/types/default";

export const configureDefaultTracking = async (userId: string) => {
  const supabase = await createClient();
  const defaults = await getTrackingDefaults();

  for (const d of defaults) {
    const { error } = await supabase.from("metric_tracking").insert({
      user_id: userId,
      metric_id: d.metric_id,
      baseline: d.baseline,
      tracked_at: new Date().toISOString(),
    });
    if (error) {
      throw new Error("Failed to set up default tracking: " + error.message);
    }
  }
};

export const getTrackingDefaults = async (): Promise<Default[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tracking_default").select("*");

  if (error || !data) {
    throw new Error(`Error fetching system metrics: ${error.message}`);
  }

  return data.map((item) => DefaultSchema.parse(item));
};
