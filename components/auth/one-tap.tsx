import { Button } from "@/components/ui/button";
import { signInWithGithub, signInWithGoogle } from "@/app/actions/auth";
import Image from "next/image";

export const OneTapAuth = () => {
  return (
    <div className="flex flex-col mt-4 gap-2">
      <form action={signInWithGithub}>
        <Button type="submit" className="w-full gap-2">
          <Image
            src="/logos/octocat.svg"
            width={16}
            height={16}
            alt="octocat icon"
          />
          <p>Sign up with GitHub</p>
        </Button>
      </form>

      <form action={signInWithGoogle}>
        <Button type="submit" className="w-full gap-2">
          <Image
            src="/logos/google.svg"
            width={16}
            height={16}
            alt="google icon"
          />
          <p>Sign up with Google</p>
        </Button>
      </form>
    </div>
  );
};
