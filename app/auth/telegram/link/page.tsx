"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { GetCode } from "@/components/auth/telegram/get-code";
import { Verify } from "@/components/auth/telegram/verify";
import { useSearchParams } from "next/navigation";

export default function TelegramLinkPage() {
  const searchParams = useSearchParams();
  const verificationCode = searchParams.get("verification_code");
  const telegramId = searchParams.get("telegram_id");
  const [step, setStep] = useState(verificationCode && telegramId ? 2 : 1);

  const handleGetCode = (e) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-600 rounded-2xl mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Link Telegram Account
          </h1>
          <p className="text-gray-600">
            Connect your Telegram for quick sign-in
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Steps Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div
              className={`flex items-center ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                1
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">
                Get Code
              </span>
            </div>
            <div
              className={`w-16 h-0.5 mx-2 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}
            />
            <div
              className={`flex items-center ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">
                Verify
              </span>
            </div>
          </div>

          {/* Step 1: Instructions */}
          {step === 1 && (
            <GetCode
              telegramBotUsername={"@moody-qa"}
              telegramBotLink={"https://t.me/open_mood_tracker_qa_bot"}
              handleGetCode={handleGetCode}
            />
          )}

          {/* Step 2: Enter Code */}
          {step === 2 && (
            <Verify
              initTelegramId={telegramId}
              verificationCode={verificationCode}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don&apos;t have Telegram?{" "}
            <a
              href="https://telegram.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Download it here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
