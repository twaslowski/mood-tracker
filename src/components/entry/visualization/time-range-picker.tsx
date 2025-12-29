"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TimeRange = "7d" | "30d" | "90d" | "1y" | "all";

interface TimeRangeOption {
  value: TimeRange;
  label: string;
  days: number | null; // null means "all time"
}

const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 90 days", days: 90 },
  { value: "1y", label: "Last year", days: 365 },
  { value: "all", label: "All time", days: null },
];

interface TimeRangePickerProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

export default function TimeRangePicker({
  selectedRange,
  onRangeChange,
}: TimeRangePickerProps) {
  const selectedOption = TIME_RANGE_OPTIONS.find(
    (opt) => opt.value === selectedRange,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          {selectedOption?.label}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {TIME_RANGE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onRangeChange(option.value)}
            className="cursor-pointer"
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function getDateRangeFromTimeRange(timeRange: TimeRange): {
  startDate: Date;
  endDate: Date;
} {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // End of today

  if (timeRange === "all") {
    // For "all", we'll use a very old date as start
    const startDate = new Date("2000-01-01");
    return { startDate, endDate };
  }

  const option = TIME_RANGE_OPTIONS.find((opt) => opt.value === timeRange);
  if (!option || option.days === null) {
    const startDate = new Date("2000-01-01");
    return { startDate, endDate };
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - option.days);
  startDate.setHours(0, 0, 0, 0); // Start of day

  return { startDate, endDate };
}
