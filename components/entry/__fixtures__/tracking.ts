import { MetricTracking } from "@/types/tracking";
import { Mood } from "./metric";

export const MoodTracking: MetricTracking = {
  user_id: "user-123",
  tracked_at: new Date().toISOString(),
  baseline: 0,
  metric: Mood,
};
