"use client";

import React, { useState } from "react";
import { type MetricTracking } from "@/types/tracking";
import { type EntryValue, EntryValueSchema } from "@/types/entryValue";
import MetricInput from "./metric-input";
import SubmitButton from "./submit-button";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CreateEntryFormProps {
  trackedMetrics: MetricTracking[];
}

export default function EntryCreationForm({
  trackedMetrics,
}: CreateEntryFormProps) {
  const [recordedAt] = useState(new Date().toISOString().slice(0, 16));
  const [metricValues, setMetricValues] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleMetricSubmit = (metricId: string, value: number) => {
    setMetricValues((prev) => ({
      ...prev,
      [metricId]: value,
    }));
    nextMetric();
  };

  const nextMetric = () => {
    setCurrentIndex((idx) => Math.min(idx + 1, trackedMetrics.length));
  };

  const previousMetric = () => {
    setCurrentIndex((idx) => Math.max(idx - 1, 0));
  };

  const getEntryValues = (): EntryValue[] => {
    return Object.entries(metricValues)
      .filter(([value]) => value !== undefined)
      .map(([metricId, value]) =>
        EntryValueSchema.parse({
          metric_id: metricId,
          value: value,
        }),
      );
  };

  // Utility functions
  const entryValues = getEntryValues();
  const isFormValid = entryValues.length > 0 && !!recordedAt;
  const allMetricsProcessed = currentIndex >= trackedMetrics.length;
  const currentTracking = !allMetricsProcessed
    ? trackedMetrics[currentIndex]
    : undefined;

  return (
    <div className="bg-primary-foreground/90 rounded-2xl shadow-xl p-8">
      <Toaster />
      {/*
      <DateTimeInput value={recordedAt} onChange={setRecordedAt} />
      */}

      {/* Progress Indicator */}
      {trackedMetrics.length > 0 && !allMetricsProcessed && (
        <p className="text-sm mb-4">
          Metric {currentIndex + 1} of {trackedMetrics.length}
        </p>
      )}

      {/* Sequential Metric Input */}
      {!allMetricsProcessed && currentTracking && (
        <div>
          <MetricInput
            key={currentTracking.metric.id}
            metric={currentTracking.metric}
            onMetricSelect={handleMetricSubmit}
          />

          <div className="flex gap-4 mt-2">
            <Button onClick={previousMetric} className="flex-1">
              <ChevronLeft />
              Back
            </Button>
            <Button onClick={nextMetric} className="flex-1">
              Skip
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}

      {/* Summary & Submit */}
      {allMetricsProcessed && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Summary</h3>
          <ul className="space-y-2">
            {trackedMetrics.map((tm) => {
              const val = metricValues[tm.metric.id];
              return (
                <li
                  key={tm.metric.id}
                  className="flex justify-between border rounded-md px-3 py-2 text-sm"
                >
                  <span>{tm.metric.name}</span>
                  <span className="font-medium">
                    {val !== undefined ? val : "Skipped"}
                  </span>
                </li>
              );
            })}
          </ul>
          <SubmitButton
            values={entryValues}
            recordedAt={recordedAt}
            disabled={!isFormValid}
          />
        </div>
      )}
    </div>
  );
}
