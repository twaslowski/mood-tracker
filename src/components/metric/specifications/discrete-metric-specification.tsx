"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LabelEntry {
  label: string;
  value: string;
}

interface DiscreteMetricSpecificationProps {
  onBack: () => void;
  onSubmit: (labels: Record<string, number>) => void;
  isSubmitting: boolean;
  initialLabels?: Record<string, number>;
}

export default function DiscreteMetricSpecification({
  onBack,
  onSubmit,
  isSubmitting,
  initialLabels,
}: DiscreteMetricSpecificationProps) {
  const [labelEntries, setLabelEntries] = useState<LabelEntry[]>(() => {
    if (!initialLabels || Object.keys(initialLabels).length === 0) {
      return [{ label: "", value: "" }];
    }
    return Object.entries(initialLabels).map(([label, value]) => ({
      label,
      value: String(value),
    }));
  });

  const addLabelEntry = () => {
    setLabelEntries([...labelEntries, { label: "", value: "" }]);
  };

  const updateLabelEntry = (
    index: number,
    field: "label" | "value",
    value: string,
  ) => {
    const newEntries = [...labelEntries];
    newEntries[index][field] = value;
    setLabelEntries(newEntries);
  };

  const removeLabelEntry = (index: number) => {
    if (labelEntries.length > 1) {
      setLabelEntries(labelEntries.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    const labels: Record<string, number> = {};
    labelEntries.forEach((entry) => {
      if (entry.label && entry.value) {
        labels[entry.label] = parseFloat(entry.value);
      }
    });
    onSubmit(labels);
  };

  const canProceed = labelEntries.some((e) => e.label && e.value);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Define your options</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create labels for your metric. Each label needs a name and a numeric
          value (higher values typically mean &quot;better&quot;).
        </p>
      </div>
      <div className="space-y-3">
        {labelEntries.map((entry, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor={`label-${index}`}>Label</Label>
              <Input
                id={`label-${index}`}
                placeholder="e.g., Happy, Sad, Neutral"
                value={entry.label}
                onChange={(e) =>
                  updateLabelEntry(index, "label", e.target.value)
                }
              />
            </div>
            <div className="w-24">
              <Label htmlFor={`value-${index}`}>Value</Label>
              <Input
                id={`value-${index}`}
                type="number"
                placeholder="e.g., 1"
                value={entry.value}
                onChange={(e) =>
                  updateLabelEntry(index, "value", e.target.value)
                }
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeLabelEntry(index)}
              disabled={labelEntries.length === 1}
            >
              ×
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addLabelEntry}
          className="w-full"
        >
          + Add Another Option
        </Button>
      </div>
      <div className="flex justify-between gap-2 mt-6">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={!canProceed || isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Metric"}
        </Button>
      </div>
    </div>
  );
}
