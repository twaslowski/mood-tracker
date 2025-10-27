"use client";

import React from "react";
import { Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateEntryValue } from "@/types/entryValue";
import {createEntryAction} from "@/app/actions/entries";

interface SubmitButtonProps {
  values: CreateEntryValue[];
  recordedAt: string;
  disabled?: boolean;
}

export default function SubmitButton({
  values,
  recordedAt,
  disabled,
}: SubmitButtonProps) {
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      await createEntryAction({ values, recordedAt });
      router.push("/protected"); // Navigate back to protected page after successful submission
    } catch (error) {
      console.error("Failed to create entry:", error);
      // TODO: Add proper error handling/toast notification
    }
  };

  const handleCancel = () => {
    router.push("/protected");
  };

  return (
    <div className="flex gap-4 pt-4">
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Save className="w-5 h-5" />
        Save Entry
      </button>
      <button
        onClick={handleCancel}
        className="px-6 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <X className="w-5 h-5" />
        Cancel
      </button>
    </div>
  );
}
