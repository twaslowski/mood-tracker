"use client";

import React, { useState } from "react";
import { TrackingWithMetric } from "@/types/metricTracking";
import { CreateEntryValue } from "@/types/entryValue";
import DateTimeInput from "./datetime-input";
import MetricInput from "./metric-input";
import SubmitButton from "./submit-button";
import { Toaster } from "react-hot-toast";

interface CreateEntryFormProps {
  trackedMetrics: TrackingWithMetric[];
}

export default function EntryCreationForm({
  trackedMetrics,
}: CreateEntryFormProps) {
  const [recordedAt, setRecordedAt] = useState(
    new Date().toISOString().slice(0, 16),
  );
  const [metricValues, setMetricValues] = useState<Record<string, string>>({});
  console.log("tracked metrics", trackedMetrics);

  const handleMetricChange = (metricId: string, value: string) => {
    setMetricValues((prev) => ({
      ...prev,
      [metricId]: value,
    }));
  };

  const getEntryValues = (): CreateEntryValue[] => {
    return Object.entries(metricValues)
      .filter(([value]) => value !== "" && value !== undefined)
      .map(([metricId, value]) => ({
        metric_id: metricId,
        value: parseFloat(value),
      }));
  };

  const entryValues = getEntryValues();
  const isFormValid = entryValues.length > 0 && recordedAt;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <Toaster />
      <DateTimeInput value={recordedAt} onChange={setRecordedAt} />

      {trackedMetrics.map((tm) => (
        <MetricInput
          key={tm.metric_id}
          metric={tm.metric}
          value={metricValues[tm.metric_id] || ""}
          onChange={(value) => handleMetricChange(tm.metric_id, value)}
        />
      ))}

      <SubmitButton
        values={entryValues}
        recordedAt={recordedAt}
        disabled={!isFormValid}
      />
    </div>
  );
}
