import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Entry } from "@/types/entry";
import { type EntryValueWithMetric } from "@/types/entryValue";
import { Metric } from "@/types/metric";

export function Entry({ entry }: { entry: Entry }) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Given the numeric value, possibly derive the corresponding label for discrete metrics
  const deriveMetricValue = (value: number, metric: Metric): string => {
    if (metric.metric_type === "continuous") {
      return value.toString();
    }

    return (
      Object.keys(metric.labels).find((key) => metric.labels[key] === value) ??
      value.toString()
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">
          {formatDateTime(entry.recorded_at)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Recorded Values
          </h4>
          <div className="flex flex-wrap gap-2">
            {entry.values.map((value: EntryValueWithMetric, index) => (
              <Badge
                key={index}
                variant="secondary"
                aria-label={`entry-${entry.id}-value-${value.metric.name}`}
                className="px-3 py-1"
              >
                <span className="font-medium">{value.metric.name}:</span>
                <span className="ml-1">
                  {deriveMetricValue(value.value, value.metric)}
                </span>
              </Badge>
            ))}
          </div>
          {entry.values.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              No values recorded
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
