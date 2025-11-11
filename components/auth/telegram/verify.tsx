"use client";

import { AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  initTelegramId: number;
  verificationCode: string;
}

export function Verify({ initTelegramId, verificationCode }: Props) {
  const [error, setError] = useState("");
  const [telegramId, setTelegramId] = useState(initTelegramId || "");
  const [code, setCode] = useState(verificationCode || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const SUPABASE_FUNCTIONS_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/functions/v1`

  const handleVerifyCode = async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("You must be logged in to link your Telegram account");
        setLoading(false);
        return;
      }

      const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/telegram-auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          telegram_id: parseInt(telegramId),
          code: code.trim(),
          userId: session.user.id,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setLoading(false);
      setSuccess(true);
    } catch (e) {
      console.error("Network error:", e);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Telegram ID
        </label>
        <input
          type="text"
          value={telegramId}
          onChange={(e) => setTelegramId(e.target.value)}
          className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          tabIndex={-1}
        />
        <p className="text-xs text-gray-500 mt-1 text-center">
          Enter the 6-digit code from Telegram
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verification Code
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="123456"
          maxLength={6}
          className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          autoFocus
        />
        <p className="text-xs text-gray-500 mt-1 text-center">
          Enter the 6-digit code from Telegram
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <p className="text-sm">
            Your Telegram account has been successfully linked!
          </p>
        </div>
      )}

      <button
        onClick={handleVerifyCode}
        disabled={code.length !== 6 || telegramId === "" || loading || success}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? "Verifying..." : "Link Account"}
      </button>
    </div>
  );
}
