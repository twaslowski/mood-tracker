"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { instanceUrl } from "@/lib/utils";

export interface Provider {
  name: "github" | "google";
}

export async function signInWithProvider(provider: Provider) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider.name,
    options: {
      redirectTo: `${instanceUrl()}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/auth/error?message=${encodeURIComponent(error.message)}`);
  }

  if (data?.url) {
    redirect(data.url);
  }

  redirect("/auth/error?message=Unable to initiate authentication");
}
