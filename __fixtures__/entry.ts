import { CreateEntryInput, Entry } from "@/types/entry";
import { mood, sleep } from "./metric";

export const entry: Entry = {
  id: 123,
  user_id: "user_456",
  recorded_at: "2024-06-01T12:00:00Z",
  creation_timestamp: "2024-06-01T12:00:00Z",
  updated_timestamp: "2024-06-01T12:00:00Z",
  values: [
    {
      metric_id: mood.id,
      value: 0,
      metric: mood,
    },
    {
      metric_id: sleep.id,
      value: 8,
      metric: sleep,
    },
  ],
};

export const createEntryInput: CreateEntryInput = {
  recorded_at: new Date().toISOString(),
  values: [
    {
      metric_id: mood.id,
      value: 0,
    },
    {
      metric_id: sleep.id,
      value: 8,
    },
  ],
};
