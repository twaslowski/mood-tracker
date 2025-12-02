"use client";

import { endOfMonth, format, startOfMonth } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Entry } from "@/types/entry";
import { MetricTracking } from "@/types/tracking";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const COLORS = [
  "#4c8cff",
  "#ff6b6b",
  "#1dd1a1",
  "#feca57",
  "#ff9ff3",
  "#8e44ad",
  "#e67e22",
  "#34495e",
];

interface ChartProps {
  entries: Entry[];
  trackingData: MetricTracking[];
}

interface MetricConfig {
  metricId: string;
  minValue: number;
  maxValue: number;
  baseline: number;
  name: string;
  type: string;
  labels: Record<string, number>;
  color: string;
}

interface ChartDataPoint {
  timestamp: string;
  [metricId: string]: number | string | null; // Dynamic keys for each metric
}

// Assign stable colors based on metric index
function assignMetricColor(index: number): string {
  return COLORS[index % COLORS.length];
}

// Transform entries into chart-ready format
function prepareChartData(
  entries: Entry[],
  selectedMonth: string,
): ChartDataPoint[] {
  if (!selectedMonth) return [];

  const monthStart = startOfMonth(new Date(selectedMonth + "-01"));
  const monthEnd = endOfMonth(monthStart);

  // Get all metric IDs present in entries
  const metricIds = Array.from(
    new Set(entries.flatMap((e) => e.values.map((v) => v.metric_id))),
  );

  // Group by day and metric, averaging multiple values per day
  const dailyData = new Map<string, Map<string, number[]>>();
  entries.forEach((entry) => {
    if (entry.recorded_at < monthStart || entry.recorded_at > monthEnd) return;

    const dateKey = format(entry.recorded_at, "yyyy-MM-dd");
    if (!dailyData.has(dateKey)) {
      dailyData.set(dateKey, new Map());
    }
    const dayData = dailyData.get(dateKey)!;
    entry.values.forEach((value) => {
      if (!dayData.has(value.metric_id)) {
        dayData.set(value.metric_id, []);
      }
      dayData.get(value.metric_id)!.push(value.value);
    });
  });

  // Generate all days in the month
  const chartData: ChartDataPoint[] = [];
  for (
    let d = new Date(monthStart);
    d <= monthEnd;
    d.setDate(d.getDate() + 1)
  ) {
    const dateKey = format(d, "yyyy-MM-dd");
    const metrics = dailyData.get(dateKey);
    const dataPoint: ChartDataPoint = { timestamp: dateKey };
    metricIds.forEach((metricId) => {
      if (metrics && metrics.has(metricId)) {
        const values = metrics.get(metricId)!;
        dataPoint[metricId] = values.reduce((a, b) => a + b, 0) / values.length;
      } else {
        dataPoint[metricId] = null;
      }
    });
    chartData.push(dataPoint);
  }

  return chartData;
}

export default function EntriesChart({ entries, trackingData }: ChartProps) {
  // Extract available months from entries
  const availableMonths = useMemo(() => {
    const months = new Set(
      entries.map((e) => format(new Date(e.recorded_at), "yyyy-MM")),
    );
    return Array.from(months).sort();
  }, [entries]);

  // Build metric configurations with stable colors
  const metricsConfig = useMemo<MetricConfig[]>(() => {
    return trackingData.map((td, index) => ({
      metricId: td.metric.id,
      minValue: td.metric.min_value ?? 0,
      maxValue: td.metric.max_value ?? 10,
      baseline: td.baseline,
      name: td.metric.name,
      type: td.metric.metric_type,
      labels: td.metric.labels,
      color: assignMetricColor(index),
    }));
  }, [trackingData]);

  // State - only one active metric at a time
  const [selectedMonth, setSelectedMonth] = useState<string>(
    availableMonths[availableMonths.length - 1] || "",
  );
  const [activeMetricId, setActiveMetricId] = useState<string | null>(
    metricsConfig[0]?.metricId || null,
  );

  // Update selected month when available months change
  useEffect(() => {
    if (
      availableMonths.length > 0 &&
      !availableMonths.includes(selectedMonth)
    ) {
      setSelectedMonth(availableMonths[availableMonths.length - 1]);
    }
  }, [availableMonths, selectedMonth]);

  // Update active metric when metrics config changes
  useEffect(() => {
    if (metricsConfig.length > 0 && !activeMetricId) {
      setActiveMetricId(metricsConfig[0].metricId);
    }
  }, [metricsConfig, activeMetricId]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return prepareChartData(entries, selectedMonth);
  }, [entries, selectedMonth]);

  // Month navigation
  const currentMonthIndex = useMemo(
    () => availableMonths.indexOf(selectedMonth),
    [availableMonths, selectedMonth],
  );

  const previousMonth = useCallback(() => {
    if (currentMonthIndex > 0) {
      setSelectedMonth(availableMonths[currentMonthIndex - 1]);
    }
  }, [availableMonths, currentMonthIndex]);

  const nextMonth = useCallback(() => {
    if (currentMonthIndex < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[currentMonthIndex + 1]);
    }
  }, [availableMonths, currentMonthIndex]);

  const isPreviousMonthAvailable = currentMonthIndex > 0;
  const isNextMonthAvailable = currentMonthIndex < availableMonths.length - 1;

  // Toggle metric - only one can be active
  const selectMetric = useCallback((metricId: string) => {
    setActiveMetricId(metricId);
  }, []);

  // Get the active metric configuration
  const activeMetric = useMemo(
    () => metricsConfig.find((m) => m.metricId === activeMetricId),
    [metricsConfig, activeMetricId],
  );

  // Y-axis domain based on active metric
  const yAxisDomain = useMemo(() => {
    if (!activeMetric) return [0, 10];

    const padding = (activeMetric.maxValue - activeMetric.minValue) * 0.05;
    return [activeMetric.minValue - padding, activeMetric.maxValue + padding];
  }, [activeMetric]);

  // Y-axis ticks for discrete metrics
  const yAxisTicks = useMemo(() => {
    if (!activeMetric || activeMetric.type !== "discrete") return undefined;

    // Sort labels by their numeric value
    return Object.entries(activeMetric.labels)
      .sort(([, valueA], [, valueB]) => valueA - valueB)
      .map(([, value]) => value);
  }, [activeMetric]);

  // Y-axis tick formatter for discrete metrics
  const yAxisTickFormatter = useCallback(
    (value: number) => {
      if (!activeMetric || activeMetric.type !== "discrete") {
        return Math.round(value).toString();
      }

      // Find the label for this value
      const labelEntry = Object.entries(activeMetric.labels).find(
        ([, val]) => val === value,
      );
      return labelEntry ? labelEntry[0] : value.toString();
    },
    [activeMetric],
  );

  return (
    <div className="w-full">
      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Button
          variant="ghost"
          onClick={previousMonth}
          disabled={!isPreviousMonthAvailable}
          className={`p-2 rounded-full border ${
            isPreviousMonthAvailable
              ? "border-gray-200 text-gray-300"
              : "border-gray-300 hover:bg-gray-100 text-gray-700 cursor-not-allowed"
          }`}
          aria-label="Previous month"
        >
          <ChevronLeft />
        </Button>

        <div className="text-lg font-semibold min-w-[120px] text-center">
          {selectedMonth
            ? format(new Date(selectedMonth + "-01"), "MMM yyyy")
            : ""}
        </div>

        <Button
          variant="ghost"
          onClick={nextMonth}
          disabled={!isNextMonthAvailable}
          className={`p-2 rounded-full border ${
            isNextMonthAvailable
              ? "border-gray-200 text-gray-300"
              : "border-gray-300 hover:bg-gray-100 text-gray-700 cursor-not-allowed"
          }`}
          aria-label="Next month"
        >
          <ChevronRight />
        </Button>
      </div>

      {/* Chart with dark background */}
      <div
        className="w-full rounded-lg p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            key={activeMetricId}
            margin={{ top: 5, right: 30, left: 3, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <XAxis
              dataKey="timestamp"
              stroke="rgba(255, 255, 255, 0.7)"
              tick={{ fill: "rgba(255, 255, 255, 0.7)" }}
            />
            <YAxis
              label={{
                angle: -90,
                position: "insideLeft",
                fill: "rgba(255, 255, 255, 0.7)",
              }}
              domain={yAxisDomain}
              ticks={yAxisTicks}
              tickFormatter={yAxisTickFormatter}
              allowDecimals={activeMetric?.type !== "discrete"}
              stroke="rgba(255, 255, 255, 0.7)"
              tick={{ fill: "rgba(255, 255, 255, 0.7)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                color: "white",
              }}
              labelStyle={{ color: "white" }}
            />

            {/* Min/max range for active metric */}
            {activeMetric && (
              <ReferenceArea
                y1={activeMetric.minValue}
                y2={activeMetric.maxValue}
                fill={activeMetric.color}
                fillOpacity={0.1}
                stroke="none"
              />
            )}

            {/* Baseline reference line */}
            {activeMetric && (
              <ReferenceLine
                y={activeMetric.baseline}
                stroke={activeMetric.color}
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: `${activeMetric.name} Baseline`,
                  fill: "rgba(255, 255, 255, 0.7)",
                  position: "insideTopRight",
                }}
              />
            )}

            {/* Active metric line */}
            {activeMetric && (
              <Line
                type="monotone"
                dataKey={activeMetric.metricId}
                stroke={activeMetric.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                name={activeMetric.name}
                connectNulls={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend - Small and below chart */}
      <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
        {metricsConfig.map((metric) => (
          <Button
            key={metric.metricId}
            onClick={() => selectMetric(metric.metricId)}
            variant="outline"
            size="sm"
            className={`px-2 py-1 h-auto text-xs font-medium transition-all duration-200 ${
              activeMetricId === metric.metricId
                ? "bg-white border-gray-400 text-gray-900 shadow-sm"
                : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  activeMetricId === metric.metricId
                    ? "opacity-100"
                    : "opacity-40"
                }`}
                style={{ backgroundColor: metric.color }}
              />
              {metric.name}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
