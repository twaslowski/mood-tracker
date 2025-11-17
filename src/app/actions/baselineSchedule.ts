"use server";

import { createClient } from "@/lib/supabase/server";
import { BaselineEntryScheduleSchema } from "@/types/baselineSchedule";

/**
 * Schedules a recurring cron job to create baseline entries
 * Simply inserts/updates the schedule - triggers handle the cron job automatically
 * @param cronSchedule - Cron expression (e.g., '0 9 * * *' for daily at 9am)
 * @param webhookUrl - Optional webhook URL to call after entry creation
 */
export async function scheduleBaselineEntryCron(
  cronSchedule: string,
  webhookUrl?: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  // Simply insert/update the record - triggers will handle cron scheduling
  const { data, error } = await supabase
    .from("auto_baseline_schedule")
    .upsert(
      {
        user_id: user.id,
        cron_schedule: cronSchedule,
        webhook_url: webhookUrl || null,
        enabled: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    )
    .select()
    .single();

  if (error) {
    console.error("Error scheduling baseline entry cron:", error);
    return { error: error.message };
  }

  return { schedule: data };
}

/**
 * Unschedules the baseline entry cron job for the current user
 * Simply deletes the record - triggers handle cron cleanup automatically
 */
export async function unscheduleBaselineEntryCron() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  // Simply delete the record - triggers will handle cron cleanup
  const { error } = await supabase
    .from("auto_baseline_schedule")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("Error unscheduling baseline entry cron:", error);
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Gets the current baseline entry schedule for the user
 */
export async function getBaselineEntrySchedule() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("auto_baseline_schedule")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No schedule found
      return { schedule: null };
    }
    console.error("Error fetching baseline entry schedule:", error);
    return { error: error.message };
  }

  const parsed = BaselineEntryScheduleSchema.safeParse(data);
  if (!parsed.success) {
    console.error("Error parsing baseline entry schedule:", parsed.error);
    return { error: "Invalid schedule data" };
  }

  return { schedule: parsed.data };
}
