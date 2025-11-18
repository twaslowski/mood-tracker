import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

export const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
export const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
export const APP_URL = Deno.env.get("APP_URL")!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
