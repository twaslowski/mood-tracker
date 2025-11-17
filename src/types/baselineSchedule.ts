import { z } from "zod";

export const BaselineEntryScheduleSchema = z.object({
  id: z.uuid(),
  user_id: z.string(),
  cron_schedule: z.string(),
  webhook_url: z.string().nullable(),
  enabled: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  last_run_at: z.string().nullable(),
  cron_job_id: z.number().nullable(),
});

export type BaselineEntrySchedule = z.infer<typeof BaselineEntryScheduleSchema>;
