import Image from "next/image";
import { CogIcon, RocketIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image
        src="/images/moody_logo.png"
        alt="mood tracker logo"
        width={150}
        height={60}
        className="mb-4"
      />
      <h1 className="text-6xl font-bold text-primary-500 text-center mb-2">
        moody
      </h1>
      <div className="text-xl text-primary-400 mb-8 text-center">
        <p>Track your mood. Understand your patterns.</p>
        <p>
          Understand <b>yourself</b>.
        </p>
      </div>
      <div className="justify-center flex space-x-2">
        <Link href="/auth/sign-up">
          <Button>
            <RocketIcon />
            <p>Sign Up</p>
          </Button>
        </Link>
        <Link href="/protected">
          <Button>
            <CogIcon />
            <p>Track</p>
          </Button>
        </Link>
      </div>
    </div>
  );
}
