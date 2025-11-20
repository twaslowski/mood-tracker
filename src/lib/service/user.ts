import { SupabaseClient } from "@supabase/supabase-js";

export const getUserId = async (supabase: SupabaseClient) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Authentication failed. Please log in again.");
  }
  return user.id;
};
