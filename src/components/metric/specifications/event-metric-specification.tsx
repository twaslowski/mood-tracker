"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface EventMetricSpecificationProps {
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function EventMetricSpecification({
  onBack,
  onSubmit,
  isSubmitting,
}: EventMetricSpecificationProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Ready to track events</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This metric will let you simply tap to log whenever the event occurs.
          Perfect for tracking yes/no activities like taking medication,
          exercising, or any other binary event.
        </p>
      </div>
      <div className="flex justify-between gap-2 mt-6">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Metric"}
        </Button>
      </div>
    </div>
  );
}
