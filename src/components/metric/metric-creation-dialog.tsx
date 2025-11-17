"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createMetric } from "@/app/actions/metric";

type MetricType = "discrete" | "continuous" | "duration";

interface MetricFormData {
  name: string;
  description: string;
  metricType: MetricType | null;
  labels: Record<string, number>;
  minValue: number | null;
  maxValue: number | null;
}

interface LabelEntry {
  label: string;
  value: string;
}

export default function MetricCreationDialog({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<MetricFormData>({
    name: "",
    description: "",
    metricType: null,
    labels: {},
    minValue: null,
    maxValue: null,
  });

  // For discrete metrics
  const [labelEntries, setLabelEntries] = useState<LabelEntry[]>([
    { label: "", value: "" },
  ]);

  const totalSteps = formData.metricType === "discrete" ? 4 : 4;

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleMetricTypeSelection = (type: MetricType) => {
    setFormData({ ...formData, metricType: type });
    handleNext();
  };

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Convert label entries to labels object for discrete metrics
      const labels: Record<string, number> = {};
      if (formData.metricType === "discrete") {
        labelEntries.forEach((entry) => {
          if (entry.label && entry.value) {
            labels[entry.label] = parseFloat(entry.value);
          }
        });
      }

      await createMetric({
        name: formData.name,
        description: formData.description,
        metric_type: formData.metricType!,
        labels: formData.metricType === "discrete" ? labels : {},
        min_value:
          formData.metricType !== "discrete" ? formData.minValue : null,
        max_value:
          formData.metricType !== "discrete" ? formData.maxValue : null,
      });

      onComplete?.();
    } catch (error) {
      console.error("Failed to create metric:", error);
      alert("Failed to create metric. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedStep1 = formData.name.trim().length > 0;
  const canProceedStep2 = formData.description.trim().length > 0;
  const canProceedStep4 =
    formData.metricType === "discrete"
      ? labelEntries.some((e) => e.label && e.value)
      : formData.minValue !== null &&
        formData.maxValue !== null &&
        formData.minValue < formData.maxValue;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Metric</CardTitle>
        <CardDescription>
          Step {step} of {totalSteps}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What would you like to track?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Give your metric a short, descriptive name.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Metric Name</Label>
              <Input
                id="name"
                placeholder="e.g., Exercise, Stress Level, Water Intake"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button onClick={handleNext} disabled={!canProceedStep1}>
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Describe what you&apos;re tracking
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add a brief description to help you remember what this metric is
                for.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Minutes of exercise per day"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                autoFocus
              />
            </div>
            <div className="flex justify-between gap-2 mt-6">
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
              <Button onClick={handleNext} disabled={!canProceedStep2}>
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                How do you want to record this metric?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose the type that best fits what you&apos;re tracking.
              </p>
            </div>
            <div className="space-y-3">
              <Card
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleMetricTypeSelection("discrete")}
              >
                <CardHeader>
                  <CardTitle className="text-base">
                    Choose from specific options
                  </CardTitle>
                  <CardDescription>
                    Best for moods, ratings, or categories. You&apos;ll define
                    custom labels like &quot;Great&quot;, &quot;Good&quot;,
                    &quot;Poor&quot;.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleMetricTypeSelection("continuous")}
              >
                <CardHeader>
                  <CardTitle className="text-base">
                    Enter a number in a range
                  </CardTitle>
                  <CardDescription>
                    Best for measurements with numeric values, like hours of
                    sleep (0-12) or steps taken.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleMetricTypeSelection("duration")}
              >
                <CardHeader>
                  <CardTitle className="text-base">
                    Track time duration
                  </CardTitle>
                  <CardDescription>
                    Best for tracking how long you did something, like minutes
                    of meditation or exercise.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
            <div className="flex justify-between gap-2 mt-6">
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
            </div>
          </div>
        )}

        {step === 4 && formData.metricType === "discrete" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Define your options
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create labels for your metric. Each label needs a name and a
                numeric value (higher values typically mean &quot;better&quot;).
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
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canProceedStep4 || isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Metric"}
              </Button>
            </div>
          </div>
        )}

        {step === 4 &&
          (formData.metricType === "continuous" ||
            formData.metricType === "duration") && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Set the value range
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {formData.metricType === "duration"
                    ? "What&apos;s the minimum and maximum time duration you might track?"
                    : "What&apos;s the minimum and maximum value you might record?"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minValue">Minimum Value</Label>
                  <Input
                    id="minValue"
                    type="number"
                    placeholder="e.g., 0"
                    value={formData.minValue ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minValue: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxValue">Maximum Value</Label>
                  <Input
                    id="maxValue"
                    type="number"
                    placeholder="e.g., 24"
                    value={formData.maxValue ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxValue: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-between gap-2 mt-6">
                <Button onClick={handleBack} variant="outline">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceedStep4 || isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Metric"}
                </Button>
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
