"use client";

import React from "react";
import { type Metric } from "@/types/metric";

interface MetricInputProps {
  metric: Metric;
  value: string;
  onChange: (value: string) => void;
}

export default function MetricInput({
  metric,
  value,
  onChange,
}: MetricInputProps) {
  const renderDiscreteInput = () => {
    if (!metric.labels) return null;

    return (
      <div className="space-y-3">
        {Object.entries(metric.labels)
          .sort()
          .map(([val, label]) => (
            <label
              key={val}
              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                value === val
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300"
              }`}
            >
              <input
                type="radio"
                name={metric.id}
                value={val}
                checked={value === val}
                onChange={(e) => onChange(e.target.value)}
                className="w-5 h-5 text-indigo-600"
              />
              <span className="text-lg font-medium text-gray-800">{label}</span>
            </label>
          ))}
      </div>
    );
  };

  const renderContinuousInput = () => {
    return (
      <>
        <input
          type="number"
          step={metric.metric_type === "duration" ? "0.5" : "1"}
          min={metric.min_value ?? undefined}
          max={metric.max_value ?? undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`e.g., ${metric.max_value ? Math.floor(metric.max_value / 2) : "10"}`}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
        />
        <p className="mt-2 text-sm text-gray-500">
          Optional: {metric.description}
          {metric.min_value !== null &&
            metric.max_value !== null &&
            ` (${metric.min_value} - ${metric.max_value})`}
        </p>
      </>
    );
  };

  return (
    <div className="mb-8">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
        {metric.name}
      </label>
      {metric.metric_type === "discrete"
        ? renderDiscreteInput()
        : renderContinuousInput()}
    </div>
  );
}
