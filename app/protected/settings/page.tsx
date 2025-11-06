import React from "react";
import { getAllMetrics, getTrackedMetrics } from "@/lib/service/metricService";
import MetricList from "@/components/metric/metric-list";

export default async function SettingsPage() {
  const [allMetrics, trackedMetrics] = await Promise.all([
    getAllMetrics(),
    getTrackedMetrics(),
  ]);

  return (
    <div className="h-full p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Metric Settings</h1>
          <p className="text-muted-foreground">
            Configure which metrics you want to track in your mood journal
          </p>
        </div>

        <MetricList metrics={allMetrics} metricTracking={trackedMetrics} />
      </div>
    </div>
  );
}
