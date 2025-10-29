import { z } from "zod";
import { EntrySchema, EntryValueSchema, MetricSchema } from "@/types/schema";
import { CreateEntryValue } from "@/types/entryValue";

type Metric = z.infer<typeof MetricSchema>;
type Entry = z.infer<typeof EntrySchema>;
type EntryValue = z.infer<typeof EntryValueSchema>;

export type { Metric, Entry, EntryValue };

export interface CreateEntryInput {
  recordedAt: Date | string;
  values: CreateEntryValue[];
}
