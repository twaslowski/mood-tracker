"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import MetricCreationDialog from "@/components/metric/metric-creation-dialog";
import { useRouter } from "next/navigation";

export default function MetricCreationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleComplete = () => {
    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>+ Create Metric</Button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              ✕ Close
            </button>
            <MetricCreationDialog onComplete={handleComplete} />
          </div>
        </div>
      )}
    </>
  );
}
