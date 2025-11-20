import { Entry } from "@/components/entry/entry";
import { getEntriesByUser } from "@/lib/service/entry.ts";
import React from "react";
import { BackNav } from "@/components/back-nav";
import EntriesChart from "@/components/entry/entries-chart";
import EntriesHeatmap from "@/components/entry/entries-heatmap";
import { getTrackedMetrics } from "@/lib/service/metric.ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function InsightsPage() {
  const [entries, trackedMetrics] = await Promise.all([
    getEntriesByUser(),
    getTrackedMetrics(),
  ]);

  return (
    <div className="flex flex-col p-4 h-full">
      <div className="space-y-6">
        <div>
          <BackNav href="/protected" />
        </div>

        <Tabs defaultValue="charts" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-white">
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="entries">Entries</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-4">
            <EntriesChart entries={entries} trackingData={trackedMetrics} />
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-4">
            <EntriesHeatmap entries={entries} trackingData={trackedMetrics} />
          </TabsContent>

          <TabsContent value="entries" className="space-y-4">
            <div className="grid gap-4">
              {entries.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No entries yet. Create your first entry to see it here.
                </p>
              ) : (
                entries.map((entry) => <Entry key={entry.id} entry={entry} />)
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
