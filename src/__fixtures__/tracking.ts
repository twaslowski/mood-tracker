import { MetricTracking } from "@/types/tracking";
import { mood, sleep, exercise, waterIntake } from "./metric";

export const moodTracking: MetricTracking = {
  user_id: "user-123",
  tracked_at: "2025-11-05T10:00:00.000Z",
  baseline: 0,
  metric: mood,
};

export const sleepTracking: MetricTracking = {
  user_id: "user-123",
  tracked_at: "2025-11-05T10:00:00.000Z",
  baseline: 8,
  metric: sleep,
};

export const exerciseTracking: MetricTracking = {
  user_id: "user-123",
  tracked_at: "2025-11-05T10:00:00.000Z",
  baseline: 30,
  metric: exercise,
};

export const waterIntakeTracking: MetricTracking = {
  user_id: "user-123",
  tracked_at: "2025-11-05T10:00:00.000Z",
  baseline: 2000,
  metric: waterIntake,
};
