"use client";

import React, { useState } from "react";
import { type MetricTracking } from "@/types/tracking";
import { type EntryValue, EntryValueSchema } from "@/types/entryValue";
import DateTimeInput from "./datetime-input";
import MetricInput from "./metric-input";
import SubmitButton from "./submit-button";
import { Toaster } from "react-hot-toast";

interface CreateEntryFormProps {
  trackedMetrics: MetricTracking[];
}

export default function EntryCreationForm({
  trackedMetrics,
}: CreateEntryFormProps) {
  const [recordedAt, setRecordedAt] = useState(
    new Date().toISOString().slice(0, 16),
  );
  const [metricValues, setMetricValues] = useState<Record<string, string>>({});

  const handleMetricChange = (metricId: string, value: string) => {
    setMetricValues((prev) => ({
      ...prev,
      [metricId]: value,
    }));
  };

  const getEntryValues = (): EntryValue[] => {
    return Object.entries(metricValues)
      .filter(([value]) => value !== "" && value !== undefined)
      .map(([metricId, value]) =>
        EntryValueSchema.parse({
          metric_id: metricId,
          value: parseInt(value),
        }),
      );
  };

  const entryValues = getEntryValues();
  const isFormValid = entryValues.length > 0 && recordedAt;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <Toaster />
      <DateTimeInput value={recordedAt} onChange={setRecordedAt} />

      {trackedMetrics.map((tm) => (
        <MetricInput
          key={tm.metric.id}
          metric={tm.metric}
          value={metricValues[tm.metric.id] || ""}
          onChange={(value) => handleMetricChange(tm.metric.id, value)}
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
