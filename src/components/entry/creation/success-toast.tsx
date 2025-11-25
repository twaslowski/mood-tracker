"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { CheckIcon } from "lucide-react";

export default function SuccessToast({ message }: { message?: string }) {
  useEffect(() => {
    if (message) {
      toast(message, { icon: <CheckIcon /> });
    }
  }, [message]);

  return null;
}
