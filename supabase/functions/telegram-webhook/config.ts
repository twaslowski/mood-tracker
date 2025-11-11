// @ts-expect-error cannot find module or type declarations
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// @ts-expect-error Deno not found, but available at runtime
export const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
// @ts-expect-error Deno not found, but available at runtime
export const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
// @ts-expect-error Deno not found, but available at runtime
export const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// @ts-expect-error Deno not found, but available at runtime
export const APP_URL = Deno.env.get("APP_URL")!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
