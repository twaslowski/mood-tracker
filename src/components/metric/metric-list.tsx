"use client";

import { type MetricTracking } from "@/types/tracking";
import { type Metric } from "@/types/metric";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  trackMetric,
  untrackMetric,
  updateBaseline,
} from "@/app/actions/metric";
import React, { useState, useTransition, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import ValueSelect from "@/components/entry/value-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MetricListProps {
  metrics: Metric[];
  metricTracking: MetricTracking[];
}

export default function MetricList({
  metrics,
  metricTracking,
}: MetricListProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("tracked");

  const [optimisticTracking, setOptimisticTracking] = useState<
    Map<string, MetricTracking>
  >(new Map(metricTracking.map((tracking) => [tracking.metric.id, tracking])));

  // Categorize metrics
  const categorizedMetrics = useMemo(() => {
    const tracked: Metric[] = [];
    const user: Metric[] = [];
    const system: Metric[] = [];

    metrics.forEach((metric) => {
      const isTracked = optimisticTracking.has(metric.id);

      if (isTracked) {
        tracked.push(metric);
      }

      if (metric.owner_id === "SYSTEM") {
        system.push(metric);
      } else {
        user.push(metric);
      }
    });

    return { tracked, user, system };
  }, [metrics, optimisticTracking]);

  const handleToggle = async (metric: Metric, isCurrentlyTracked: boolean) => {
    const newTracking = new Map(optimisticTracking);

    if (isCurrentlyTracked) {
      newTracking.delete(metric.id);
    } else {
      // Create optimistic tracking entry
      newTracking.set(metric.id, {
        user_id: "",
        tracked_at: new Date().toISOString(),
        baseline: 0,
        metric: metric,
      });
    }
    setOptimisticTracking(newTracking);

    // Perform server action
    startTransition(async () => {
      try {
        if (isCurrentlyTracked) {
          await untrackMetric(metric.id);
        } else {
          await trackMetric(metric.id, 0);
        }
      } catch (error) {
        // Revert optimistic update on error
        setOptimisticTracking(
          new Map(
            metricTracking.map((tracking) => [tracking.metric.id, tracking]),
          ),
        );
        console.error("Failed to toggle metric:", error);
      }
    });
  };

  const handleBaselineUpdate = async (
    metricId: string,
    newBaseline: number,
  ) => {
    const currentTracking = optimisticTracking.get(metricId);
    if (!currentTracking) return;

    // Optimistic update
    const newTracking = new Map(optimisticTracking);
    newTracking.set(metricId, { ...currentTracking, baseline: newBaseline });
    setOptimisticTracking(newTracking);

    // Perform server action
    startTransition(async () => {
      try {
        await updateBaseline(metricId, newBaseline);
      } catch (error) {
        // Revert optimistic update on error
        setOptimisticTracking(
          new Map(
            metricTracking.map((tracking) => [tracking.metric.id, tracking]),
          ),
        );
        console.error("Failed to update baseline:", error);
      }
    });
  };

  const getMetricTypeColor = (type: string) => {
    switch (type) {
      case "discrete":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "continuous":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "duration":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      default:
        return "";
    }
  };

  const renderMetricCard = (metric: Metric) => {
    const tracking = optimisticTracking.get(metric.id);
    const isTracked = !!tracking;

    return (
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
                <Badge
                  variant="outline"
                  className={getMetricTypeColor(metric.metric_type)}
                >
                  {metric.metric_type}
                </Badge>
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
                  Baseline:
                </Label>
                <ValueSelect
                  trackedMetric={tracking}
                  handleChange={handleBaselineUpdate}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tracked">
          Tracked ({categorizedMetrics.tracked.length})
        </TabsTrigger>
        <TabsTrigger value="user">
          User ({categorizedMetrics.user.length})
        </TabsTrigger>
        <TabsTrigger value="system">
          System ({categorizedMetrics.system.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tracked" className="space-y-4">
        {categorizedMetrics.tracked.length > 0 ? (
          categorizedMetrics.tracked.map(renderMetricCard)
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No tracked metrics yet. Switch to User or System tabs to track
            metrics.
          </div>
        )}
      </TabsContent>

      <TabsContent value="user" className="space-y-4">
        {categorizedMetrics.user.length > 0 ? (
          categorizedMetrics.user.map(renderMetricCard)
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No user-created metrics yet.
          </div>
        )}
      </TabsContent>

      <TabsContent value="system" className="space-y-4">
        {categorizedMetrics.system.length > 0 ? (
          categorizedMetrics.system.map(renderMetricCard)
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No system metrics available.
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
