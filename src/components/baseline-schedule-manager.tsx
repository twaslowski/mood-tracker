"use client";

import { useState, useEffect } from "react";
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
import {
  scheduleBaselineEntryCron,
  unscheduleBaselineEntryCron,
  getBaselineEntrySchedule,
} from "@/app/actions/baselineSchedule";
import { BaselineEntrySchedule } from "@/types/baselineSchedule";
import toast from "react-hot-toast";

export function BaselineScheduleManager() {
  const [schedule, setSchedule] = useState<BaselineEntrySchedule | null>(null);
  const [cronSchedule, setCronSchedule] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void loadSchedule();
  }, []);

  const loadSchedule = async () => {
    const result = await getBaselineEntrySchedule();
    if (result.error) {
      toast.error(result.error);
    } else if (result.schedule) {
      setSchedule(result.schedule);
      setCronSchedule(result.schedule.cron_schedule);
      setWebhookUrl(result.schedule.webhook_url || "");
    }
  };

  const handleSchedule = async () => {
    if (!cronSchedule) {
      toast.error("Please enter a cron schedule");
      return;
    }

    setLoading(true);
    const result = await scheduleBaselineEntryCron(cronSchedule, webhookUrl);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Baseline entry schedule created");
      await loadSchedule();
    }
  };

  const handleUnschedule = async () => {
    setLoading(true);
    const result = await unscheduleBaselineEntryCron();
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Baseline entry schedule removed");
      setSchedule(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule Automatic Baseline Entries</CardTitle>
          <CardDescription>
            Set up a recurring schedule to automatically create baseline entries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cronSchedule">Cron Schedule</Label>
            <Input
              id="cronSchedule"
              placeholder="0 9 * * * (daily at 9am)"
              value={cronSchedule}
              onChange={(e) => setCronSchedule(e.target.value)}
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Examples: <code>0 9 * * *</code> (daily at 9am),{" "}
              <code>0 12 * * 1</code> (Mondays at noon)
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSchedule} disabled={loading}>
              {schedule?.enabled ? "Update Schedule" : "Create Schedule"}
            </Button>
            {schedule?.enabled && (
              <Button
                onClick={handleUnschedule}
                variant="destructive"
                disabled={loading}
              >
                Remove Schedule
              </Button>
            )}
          </div>

          {schedule && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h4 className="font-semibold mb-2">Current Schedule</h4>
              <dl className="space-y-1 text-sm">
                <div>
                  <dt className="inline font-medium">Status: </dt>
                  <dd className="inline">
                    {schedule.enabled ? "Active" : "Disabled"}
                  </dd>
                </div>
                <div>
                  <dt className="inline font-medium">Schedule: </dt>
                  <dd className="inline">{schedule.cron_schedule}</dd>
                </div>
                {schedule.webhook_url && (
                  <div>
                    <dt className="inline font-medium">Webhook: </dt>
                    <dd className="inline">{schedule.webhook_url}</dd>
                  </div>
                )}
                {schedule.last_run_at && (
                  <div>
                    <dt className="inline font-medium">Last run: </dt>
                    <dd className="inline">
                      {new Date(schedule.last_run_at).toLocaleString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
