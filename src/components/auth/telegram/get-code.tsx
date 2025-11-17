import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle>📱 Get Your Verification Code</CardTitle>
        <CardDescription>
          Follow these steps to receive your code from Telegram
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ol className="space-y-3 list-decimal list-inside text-sm">
          <li>
            <Link
              href={telegramBotLink}
              className="font-medium underline underline-offset-4 hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open the moody bot: {telegramBotUsername}
            </Link>
          </li>
          <li>
            Send the command:{" "}
            <code className="bg-muted px-2 py-0.5 rounded font-mono text-sm">
              /start
            </code>
          </li>
          <li>You&apos;ll receive a 6-digit verification code</li>
        </ol>

        <Button onClick={handleGetCode} className="w-full" size="lg">
          I Have My Code
        </Button>
      </CardContent>
    </Card>
  );
}
