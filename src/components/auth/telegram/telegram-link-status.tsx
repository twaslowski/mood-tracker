"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";

interface Props {
  onUnlinked: () => void;
  telegramAccount: TelegramAccount;
}

interface TelegramAccount {
  telegram_id: number;
  telegram_username: string | null;
}

export function TelegramLinkStatus({ onUnlinked, telegramAccount }: Props) {
  const [loading, setLoading] = useState(false);
  const { telegram_id } = telegramAccount || {};

  async function handleUnlink() {
    if (!telegramAccount) return;

    setLoading(true);
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("telegram_accounts")
        .delete()
        .eq("telegram_id", telegram_id);

      if (error) {
        console.error("Error unlinking Telegram:", error);
        toast.error("Failed to unlink Telegram account");
      } else {
        onUnlinked();
        toast.success("Telegram account unlinked successfully");
      }
    } catch (error) {
      console.error("Error unlinking Telegram:", error);
      toast.error("Failed to unlink Telegram account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <CardTitle>Already Connected</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Your account is already linked to Telegram
          {telegramAccount.telegram_username &&
            ` (@${telegramAccount.telegram_username})`}
          .{telegramAccount.telegram_id && ` [${telegramAccount.telegram_id}]`}.
        </CardDescription>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Unlinking...
                </>
              ) : (
                "Unlink Telegram"
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unlink Telegram Account?</AlertDialogTitle>
              <AlertDialogDescription>
                This will disconnect your Telegram account
                {telegramAccount.telegram_username &&
                  ` (@${telegramAccount.telegram_username})`}{" "}
                from this account. You won&apos;t be able to sign in with
                Telegram or receive notifications until you link it again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleUnlink}>
                Unlink
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
