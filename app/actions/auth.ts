"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { instanceUrl } from "@/lib/utils";

export async function signInWithGithub() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${instanceUrl()}/auth/callback`,
    },
  });

  if (!error && data.url) {
    redirect(data.url);
  }
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${instanceUrl()}/auth/callback`,
    },
  });
  console.log(data, error);

  if (!error && data.url) {
    redirect(data.url);
  }
}
