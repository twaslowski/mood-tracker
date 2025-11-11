"use client";

import { AlertCircle, CheckCircle2, ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  initTelegramId: string | null;
  verificationCode: string | null;
  onReturn: () => void;
}

export function Verify({ initTelegramId, verificationCode, onReturn }: Props) {
  const [error, setError] = useState("");
  const [telegramId, setTelegramId] = useState(initTelegramId || "");
  const [code, setCode] = useState(verificationCode || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const SUPABASE_FUNCTIONS_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/functions/v1`;

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <Button variant="ghost" className="mb-4" onClick={onReturn}>
          <ChevronLeft />
          Back
        </Button>
        <CardTitle>Verify Telegram Account</CardTitle>
        <CardDescription>
          Enter your Telegram ID and verification code to link your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyCode} className="space-y-6 bg-w">
          <div className="space-y-2">
            <Label htmlFor="telegram-id">Telegram ID</Label>
            <Input
              id="telegram-id"
              type="text"
              value={telegramId}
              placeholder={"123456789"}
              onChange={(e) => setTelegramId(e.target.value)}
              className="text-center text-2xl font-mono tracking-widest"
              tabIndex={-1}
              disabled={success}
            />
            <p className="text-xs text-muted-foreground text-center">
              Your Telegram user ID
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              type="text"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="123456"
              maxLength={6}
              className="text-center text-2xl font-mono tracking-widest"
              autoFocus
              disabled={success}
            />
            <p className="text-xs text-muted-foreground text-center">
              Enter the 6-digit code from Telegram
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Your Telegram account has been successfully linked!
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={
              code.length !== 6 || telegramId === "" || loading || success
            }
            className="w-full"
            size="lg"
          >
            {loading ? "Verifying..." : success ? "Linked!" : "Link Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
