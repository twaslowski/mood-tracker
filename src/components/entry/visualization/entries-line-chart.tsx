"use client";

import { format } from "date-fns";
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
import {
  type MetricConfig,
  buildMetricConfigs,
  extractAvailableMonths,
  prepareMonthlyChartData,
} from "@/lib/visualization-utils";

interface ChartProps {
  entries: Entry[];
  trackingData: MetricTracking[];
}

export default function EntriesLineChart({
  entries,
  trackingData,
}: ChartProps) {
  // Extract available months from entries
  const availableMonths = useMemo(
    () => extractAvailableMonths(entries),
    [entries],
  );

  // Build metric configurations with stable colors
  const metricsConfig = useMemo<MetricConfig[]>(
    () => buildMetricConfigs(trackingData),
    [trackingData],
  );

  // State - support multiple active metrics (up to 2)
  const [selectedMonth, setSelectedMonth] = useState<string>(
    availableMonths[availableMonths.length - 1] || "",
  );
  const [activeMetricIds, setActiveMetricIds] = useState<string[]>(
    metricsConfig[0]?.metricId ? [metricsConfig[0].metricId] : [],
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

  // Update active metrics when metrics config changes
  useEffect(() => {
    if (metricsConfig.length > 0 && activeMetricIds.length === 0) {
      setActiveMetricIds([metricsConfig[0].metricId]);
    }
  }, [metricsConfig, activeMetricIds]);

  // Prepare chart data
  const chartData = useMemo(
    () => prepareMonthlyChartData(entries, selectedMonth),
    [entries, selectedMonth],
  );

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

  // Toggle metric - up to 2 can be active
  const toggleMetric = useCallback((metricId: string) => {
    setActiveMetricIds((prev) => {
      if (prev.includes(metricId)) {
        // Deselect if already selected (but keep at least one)
        return prev.length > 1 ? prev.filter((id) => id !== metricId) : prev;
      } else {
        // Add if less than 2 are selected
        return prev.length < 2 ? [...prev, metricId] : [prev[1], metricId];
      }
    });
  }, []);

  // Get the active metric configurations
  const activeMetrics = useMemo(
    () => metricsConfig.filter((m) => activeMetricIds.includes(m.metricId)),
    [metricsConfig, activeMetricIds],
  );

  // Y-axis domain based on all active metrics
  const yAxisDomain = useMemo(() => {
    if (activeMetrics.length === 0) return [0, 10];

    const allMins = activeMetrics.map((m) => m.minValue);
    const allMaxs = activeMetrics.map((m) => m.maxValue);
    const minValue = Math.min(...allMins);
    const maxValue = Math.max(...allMaxs);

    const padding = (maxValue - minValue) * 0.05;
    return [minValue - padding, maxValue + padding];
  }, [activeMetrics]);

  // Y-axis ticks for discrete metrics (only when single metric is active)
  const yAxisTicks = useMemo(() => {
    if (activeMetrics.length !== 1 || activeMetrics[0].type !== "discrete")
      return undefined;

    // Sort labels by their numeric value
    return Object.entries(activeMetrics[0].labels)
      .sort(([, valueA], [, valueB]) => valueA - valueB)
      .map(([, value]) => value);
  }, [activeMetrics]);

  // Y-axis tick formatter for discrete metrics (only when single metric is active)
  const yAxisTickFormatter = useCallback(
    (value: number) => {
      if (activeMetrics.length !== 1 || activeMetrics[0].type !== "discrete") {
        return Math.round(value).toString();
      }

      // Find the label for this value
      const labelEntry = Object.entries(activeMetrics[0].labels).find(
        ([, val]) => val === value,
      );
      return labelEntry ? labelEntry[0] : value.toString();
    },
    [activeMetrics],
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
            key={activeMetricIds.join(",")}
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
              allowDecimals={
                activeMetrics.length !== 1 ||
                activeMetrics[0]?.type !== "discrete"
              }
              stroke="rgba(255, 255, 255, 0.7)"
              tick={
                activeMetricIds.length === 2
                  ? false
                  : { fill: "rgba(255, 255, 255, 0.7)" }
              }
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

            {/* Min/max range and baseline for each active metric */}
            {activeMetrics.map((metric) => (
              <ReferenceArea
                key={`area-${metric.metricId}`}
                y1={metric.minValue}
                y2={metric.maxValue}
                fill={metric.color}
                fillOpacity={0.1}
                stroke="none"
              />
            ))}

            {activeMetrics.map((metric, index) => (
              <ReferenceLine
                key={`baseline-${metric.metricId}`}
                y={metric.baseline}
                stroke={metric.color}
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: `${metric.name} Baseline`,
                  fill: "rgba(255, 255, 255, 0.7)",
                  position:
                    index === 0 ? "insideTopRight" : "insideBottomRight",
                }}
              />
            ))}

            {/* Lines for each active metric */}
            {activeMetrics.map((metric) => (
              <Line
                key={`line-${metric.metricId}`}
                type="monotone"
                dataKey={metric.metricId}
                stroke={metric.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                name={metric.name}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend - Small and below chart */}
      <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
        {metricsConfig.map((metric) => (
          <Button
            key={metric.metricId}
            onClick={() => toggleMetric(metric.metricId)}
            variant="outline"
            size="sm"
            className={`px-2 py-1 h-auto text-xs font-medium transition-all duration-200 ${
              activeMetricIds.includes(metric.metricId)
                ? "bg-white border-gray-400 text-gray-900 shadow-sm"
                : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  activeMetricIds.includes(metric.metricId)
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
