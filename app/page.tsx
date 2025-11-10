"use client";

import Image from "next/image";
import { RocketIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check for hash fragments (implicit flow)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken) {
        // Set the session from the hash fragments
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

        if (!error) {
          // Clear the hash from URL
          window.history.replaceState(null, "", window.location.pathname);
          router.push("/protected");
          return;
        }
      }

      // Check if user is already signed in
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        router.push("/protected");
      } else {
        setIsLoading(false);
      }
    };

    void handleAuthCallback();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push("/protected");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-primary-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image
        src="/images/moody-logo.png"
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
        <Link href="/protected">
          <Button size="lg">
            <RocketIcon />
            <p>Get Started</p>
          </Button>
        </Link>
      </div>
    </div>
  );
}
