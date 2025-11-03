import { GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInWithGithub } from "@/app/actions/auth";
import { Card } from "@/components/ui/card";

export const OneTapAuth = () => {
  return (
    <form action={signInWithGithub}>
      <Card className="flex flex-col mt-4">
        <Button type="submit">
          <GithubIcon />
          <p>Sign up with GitHub</p>
        </Button>
      </Card>
    </form>
  );
};
