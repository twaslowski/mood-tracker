import { EntryValue } from "@/types/entryValue";

export interface Entry {
  id: number;
  user_id: string | null;
  recorded_at: string;
  creation_timestamp: string;
  updated_timestamp: string;
}

export interface EntryWithValues {
  id: number;
  user_id: string | null;
  recorded_at: string;
  creation_timestamp: string;
  updated_timestamp: string;
  values: EntryValue[];
}

export interface CreateEntryInput {
  recorded_at: Date | string;
  values: Array<{
    metric_id: number;
    value: number;
  }>;
}
