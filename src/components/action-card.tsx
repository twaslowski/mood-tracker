import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconSize?: "sm" | "lg";
  variant?: "primary" | "secondary";
}

export const ActionCard = ({
  href,
  title,
  description,
  icon: Icon,
  iconSize = "sm",
  variant = "secondary",
}: ActionCardProps) => {
  const iconClasses =
    iconSize === "lg" ? "w-8 h-8 sm:w-12 sm:h-12" : "w-6 h-6 sm:w-8 sm:h-8";

  const titleClasses =
    variant === "primary"
      ? "text-xl sm:text-2xl md:text-3xl font-semibold"
      : "text-lg sm:text-xl font-semibold mb-1 sm:mb-2";

  const descriptionClasses =
    variant === "primary"
      ? "text-sm sm:text-base line-clamp-2 break-words overflow-hidden md:text-lg"
      : "text-sm sm:text-base line-clamp-2 break-words overflow-hidden";

  return (
    <Link href={href}>
      <Button className="w-full h-24 px-4 sm:px-6 py-4 sm:py-6 text-left justify-start rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 sm:gap-4 h-full min-w-0">
          <div className="icon flex-shrink-0">
            <Icon className={iconClasses} />
          </div>
          <div className="min-w-0 flex-1 flex flex-col justify-center overflow-hidden">
            <h3 className={titleClasses}>{title}</h3>
            <p className={`${descriptionClasses} whitespace-normal`}>
              {description}
            </p>
          </div>
        </div>
      </Button>
    </Link>
  );
};
