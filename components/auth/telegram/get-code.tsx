import { Button } from "@/components/ui/button.tsx";
import React from "react";
import Link from "next/link";

interface Props {
  telegramBotUsername: string;
  telegramBotLink: string;
  handleGetCode: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function GetCode({
  telegramBotUsername,
  telegramBotLink,
  handleGetCode,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          📱 Step 1: Get Your Code
        </h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>
            <Link href={telegramBotLink} className="font-medium underline">
              Text the moody bot on Telegram: {telegramBotUsername}
            </Link>
          </li>
          <li>
            Send the command:{" "}
            <code className="bg-blue-100 px-2 py-0.5 rounded">/start</code>
          </li>
          <li>You&apos;ll receive a 6-digit code</li>
        </ol>
      </div>

      <Button
        onClick={handleGetCode}
        className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        I Have My Code
      </Button>
    </div>
  );
}
