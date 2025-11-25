"use client";

import { UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="User Menu">
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      {/*<DropdownMenuContent align="end">*/}
      {/*  /!*<DropdownMenuItem onClick={() => router.push("/auth/telegram/verify")}>*!/*/}
      {/*  /!*  <SendIcon />*!/*/}
      {/*  /!*  Link Telegram Account*!/*/}
      {/*  /!*</DropdownMenuItem>*!/*/}
      {/*  <DropdownMenuItem onClick={() => router.push("/protected/settings")}>*/}
      {/*    <CogIcon />*/}
      {/*    Settings*/}
      {/*  </DropdownMenuItem>*/}
      {/*</DropdownMenuContent>*/}
    </DropdownMenu>
  );
}
