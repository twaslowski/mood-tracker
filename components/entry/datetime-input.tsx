"use client";

import React from "react";
import { Calendar } from "lucide-react";

interface DateTimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DateTimeInput({ value, onChange }: DateTimeInputProps) {
  return (
    <div className="mb-8">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
        <Calendar className="w-5 h-5 text-indigo-600" />
        When did this occur?
      </label>
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
        required
      />
    </div>
  );
}
