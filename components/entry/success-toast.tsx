"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export default function SuccessToast({ message }: { message?: string }) {
  useEffect(() => {
    if (message) {
      toast(message, { icon: "✅" });
    }
  }, [message]);

  return null;
}
