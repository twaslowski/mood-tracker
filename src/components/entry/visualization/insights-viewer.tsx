"use client";

import React, { useState } from "react";
import { Entry } from "@/types/entry";
import { MetricTracking } from "@/types/tracking";
import EntriesChart from "./entries-chart";
import EntriesHeatmap from "./entries-heatmap";
import EntriesList from "./entries-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar, List, ChevronDown } from "lucide-react";

type ViewType = "charts" | "heatmap" | "entries";

interface ViewOption {
  value: ViewType;
  label: string;
  icon: React.ElementType;
}

const viewOptions: ViewOption[] = [
  { value: "charts", label: "Charts", icon: BarChart3 },
  { value: "heatmap", label: "Heatmap", icon: Calendar },
  { value: "entries", label: "Entries", icon: List },
];

interface InsightsViewerProps {
  entries: Entry[];
  trackingData: MetricTracking[];
}

export default function InsightsViewer({
  entries,
  trackingData,
}: InsightsViewerProps) {
  const [selectedView, setSelectedView] = useState<ViewType>("heatmap");

  const currentView = viewOptions.find((view) => view.value === selectedView);
  const CurrentIcon = currentView?.icon || BarChart3;

  return (
    <div>
      <div className="flex flex-row items-center gap-4 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <CurrentIcon className="w-4 h-4" />
              {currentView?.label}
              <ChevronDown className="w-4 h-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuRadioGroup
              value={selectedView}
              onValueChange={(value) => setSelectedView(value as ViewType)}
            >
              {viewOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {option.label}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Render selected view */}
      <div className="space-y-4">
        {selectedView === "charts" && (
          <EntriesChart entries={entries} trackingData={trackingData} />
        )}
        {selectedView === "heatmap" && <EntriesHeatmap entries={entries} />}
        {selectedView === "entries" && <EntriesList entries={entries} />}
      </div>
    </div>
  );
}
