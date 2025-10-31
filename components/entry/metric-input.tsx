"use client";

import React from "react";
import { type Metric } from "@/types/metric";
import { range } from "@/lib/utils";

interface MetricInputProps {
  metric: Metric;
  onMetricSelect: (metricId: string, value: number) => void;
}

export default function MetricInput({
  metric,
  onMetricSelect,
}: MetricInputProps) {
  const renderDiscreteInput = () => {
    if (!metric.labels) {
      throw new Error("Discrete metrics must have labels defined.");
    }

    return (
      <>
        {Object.entries(metric.labels)
          // order by values descending
          .sort((a, b) => b[1] - a[1])
          .map(([label, value]) => (
            <div
              key={value}
              className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all"
              onClick={() => onMetricSelect(metric.id, value)}
            >
              <button aria-label={`select-${metric.name}-value-${label}`}>
                <p>{label}</p>
              </button>
            </div>
          ))}
      </>
    );
  };

  const renderContinuousInput = () => {
    if (metric.min_value === null || metric.max_value === null) {
      throw new Error(
        "Continuous metrics must have min and max values defined.",
      );
    }

    return range(metric.min_value, metric.max_value).map((val) => (
      <div
        key={val}
        onClick={() => onMetricSelect(metric.id, val)}
        className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all"
      >
        <button>
          <p>{val}</p>
        </button>
      </div>
    ));
  };

  return (
    <div className="mb-8 space-y-3 border border-primary-foreground rounded-lg p-4">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
        {metric.name}
      </label>
      {metric.metric_type === "discrete"
        ? renderDiscreteInput()
        : renderContinuousInput()}
    </div>
  );
}
