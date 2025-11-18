import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface VerifyCodeRequest {
  telegram_id: number;
  code: string;
  userId: string;
}

async function verifyCode(telegramId: number, code: string, userId: string) {
  const { data: verification, error: verifyError } = await serviceClient
    .from("verification_codes")
    .select("*")
    .eq("telegram_id", telegramId)
    .eq("code", code)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (verifyError || !verification) {
    console.warn("Verification error:", verifyError);
    return { error: "Invalid or expired verification code" };
  }

  // Check if already linked
  const { data: existing } = await serviceClient
    .from("telegram_accounts")
    .select("user_id")
    .eq("telegram_id", telegramId)
    .single();

  if (existing) {
    return { error: "This Telegram account is already linked" };
  }

  const { error: linkError } = await serviceClient
    .from("telegram_accounts")
    .insert({
      telegram_id: telegramId,
      user_id: userId,
      linked_at: new Date().toISOString(),
    });

  if (linkError) {
    console.error("Error linking account:", linkError);
    return { error: "Failed to link Telegram account" };
  }

  // Mark code as used
  await serviceClient
    .from("verification_codes")
    .update({ used: true })
    .eq("telegram_id", telegramId)
    .eq("code", code);

  return {
    success: true,
  };
}

// @ts-expect-error Deno not found, but available at runtime
Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body: VerifyCodeRequest = await req.json();
    const result = await verifyCode(body.telegram_id, body.code, body.userId);

    return new Response(JSON.stringify(result), {
      status: result.error ? 400 : 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
