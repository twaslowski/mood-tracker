import React from "react";
import { BarChart3, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Primary Action */}
        <div className="mb-8">
          <Link href="/protected/new-entry">
            <Button className="w-full rounded-2xl p-8">
              <div className="flex items-center justify-center gap-4">
                <Plus className="w-12 h-12" />
                <span className="text-3xl font-semibold">Create New Entry</span>
              </div>
              <p className="mt-3 text-lg">
                Log your mood, sleep, and other metrics
              </p>
            </Button>
          </Link>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/protected/settings">
            <Button className="bg-white hover:bg-gray-50 rounded-xl p-6 text-left">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 rounded-lg p-3">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Manage Metrics</h3>
                  <p>Create and configure the metrics you want to track</p>
                </div>
              </div>
            </Button>
          </Link>

          <Link href="/protected/insights">
            <Button className="rounded-xl p-6 text-left">
              <div className="flex items-start gap-4">
                <div className="rounded-lg p-3">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">View Insights</h3>
                  <p>Explore your data with interactive graphs and charts</p>
                </div>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
