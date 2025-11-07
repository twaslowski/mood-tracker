import React from "react";
import { BarChart3, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SuccessToast from "@/components/entry/success-toast";
import Image from "next/image";

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ success: string | undefined }>;
}) {
  const supabase = await createClient();
  const displaySuccess = (await searchParams).success === "true";

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-y-6 md:gap-y-8 px-4 md:px-8 py-4">
      {displaySuccess && <SuccessToast message="Entry created successfully!" />}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-x-4 items-center">
        <Image
          src="/images/moody-greeting-no-text.png"
          alt="moody is happy to see you!"
          height={150}
          width={200}
          className="w-32 h-24 sm:w-48 sm:h-36 md:w-[200px] md:h-[150px]"
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-2">
            Welcome back!
          </h1>
        </div>
      </div>
      <div className="w-full max-w-4xl">
        {/* Primary Action */}
        <div className="mb-4 md:mb-6">
          <Link href="/protected/new-entry">
            <Button className="w-full px-4 py-8 sm:px-6 sm:py-12 md:py-16 flex-col rounded-2xl">
              <div className="flex items-center justify-center gap-3 md:gap-4">
                <div className="icon">
                  <Plus className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                </div>
                <span className="text-xl sm:text-2xl md:text-3xl font-semibold">
                  Create New Entry
                </span>
              </div>

              <p className="text-sm sm:text-base md:text-lg mt-2">
                Log your mood, sleep, and other metrics
              </p>
            </Button>
          </Link>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Link href="/protected/settings">
            <Button className="w-full px-4 py-8 sm:px-6 sm:py-10 md:py-12 text-left rounded-2xl">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="icon flex-shrink-0">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 md:mb-2">
                    Manage Metrics
                  </h3>
                  <p className="text-sm sm:text-base">
                    Create and configure the metrics you want to track
                  </p>
                </div>
              </div>
            </Button>
          </Link>

          <Link href="/protected/insights">
            <Button className="w-full px-4 py-8 sm:px-6 sm:py-10 md:py-12 text-left rounded-2xl">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="icon flex-shrink-0">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 md:mb-2">
                    View Insights
                  </h3>
                  <p className="text-sm sm:text-base">
                    Explore your data with interactive graphs and charts
                  </p>
                </div>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
