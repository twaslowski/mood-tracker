"use client";

import React, { useState } from "react";
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

interface ChartsProps {
  entries: Entry[];
  trackingData: MetricTracking[];
}

type ChartType = "line" | "pie";

interface ChartOption {
  type: ChartType;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType<ChartsProps>;
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

  const selectedChart = CHART_OPTIONS.find(
    (opt) => opt.type === selectedChartType,
  );
  const ChartComponent = selectedChart?.component || EntriesLineChart;

  return (
    <div className="w-full space-y-4">
      {/* Chart Type Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Charts</h2>
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

      {/* Selected Chart */}
      <ChartComponent entries={entries} trackingData={trackingData} />
    </div>
  );
}
