import React from "react";
import { Mood } from "@/constants/mood";
import { Sleep } from "@/constants/sleep";
import CreateEntryForm from "@/components/entry/create-entry-form";

export default function CreateEntryPage() {
  const metrics = [Mood, Sleep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create New Entry
          </h1>
          <p className="text-gray-600">
            Record your metrics for a specific point in time
          </p>
        </div>

        {/* Form */}
        <CreateEntryForm metrics={metrics} />

        {/* Helper Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            You can leave metrics blank if you don&apos;t want to record them
          </p>
        </div>
      </div>
    </div>
  );
}
