import React from "react";
import { getAllMetrics, getTrackedMetrics } from "@/lib/service/metricService";
import MetricList from "@/components/metric/metric-list";
import { BackNav } from "@/components/back-nav";
import MetricCreationButton from "@/components/metric/metric-creation-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const [allMetrics, trackedMetrics] = await Promise.all([
    getAllMetrics(),
    getTrackedMetrics(),
  ]);

  return (
    <div className="h-full p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <BackNav href="/protected" />
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold">Metric Settings</h1>
            <div className="gap-2 flex">
              <MetricCreationButton />
              <Link href={"/protected/settings/auto-baseline"}>
                <Button>Baseline Settings</Button>
              </Link>
            </div>
          </div>
          <p className="text-muted-foreground">
            Configure which metrics you want to track in your mood journal
          </p>
        </div>

        <MetricList metrics={allMetrics} metricTracking={trackedMetrics} />
      </div>
    </div>
  );
}
