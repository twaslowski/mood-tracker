"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center justify-center gap-6">
          <Image
            src="/images/moody-sad.png"
            alt="sad moody"
            height={128}
            width={128}
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Sorry, something went wrong :(
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
