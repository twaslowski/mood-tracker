import React from "react";
import { BarChart3, Plus, Settings } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">moody</h1>
          <p className="text-xl text-gray-600">
            Track your well-being, one entry at a time
          </p>
        </div>

        {/* Primary Action */}
        <div className="mb-8">
          <Link href="/protected/new-entry">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center justify-center gap-4">
                <Plus className="w-12 h-12" />
                <span className="text-3xl font-semibold">Create New Entry</span>
              </div>
              <p className="mt-3 text-indigo-100 text-lg">
                Log your mood, sleep, and other metrics
              </p>
            </button>
          </Link>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/protected/settings">
            <button className="bg-white hover:bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 text-left">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 rounded-lg p-3">
                  <Settings className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Manage Metrics
                  </h3>
                  <p className="text-gray-600">
                    Create and configure the metrics you want to track
                  </p>
                </div>
              </div>
            </button>
          </Link>

          <Link href="/protected/insights">
            <button className="bg-white hover:bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 text-left">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 rounded-lg p-3">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    View Insights
                  </h3>
                  <p className="text-gray-600">
                    Explore your data with interactive graphs and charts
                  </p>
                </div>
              </div>
            </button>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Your data is private and secure</p>
        </div>
      </div>
    </div>
  );
}
