import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface VerifyCodeRequest {
  telegram_id: number;
  code: string;
  email?: string; // Optional: for account creation
}

interface VerifyTokenRequest {
  token: string;
}

// Verify and link a new Telegram account
async function verifyCode(telegramId: number, code: string, email?: string) {
  // Check if code is valid and not expired
  const { data: verification, error: verifyError } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("telegram_id", telegramId)
    .eq("code", code)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (verifyError || !verification) {
    return { error: "Invalid or expired verification code" };
  }

  // Check if already linked
  const { data: existing } = await supabase
    .from("telegram_accounts")
    .select("user_id")
    .eq("telegram_id", telegramId)
    .single();

  if (existing) {
    return { error: "This Telegram account is already linked" };
  }

  // Create new user account
  const { data: user, error: userError } = await supabase.auth.admin.createUser(
    {
      email: email || `telegram_${telegramId}@placeholder.local`,
      email_confirm: true,
      user_metadata: {
        telegram_id: telegramId,
      },
    },
  );

  if (userError || !user.user) {
    console.error("Error creating user:", userError);
    return { error: "Failed to create user account" };
  }

  // Link Telegram account
  const { error: linkError } = await supabase.from("telegram_accounts").insert({
    telegram_id: telegramId,
    user_id: user.user.id,
    linked_at: new Date().toISOString(),
  });

  if (linkError) {
    console.error("Error linking account:", linkError);
    return { error: "Failed to link Telegram account" };
  }

  // Mark code as used
  await supabase
    .from("verification_codes")
    .update({ used: true })
    .eq("telegram_id", telegramId)
    .eq("code", code);

  // Generate session for immediate login
  const { data: session, error: sessionError } =
    await supabase.auth.admin.createSession({
      user_id: user.user.id,
    });

  if (sessionError || !session) {
    return { error: "Account created but failed to create session" };
  }

  return {
    success: true,
    user: user.user,
    session: session.session,
  };
}

// Verify magic link token and create session
async function verifyToken(token: string) {
  // Get valid token
  const { data: magicToken, error: tokenError } = await supabase
    .from("magic_tokens")
    .select("telegram_id")
    .eq("token", token)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (tokenError || !magicToken) {
    return { error: "Invalid or expired magic link" };
  }

  // Get linked user
  const { data: telegramAccount, error: accountError } = await supabase
    .from("telegram_accounts")
    .select("user_id")
    .eq("telegram_id", magicToken.telegram_id)
    .single();

  if (accountError || !telegramAccount) {
    return { error: "Telegram account not found or not linked" };
  }

  // Mark token as used
  await supabase.from("magic_tokens").update({ used: true }).eq("token", token);

  // Update last login
  await supabase
    .from("telegram_accounts")
    .update({ last_login_at: new Date().toISOString() })
    .eq("telegram_id", magicToken.telegram_id);

  // Create session
  const { data: session, error: sessionError } =
    await supabase.auth.admin.createSession({
      user_id: telegramAccount.user_id,
    });

  if (sessionError || !session) {
    return { error: "Failed to create session" };
  }

  return {
    success: true,
    session: session.session,
  };
}

Deno.serve(async (req) => {
  // Enable CORS for your web app
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "verify-code") {
      const body: VerifyCodeRequest = await req.json();
      const result = await verifyCode(body.telegram_id, body.code, body.email);

      return new Response(JSON.stringify(result), {
        status: result.error ? 400 : 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    if (action === "verify-token") {
      const body: VerifyTokenRequest = await req.json();
      const result = await verifyToken(body.token);

      return new Response(JSON.stringify(result), {
        status: result.error ? 400 : 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
