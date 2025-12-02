import { Entry } from "@/types/entry";
import { mood, sleep } from "./metric";

export const entry: Entry = {
  id: 123,
  user_id: "user_456",
  recorded_at: new Date(),
  creation_timestamp: new Date(),
  updated_timestamp: new Date(),
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
