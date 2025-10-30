import { z } from "zod";
import { EntryValueSchema } from "@/types/entryValue";

export const EntrySchema = z.object({
  id: z.number(),
  user_id: z.string(),
  recorded_at: z.string(),
  creation_timestamp: z.string(),
  updated_timestamp: z.string(),
  values: z.array(EntryValueSchema),
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

export type CreateEntryInput = z.infer<typeof CreateEntryInputSchema>;
export type Entry = z.infer<typeof EntrySchema>;
