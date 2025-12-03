import { Entry } from "@/components/entry/entry";
import { getEntriesByUser } from "@/lib/service/entry.ts";
import React from "react";
import { BackNav } from "@/components/back-nav";
import EntriesChart from "@/components/entry/entries-chart";
import EntriesHeatmap from "@/components/entry/entries-heatmap";
import { getTrackedMetrics } from "@/lib/service/metric.ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card.tsx";

export default async function InsightsPage() {
  const [entries, trackedMetrics] = await Promise.all([
    getEntriesByUser(),
    getTrackedMetrics(),
  ]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col p-4 h-full">
        <div className="space-y-6">
          <div>
            <BackNav href="/protected" />
          </div>
          <Card className="max-w-2xl flex flex-col items-center justify-center text-center mx-auto">
            <CardHeader>
              <CardTitle className="text-xl">No entries found.</CardTitle>
              <CardDescription>
                <p>
                  Start logging your moods and metrics to see insights here!
                </p>
                <p>
                  Create your first entry:{" "}
                  <a
                    href="/protected/new-entry"
                    className="text-blue-500 underline"
                  >
                    New Entry
                  </a>
                </p>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

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
            {/* todo: refactor the EntriesChart to also get rid of trackingData */}
            <EntriesChart entries={entries} trackingData={trackedMetrics} />
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-4">
            <EntriesHeatmap entries={entries} />
          </TabsContent>

          <TabsContent value="entries" className="space-y-4">
            <div className="grid gap-4">
              {entries.map((entry) => (
                <Entry key={entry.id} entry={entry} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
