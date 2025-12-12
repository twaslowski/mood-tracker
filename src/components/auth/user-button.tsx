"use client";

import { UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";
import { CogIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function UserButton() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="User Menu">
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/*  /!*<DropdownMenuItem onClick={() => router.push("/auth/telegram/verify")}>*!/*/}
        {/*  /!*  <SendIcon />*!/*/}
        {/*  /!*  Link Telegram Account*!/*/}
        {/*  /!*</DropdownMenuItem>*!/*/}
        <DropdownMenuItem onClick={() => router.push("/protected/account")}>
          <CogIcon />
          Your Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
