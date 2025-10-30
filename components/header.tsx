import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { AuthButton } from "@/components/auth/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export const Header = () => {
  return (
    <>
      <div className="fixed top-0 left-0 h-16 flex items-center pl-3">
        <Link href="/">
          <Button size="icon" aria-label="Home">
            <Home className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      <div className="fixed top-0 right-0 h-16 flex items-center">
        <div className="flex items-center gap-4">
          <AuthButton />
          <ThemeSwitcher />
        </div>
      </div>
    </>
  );
};
