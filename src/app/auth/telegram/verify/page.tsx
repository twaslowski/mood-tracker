"use client";

import React, { useState, Suspense, useEffect } from "react";
import { Send } from "lucide-react";
import { GetCode } from "@/components/auth/telegram/get-code";
import { Verify } from "@/components/auth/telegram/verify";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { TelegramLinkStatus } from "@/components/auth/telegram/telegram-link-status";
import { createClient } from "@/lib/supabase/client.ts";

interface TelegramAccount {
  telegram_id: number;
  telegram_username: string | null;
}

function TelegramLinkContent() {
  const searchParams = useSearchParams();
  const verificationCode = searchParams.get("verification_code");
  const telegramId = searchParams.get("telegram_id");

  const [step, setStep] = useState(verificationCode && telegramId ? 2 : 1);
  const [isLinked, setIsLinked] = useState<boolean>(false);
  const [telegramAccount, setTelegramAccount] =
    useState<TelegramAccount | null>(null);

  const telegramBotName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME!;
  const telegramBotUrl = process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL!;

  useEffect(() => {
    async function fetchTelegramLink() {
      try {
        const supabase = createClient();

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setTelegramAccount(null);
          return;
        }

        // Check if user has a linked Telegram account
        const { data, error } = await supabase
          .from("telegram_accounts")
          .select("telegram_id, telegram_username")
          .eq("user_id", user.id)
          .single();

        if (error || !data) {
          setIsLinked(false);
          setTelegramAccount(null);
        } else {
          setIsLinked(true);
          setTelegramAccount(data);
        }
      } catch (error) {
        console.error("Error checking Telegram link:", error);
        setIsLinked(false);
        setTelegramAccount(null);
      }
    }

    void fetchTelegramLink();
  }, [telegramAccount]);

  const handleGetCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8 space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Send className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Link Telegram Account
          </h1>
          <p className="text-muted-foreground">
            Connect your Telegram for quick sign-in and notifications
          </p>
        </div>
      </div>

      {/* Telegram Link Status */}
      {isLinked && telegramAccount && (
        <TelegramLinkStatus
          telegramAccount={telegramAccount}
          onUnlinked={() => setTelegramAccount(null)}
        />
      )}

      {!isLinked && (
        <>
          <div className="flex items-center justify-center mb-8 gap-4">
            <div className="flex items-center gap-2">
              <Badge
                variant={step >= 1 ? "default" : "secondary"}
                className="w-8 h-8 rounded-full flex items-center justify-center p-0"
              >
                1
              </Badge>
              <span className="text-sm font-medium hidden sm:inline">
                Get Code
              </span>
            </div>
            <div
              className={`w-16 h-0.5 ${step >= 2 ? "bg-primary" : "bg-muted"}`}
            />
            <div className="flex items-center gap-2">
              <Badge
                variant={step >= 2 ? "default" : "secondary"}
                className="w-8 h-8 rounded-full flex items-center justify-center p-0"
              >
                2
              </Badge>
              <span className="text-sm font-medium hidden sm:inline">
                Verify
              </span>
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <GetCode
              telegramBotUsername={telegramBotName}
              telegramBotLink={telegramBotUrl}
              handleGetCode={handleGetCode}
            />
          )}

          {step === 2 && (
            <Verify
              onReturn={() => setStep(1)}
              initTelegramId={telegramId}
              verificationCode={verificationCode}
            />
          )}

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have Telegram?{" "}
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline underline-offset-4"
              >
                Download it here
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default function TelegramLinkPage() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-2xl mx-auto py-8 px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <TelegramLinkContent />
    </Suspense>
  );
}
