"use client";

import Image from "next/image";
import { InfoIcon, RocketIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { USPSection } from "@/components/usp-section";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // The below code is currently used to handle the auth callback from Supabase when using OAuth providers
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

        console.error(error);

        if (!error) {
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
      <div className="flex h-full items-center justify-center">
        <DotLoader loading={true} size={32} color="currentColor" />
        <span className={`ml-3`}>Loading</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      {/* Header with title */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="bg-white/50 rounded-full">
          <Image
            src="/images/pulselog.png"
            alt="pulselog logo"
            width={150}
            height={60}
          />
        </div>
        <div>
          <h1 className="text-6xl font-bold text-primary-500">Pulselog</h1>
          <div className="text-xl text-primary-400 max-w-2xl">
            <p>Track your life your way.</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-8">
          <Link href="/protected">
            <Button size="lg">
              <RocketIcon />
              <p>Get Started</p>
            </Button>
          </Link>
          <Link href={"/about"}>
            <Button size="lg" variant="outline">
              <InfoIcon />
              <p>Learn More</p>
            </Button>
          </Link>
        </div>
      </div>

      {/* CTA Buttons */}

      <USPSection />
    </div>
  );
}
