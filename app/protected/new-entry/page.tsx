import React from "react";
import EntryCreationForm from "@/components/entry/entry-creation-form";
import { getTrackedMetrics } from "@/lib/service/metricService";

export default async function CreateEntryPage() {
  const trackedMetrics = await getTrackedMetrics();

  return (
    <div className="h-full p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Entry</h1>
          <p className="text-primary">
            Record your metrics for a specific point in time
          </p>
        </div>

        <EntryCreationForm trackedMetrics={trackedMetrics} />

        <div className="mt-6 text-center text-sm">
          <p>
            You can leave metrics blank if you don&apos;t want to record them
          </p>
        </div>
      </div>
    </div>
  );
}
