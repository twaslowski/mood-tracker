"use client";

import React, { useState, useMemo } from "react";
import { Entry } from "@/types/entry";
import { MetricTracking } from "@/types/tracking";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LineChart, PieChart } from "lucide-react";
import EntriesLineChart from "./entries-line-chart";
import EntriesPieChart from "./entries-pie-chart";
import TimeRangePicker, {
  TimeRange,
  getDateRangeFromTimeRange,
} from "./time-range-picker";

interface ChartsProps {
  entries: Entry[];
  trackingData: MetricTracking[];
}

interface ChartComponentProps {
  entries: Entry[];
  trackingData: MetricTracking[];
  startDate: Date;
  endDate: Date;
}

type ChartType = "line" | "pie";

interface ChartOption {
  type: ChartType;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType<ChartComponentProps>;
}

const CHART_OPTIONS: ChartOption[] = [
  {
    type: "line",
    label: "Line Chart",
    icon: <LineChart className="w-4 h-4" />,
    component: EntriesLineChart,
  },
  {
    type: "pie",
    label: "Pie Chart",
    icon: <PieChart className="w-4 h-4" />,
    component: EntriesPieChart,
  },
];

export default function EntriesCharts({ entries, trackingData }: ChartsProps) {
  const [selectedChartType, setSelectedChartType] = useState<ChartType>("line");
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("30d");

  const selectedChart = CHART_OPTIONS.find(
    (opt) => opt.type === selectedChartType,
  );
  const ChartComponent = selectedChart?.component || EntriesLineChart;

  // Get date range based on selected time range
  const { startDate, endDate } = useMemo(
    () => getDateRangeFromTimeRange(selectedTimeRange),
    [selectedTimeRange],
  );

  return (
    <div className="w-full space-y-4">
      {/* Chart Type and Time Range Selectors */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Charts</h2>
        <div className="flex gap-2">
          <TimeRangePicker
            selectedRange={selectedTimeRange}
            onRangeChange={setSelectedTimeRange}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {selectedChart?.icon}
                {selectedChart?.label}
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {CHART_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.type}
                  onClick={() => setSelectedChartType(option.type)}
                  className="gap-2 cursor-pointer"
                >
                  {option.icon}
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Selected Chart */}
      <ChartComponent
        entries={entries}
        trackingData={trackingData}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
