import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ValueSelect from "@/components/entry/value-select";
import { Metric } from "@/types/metric";
import { MetricTracking } from "@/types/tracking";
import { MetricLabels } from "@/components/metric/metric-labels.tsx";

interface MetricCardProps {
  metric: Metric;
  tracking?: MetricTracking;
  isTracked: boolean;
  isPending: boolean;
  handleToggle: (metric: Metric, isTracked: boolean) => void;
  handleBaselineUpdate: (metricId: string, newBaseline: number) => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  tracking,
  isTracked,
  isPending,
  handleToggle,
  handleBaselineUpdate,
}) => (
  <Card
    key={metric.id}
    className="transition-opacity"
    style={{ opacity: isPending ? 0.7 : 1 }}
  >
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <CardTitle className="text-xl">{metric.name}</CardTitle>
            <MetricLabels metric={metric} />
          </div>
          <CardDescription>{metric.description}</CardDescription>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Checkbox
            id={`metric-${metric.id}`}
            checked={isTracked}
            onCheckedChange={() => handleToggle(metric, isTracked)}
            disabled={isPending}
          />
          <Label
            htmlFor={`metric-${metric.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Track
          </Label>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {/* Baseline input for tracked metrics */}
        {isTracked && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Label
              htmlFor={`baseline-${metric.id}`}
              className="text-sm font-medium whitespace-nowrap"
            >
              Your normal:
            </Label>
            <ValueSelect
              metric={metric}
              baseline={tracking?.baseline ?? 0}
              handleChange={handleBaselineUpdate}
            />
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export default MetricCard;
