"use client";

import React from "react";
import { Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type EntryValue } from "@/types/entryValue";
import { createEntry } from "@/lib/service/entryService";
import toast from "react-hot-toast";

interface SubmitButtonProps {
  values: EntryValue[];
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
      await createEntry({ values, recordedAt });
      router.push("/protected");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create entry. Please try again.");
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
        <X className="w-5 h-5" aria-label="submit-entry" />
        Cancel
      </button>
    </div>
  );
}
