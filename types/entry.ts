import { z } from "zod";
import { EntryValueWithMetricSchema } from "@/types/entryValue";

export const EntrySchema = z.object({
  id: z.number(),
  user_id: z.string(),
  recorded_at: z.string(),
  creation_timestamp: z.string(),
  updated_timestamp: z.string(),
  values: z.array(EntryValueWithMetricSchema),
});

export const CreateEntryInputSchema = z.object({
  recordedAt: z.union([z.string(), z.date()]),
  values: z.array(
    z.object({
      metric_id: z.string(),
      value: z.number(),
    }),
  ),
});

// Represents the database schema retrieved from Supabase, accounting for the entry_value join column name
export const DBEntrySchema = z
  .object({
    id: z.number(),
    user_id: z.string(),
    recorded_at: z.string(),
    creation_timestamp: z.string(),
    updated_timestamp: z.string(),
    entry_value: z.array(EntryValueWithMetricSchema),
  })
  .transform(({ entry_value, ...rest }) => ({
    ...rest,
    values: entry_value,
  }));

export type CreateEntryInput = z.infer<typeof CreateEntryInputSchema>;
export type Entry = z.infer<typeof EntrySchema>;
