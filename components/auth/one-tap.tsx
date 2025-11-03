import { GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export const OneTapAuth = () => {
  async function signInWithGithub() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    console.log(data, error)
    if (!error && data.url) {
      redirect(data.url);
    }
  }

  return (
    <Button onClick={signInWithGithub}>
      <GithubIcon />
      <p>Sign up with GitHub</p>
    </Button>
  );
};
