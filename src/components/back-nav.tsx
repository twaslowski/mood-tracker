import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

export const BackNav = ({ href }: { href: string }) => {
  return (
    <div className="flex flex-col">
      <Link href={href} className="flex items-center gap-1">
        <Button variant="ghost">
          <ChevronLeft />
          Back
        </Button>
      </Link>
    </div>
  );
};
