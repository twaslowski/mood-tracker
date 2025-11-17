"use client";

import React, { useState, useEffect } from "react";
import { type MetricTracking } from "@/types/tracking";
import { type EntryValue, EntryValueSchema } from "@/types/entryValue";
import SubmitButton from "./submit-button";
import DateTimeInput from "@/components/entry/datetime-input";
import ValueSelect from "@/components/entry/value-select";

interface CreateEntryFormProps {
  trackedMetrics: MetricTracking[];
}

export default function EntryCreationForm({
  trackedMetrics,
}: CreateEntryFormProps) {
  const [recordedAt, setRecordedAt] = useState(
    new Date().toISOString().slice(0, 16),
  );
  const [submittedValues, setSubmittedValues] = useState<
    Record<string, number>
  >({});

  // Preselect baseline values by default
  useEffect(() => {
    setSubmittedValues((prev) => {
      const updated = { ...prev };
      trackedMetrics.forEach((tm) => {
        if (updated[tm.metric.id] === undefined) {
          updated[tm.metric.id] = tm.baseline; // baseline guaranteed number
        }
      });
      return updated;
    });
  }, [trackedMetrics]);

  const handleSubmittedValue = (metricId: string, value: number) => {
    setSubmittedValues((prev) => ({
      ...prev,
      [metricId]: value,
    }));
  };

  const deriveEntryValues = (): EntryValue[] => {
    return Object.entries(submittedValues)
      .filter(([value]) => value !== undefined)
      .map(([metricId, value]) =>
        EntryValueSchema.parse({
          metric_id: metricId,
          value: value,
        }),
      );
  };

  const entryValues = deriveEntryValues();
  const isFormValid = entryValues.length > 0 && !!recordedAt;

  return (
    <div className="bg-primary-foreground/90 rounded-2xl shadow-xl p-8">
      <DateTimeInput value={recordedAt} onChange={setRecordedAt} />

      <div className="border border-primary/70 my-8" />

      <div className="space-y-4 mb-4">
        {trackedMetrics.map((m) => {
          const metric = m.metric;

          return (
            <div key={metric.id} className="flex flex-col gap-2">
              <label className="font-semibold">{metric.name}</label>
              <ValueSelect
                trackedMetric={m}
                handleChange={handleSubmittedValue}
              />
            </div>
          );
        })}
      </div>

      <SubmitButton
        values={entryValues}
        recorded_at={recordedAt}
        disabled={!isFormValid}
      />
    </div>
  );
}
