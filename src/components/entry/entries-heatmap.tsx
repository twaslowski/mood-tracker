"use client";

import {
  endOfYear,
  format,
  startOfYear,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { useMemo } from "react";
import { Entry } from "@/types/entry";
import { MetricTracking } from "@/types/tracking";

interface HeatmapProps {
  entries: Entry[];
  trackingData: MetricTracking[];
}

interface DayData {
  date: Date;
  value: number | null;
  moodMetric: {
    minValue: number;
    maxValue: number;
  } | null;
}

// Calculate color based on mood value - blue for depressed, red for manic
function getMoodColor(
  value: number,
  minValue: number,
  maxValue: number,
): string {
  // Normalize value to 0-1 range
  const normalized = (value - minValue) / (maxValue - minValue);
  if (value === 0) {
    // light green for neutral
    return "rgb(200, 255, 200)";
  }

  // Blue (depressed) to Red (manic) via white in the middle
  if (normalized < 0.5) {
    // Blue to white (0 to 0.5)
    const intensity = normalized * 2; // 0 to 1
    const blueStrength = Math.round(100 + 155 * intensity); // 100 to 255
    const redGreen = Math.round(intensity * 255); // 0 to 255
    return `rgb(${redGreen}, ${redGreen}, ${blueStrength})`;
  } else {
    // White to red (0.5 to 1)
    const intensity = (normalized - 0.5) * 2; // 0 to 1
    const red = 255;
    const greenBlue = Math.round(255 * (1 - intensity)); // 255 to 0
    return `rgb(${red}, ${greenBlue}, ${greenBlue})`;
  }
}

export default function EntriesHeatmap({
  entries,
  trackingData,
}: HeatmapProps) {
  // Find the Mood metric
  const moodMetric = useMemo(() => {
    return trackingData.find((td) => td.metric.name.toLowerCase() === "mood");
  }, [trackingData]);

  // Prepare heatmap data for the current year
  const heatmapData = useMemo(() => {
    const now = new Date();
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);
    const allDays = eachDayOfInterval({ start: yearStart, end: yearEnd });

    // Create a map of date to mood value
    const dateToMood = new Map<string, number>();

    if (moodMetric) {
      entries.forEach((entry) => {
        const moodValue = entry.values.find(
          (v) => v.metric_id === moodMetric.metric.id,
        );
        if (moodValue) {
          const dateKey = format(new Date(entry.recorded_at), "yyyy-MM-dd");
          // If multiple entries per day, take the average
          if (dateToMood.has(dateKey)) {
            const existing = dateToMood.get(dateKey)!;
            dateToMood.set(dateKey, (existing + moodValue.value) / 2);
          } else {
            dateToMood.set(dateKey, moodValue.value);
          }
        }
      });
    }

    // Group days by month
    const monthsData: DayData[][] = [];
    for (let month = 0; month < 12; month++) {
      const monthDays: DayData[] = [];
      allDays.forEach((day) => {
        if (day.getMonth() === month) {
          const dateKey = format(day, "yyyy-MM-dd");
          const value = dateToMood.get(dateKey) ?? null;
          monthDays.push({
            date: day,
            value,
            moodMetric: moodMetric
              ? {
                  minValue: moodMetric.metric.min_value ?? 0,
                  maxValue: moodMetric.metric.max_value ?? 10,
                }
              : null,
          });
        }
      });
      monthsData.push(monthDays);
    }

    return monthsData;
  }, [entries, moodMetric]);

  if (!moodMetric) {
    return (
      <div className="w-full p-4 text-center text-muted-foreground">
        No &quot;Mood&quot; metric found. Please track a metric named
        &quot;Mood&quot; to use this chart.
      </div>
    );
  }

  const today = new Date();

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full p-4">
        <h3 className="text-lg font-semibold mb-4 text-center">
          {format(today, "yyyy")} Mood Calendar
        </h3>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: "rgb(100, 100, 255)" }}
            />
            <span>Depressed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white border border-gray-300" />
            <span>Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: "rgb(255, 100, 100)" }}
            />
            <span>Manic</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="flex gap-1 justify-center">
          {heatmapData.map((monthDays, monthIndex) => (
            <div key={monthIndex} className="flex flex-col gap-1">
              {/* Month label */}
              <div className="text-xs text-center font-medium mb-1 h-6">
                {format(monthDays[0].date, "MMM")}
              </div>

              {/* Days in month */}
              <div className="flex flex-col gap-0.5">
                {monthDays.map((dayData, dayIndex) => {
                  const isToday = isSameDay(dayData.date, today);
                  const isFutureDay = dayData.date > today;

                  let backgroundColor = "white";
                  let borderColor = "#e5e7eb";

                  if (isFutureDay) {
                    backgroundColor = "#f9fafb";
                    borderColor = "#e5e7eb";
                  } else if (dayData.value !== null && dayData.moodMetric) {
                    backgroundColor = getMoodColor(
                      dayData.value,
                      dayData.moodMetric.minValue,
                      dayData.moodMetric.maxValue,
                    );
                    borderColor = "#d1d5db";
                  }

                  return (
                    <div
                      key={dayIndex}
                      className={`w-5 h-5 rounded-sm ${isToday ? "ring-2 ring-blue-500 ring-offset-1" : ""}`}
                      style={{
                        backgroundColor,
                        border: `1px solid ${borderColor}`,
                      }}
                      title={`${format(dayData.date, "MMM dd, yyyy")}${dayData.value !== null ? `: ${dayData.value.toFixed(1)}` : ""}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
