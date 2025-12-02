"use client";

import {
  endOfYear,
  format,
  startOfYear,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { useMemo, useState } from "react";
import { Entry } from "@/types/entry";
import { Metric } from "@/types/metric.ts";
import { EntryValue } from "@/types/entry-value.ts";

interface HeatmapProps {
  entries: Entry[];
}

// todo: DayData should be supplied with a comment from Entry
interface DayData {
  date: Date;
  comment?: string;
  value: number | null;
  bounds: {
    minValue: number;
    maxValue: number;
  } | null;
}

const NEUTRAL_COLOR = "rgb(167, 243, 208)"; // bg-green-200

// Calculate color based on mood value - blue for depressed, red for manic
function getMoodColor(
  value: number,
  minValue: number,
  maxValue: number,
): string {
  // Normalize value to 0-1 range
  const normalized = (value - minValue) / (maxValue - minValue);
  if (value === 0) {
    return NEUTRAL_COLOR;
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

const extractAvailableMetrics = (entries: Entry[]): Map<string, Metric> => {
  const metrics = new Map<string, Metric>();
  entries.forEach((entry) => {
    entry.values.forEach((value) => {
      metrics.set(value.metric.name.toLowerCase(), value.metric);
    });
  });
  return metrics;
};

const allValues = (
  entries: Entry[],
  metricId: string,
): Map<string, EntryValue> => {
  const valuesMap = new Map<string, EntryValue>();
  entries.forEach((entry) => {
    entry.values.forEach((value) => {
      if (value.metric.id === metricId) {
        const dateKey = `${entry.recorded_at.getFullYear()}-${entry.recorded_at.getMonth()}-${entry.recorded_at.getDate()}`;
        valuesMap.set(dateKey, value);
      }
    });
  });
  return valuesMap;
};

export default function EntriesHeatmap({ entries }: HeatmapProps) {
  const availableMetrics: Map<string, Metric> = useMemo(
    () => extractAvailableMetrics(entries),
    [entries],
  );

  const moodMetric = useMemo(() => {
    return availableMetrics.get("mood");
  }, [availableMetrics]);

  const [selectedMetric] = useState<Metric>(
    moodMetric ?? availableMetrics.values().toArray()[0],
  );

  const values = useMemo(
    () => allValues(entries, selectedMetric.id),
    [entries, selectedMetric],
  );

  // Prepare heatmap data for the current year
  const heatmapData = useMemo(() => {
    const now = new Date();
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);
    const allDays = eachDayOfInterval({ start: yearStart, end: yearEnd });

    const monthsData: DayData[][] = [];
    for (let month = 0; month < 12; month++) {
      const monthDays: DayData[] = [];
      allDays.forEach((day) => {
        if (day.getMonth() === month) {
          const dayKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
          const value = values.get(dayKey) ?? null;
          // todo: minValue and maxValue should be made NOT NULL, can be derived from labels upon creation
          monthDays.push({
            date: day,
            value: value ? value.value : null,
            bounds: {
              minValue: selectedMetric.min_value ?? 0,
              maxValue: selectedMetric.max_value ?? 10,
            },
          });
        }
      });
      monthsData.push(monthDays);
    }

    return monthsData;
  }, [values, selectedMetric]);

  const today = new Date();
  console.log(values);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full p-4">
        <div>
          {/*<Button*/}
          {/*  variant="ghost"*/}
          {/*  onClick={() => {}}*/}
          {/*  disabled={true}*/}
          {/*  className={`p-2 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-700 cursor-not-allowed`}*/}
          {/*  aria-label="previous-year"*/}
          {/*>*/}
          {/*  <ChevronLeft />*/}
          {/*</Button>*/}
          <h3 className="text-lg font-semibold mb-4 text-center">
            {format(today, "yyyy")} Mood Calendar
          </h3>
          {/*<Button*/}
          {/*  variant="ghost"*/}
          {/*  onClick={() => {}}*/}
          {/*  disabled={true}*/}
          {/*  className={`p-2 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-700 cursor-not-allowed`}*/}
          {/*  aria-label="previous-year"*/}
          {/*>*/}
          {/*  <ChevronRight />*/}
          {/*</Button>*/}
        </div>

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
            <div
              className={`w-4 h-4 rounded bg-green-200 border border-gray-300`}
            />
            <span>Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: "rgb(255, 100, 100)" }}
            />
            <span>Manic</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: "rgb(255, 255, 255)" }}
            />
            <span>No Data</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="flex gap-1 justify-center">
          {heatmapData.map((monthDays, monthIndex) => (
            <div key={monthIndex} className="flex gap-1">
              {/* Day of month column - only for first month */}
              {monthIndex === 0 && (
                <div className="flex flex-col gap-0.5 items-end mr-1">
                  {/* Empty space for month label alignment */}
                  <div className="h-6 mb-1" />
                  {/* Render day numbers */}
                  {monthDays.map((dayData, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="text-xs text-primary w-5 h-5 flex items-center justify-end pr-1"
                    >
                      {dayData.date.getDate()}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-1">
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
                    } else if (dayData.value !== null && dayData.bounds) {
                      backgroundColor = getMoodColor(
                        dayData.value,
                        dayData.bounds.minValue,
                        dayData.bounds.maxValue,
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
