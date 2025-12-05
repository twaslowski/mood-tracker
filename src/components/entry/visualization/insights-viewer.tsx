"use client";

import React, { useState } from "react";
import { Entry } from "@/types/entry";
import { MetricTracking } from "@/types/tracking";
import EntriesChart from "./entries-chart";
import EntriesHeatmap from "./entries-heatmap";
import EntriesList from "./entries-list";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Calendar, List } from "lucide-react";
import useIsMobile from "@/hooks/use-is-mobile.ts";

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
  const { isMobile } = useIsMobile();
  const defaultSelectedView = isMobile ? "heatmap" : "charts";
  const [selectedView, setSelectedView] =
    useState<ViewType>(defaultSelectedView);

  return (
    <div>
      <Tabs
        value={selectedView}
        onValueChange={(value) => setSelectedView(value as ViewType)}
        className="w-full"
      >
        <TabsList className="mb-4 grid w-full grid-cols-3">
          {viewOptions.map((option) => {
            const Icon = option.icon;
            return (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="flex-1 sm:flex-none"
              >
                <Icon className="w-4 h-4 mr-2" />
                {option.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Render selected view */}
        <div className="space-y-4">
          {selectedView === "charts" && (
            <EntriesChart entries={entries} trackingData={trackingData} />
          )}
          {selectedView === "heatmap" && <EntriesHeatmap entries={entries} />}
          {selectedView === "entries" && <EntriesList entries={entries} />}
        </div>
      </Tabs>
    </div>
  );
}
