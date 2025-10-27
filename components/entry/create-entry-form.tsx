"use client";

import React, { useState } from "react";
import { Moon, Smile } from "lucide-react";
import { Metric } from "@/types/metric";
import { CreateEntryValue } from "@/types/entryValue";
import DateTimeInput from "./datetime-input";
import MetricInput from "./metric-input";
import SubmitButton from "./submit-button";

interface CreateEntryFormProps {
  metrics: Metric[];
}

// todo this could also use some cleaning up
export default function CreateEntryForm({
  metrics,
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

  const getEntryValues = (): CreateEntryValue[] => {
    return Object.entries(metricValues)
      .filter(([_, value]) => value !== "" && value !== undefined)
      .map(([metricId, value]) => ({
        metric_id: metricId,
        value: parseFloat(value),
      }));
  };

  const getIconForMetric = (metricId: string) => {
    switch (metricId) {
      case "mood":
        return <Smile className="w-5 h-5" />;
      case "sleep":
        return <Moon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const entryValues = getEntryValues();
  const isFormValid = entryValues.length > 0 && recordedAt;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <DateTimeInput value={recordedAt} onChange={setRecordedAt} />

      {metrics.map((metric) => (
        <MetricInput
          key={metric.id}
          metric={metric}
          value={metricValues[metric.id] || ""}
          onChange={(value) => handleMetricChange(metric.id, value)}
          icon={getIconForMetric(metric.id)}
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
