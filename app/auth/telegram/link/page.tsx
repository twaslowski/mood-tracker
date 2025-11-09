"use client";

import React, { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function TelegramLinkPage() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Get Telegram ID, 2: Enter Code

  const SUPABASE_FUNCTIONS_URL = "https://localhost:54321/functions/v1";

  const handleGetCode = (e) => {
    e.preventDefault();
    if (!telegramId) {
      setError("Please enter your Telegram ID");
      return;
    }
    setStep(2);
    setError("");
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${SUPABASE_FUNCTIONS_URL}/auth-telegram?action=verify-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            telegram_id: parseInt(telegramId),
            code: code.trim(),
            email: email || undefined,
          }),
        },
      );

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      if (data.session) {
        // In production, set session in Supabase client:
        // await supabase.auth.setSession({
        //   access_token: data.session.access_token,
        //   refresh_token: data.session.refresh_token
        // })

        setSuccess(true);
        setLoading(false);

        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
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
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Account Linked!
              </h2>
              <p className="text-gray-600 mb-4">
                Your Telegram account has been successfully linked.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <>
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
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      📱 Step 1: Get Your Code
                    </h3>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Open Telegram and find our bot</li>
                      <li>
                        Send the command:{" "}
                        <code className="bg-blue-100 px-2 py-0.5 rounded">
                          /start
                        </code>
                      </li>
                      <li>You&apos;ll receive a 6-digit code</li>
                    </ol>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telegram ID (optional)
                    </label>
                    <input
                      type="text"
                      value={telegramId}
                      onChange={(e) =>
                        setTelegramId(e.target.value.replace(/\D/g, ""))
                      }
                      onKeyPress={(e) => e.key === "Enter" && handleGetCode(e)}
                      placeholder="123456789"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Find your ID in the bot message or leave blank
                    </p>
                  </div>

                  <button
                    onClick={handleGetCode}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    I Have My Code
                  </button>
                </div>
              )}

              {/* Step 2: Enter Code */}
              {step === 2 && (
                <div className="space-y-6">
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
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        code.length === 6 &&
                        handleVerifyCode()
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      For account recovery (recommended)
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleVerifyCode}
                    disabled={loading || code.length !== 6}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Link Account"
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setStep(1);
                      setCode("");
                      setError("");
                    }}
                    className="w-full text-gray-600 py-2 text-sm hover:text-gray-900"
                  >
                    ← Back to instructions
                  </button>
                </div>
              )}
            </>
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
