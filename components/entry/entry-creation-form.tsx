"use client";

import React, { useState, useEffect } from "react";
import { type MetricTracking } from "@/types/tracking";
import { type EntryValue, EntryValueSchema } from "@/types/entryValue";
import { type Metric } from "@/types/metric";
import SubmitButton from "./submit-button";
import DateTimeInput from "@/components/entry/datetime-input";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "lucide-react";
import { range } from "@/lib/utils";

function getMetricOptions(metric: Metric): { label: string; value: number }[] {
  if (metric.metric_type === "discrete") {
    if (!metric.labels) return [];
    return Object.entries(metric.labels)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value }));
  }
  // continuous metric
  if (
    metric.min_value !== null &&
    metric.max_value !== null &&
    metric.min_value <= metric.max_value
  ) {
    return range(metric.min_value, metric.max_value).map((v) => ({
      label: String(v),
      value: v,
    }));
  }
  return [];
}

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
          const selected = submittedValues[metric.id];
          const options = getMetricOptions(metric);

          if (options.length === 0) return null;

          return (
            <div key={metric.id} className="flex flex-col gap-2">
              <label className="font-semibold">{metric.name}</label>
              <Select.Root
                value={selected !== undefined ? String(selected) : ""}
                onValueChange={(val) =>
                  handleSubmittedValue(metric.id, Number(val))
                }
              >
                <Select.Trigger
                  className="inline-flex items-center justify-between rounded-md border border-primary/50 px-3 py-2"
                  aria-label={`select-${metric.name}`}
                >
                  <Select.Value placeholder={`Select ${metric.name}`} />
                  <Select.Icon>
                    <ChevronDownIcon className="h-4 w-4 opacity-70" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                    <Select.Viewport className="p-1">
                      {options.map((opt) => (
                        <Select.Item
                          key={opt.value}
                          value={String(opt.value)}
                          className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                        >
                          <Select.ItemText>
                            <span
                              className={
                                opt.value === m.baseline
                                  ? "font-medium text-blue-300"
                                  : ""
                              }
                            >
                              {opt.label}
                              {opt.value === m.baseline}
                            </span>
                          </Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          );
        })}
      </div>

      <SubmitButton
        values={entryValues}
        recordedAt={recordedAt}
        disabled={!isFormValid}
      />
    </div>
  );
}
