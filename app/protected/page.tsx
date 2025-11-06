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
    <div className="flex flex-col items-center justify-center h-full gap-y-8 px-8">
      {displaySuccess && <SuccessToast message="Entry created successfully!" />}
      <div className="flex gap-x-4">
        <Image
          src="/images/moody-greeting-no-text.png"
          alt="moody is happy to see you!"
          height={150}
          width={200}
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-6xl font-bold text-center mb-2">Welcome back!</h1>
        </div>
      </div>
      <div className="max-w-4xl">
        {/* Primary Action */}
        <div className="mb-4">
          <Link href="/protected/new-entry">
            <Button className="w-full px-6 py-16 flex-col rounded-2xl">
              <div className="flex items-center justify-center gap-4">
                <div className="icon">
                  <Plus className="w-12 h-12" />
                </div>
                <span className="text-3xl font-semibold">Create New Entry</span>
              </div>

              <p className="text-lg">Log your mood, sleep, and other metrics</p>
            </Button>
          </Link>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/protected/settings">
            <Button className="px-6 py-12 text-left rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="icon">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Manage Metrics</h3>
                  <p>Create and configure the metrics you want to track</p>
                </div>
              </div>
            </Button>
          </Link>

          <Link href="/protected/insights">
            <Button className="px-6 py-12 text-left rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="icon">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">View Insights</h3>
                  <p>Explore your data with interactive graphs and charts</p>
                </div>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
