import { RocketIcon, Zap, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

const usps = [
  {
    id: "track-what-matters",
    icon: RocketIcon,
    title: "Track Only What Matters",
    description:
      "Choose your own metrics and skip the noise. Your tracking, your rules.",
  },
  {
    id: "track-in-seconds",
    icon: Zap,
    title: "Track in Seconds",
    description:
      "Log your day instantly. No friction, no forms. Just quick snapshots of what matters.",
  },
  {
    id: "own-your-data",
    icon: Lock,
    title: "Own Your Data",
    description:
      "Complete ownership and control. Your data stays yours, always.",
  },
];

export function USPSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl">
      {usps.map((usp) => {
        const Icon = usp.icon;
        return (
          <Card
            key={usp.id}
            className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow"
          >
            <div className="mb-3 p-3 bg-primary-500 rounded-full">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{usp.title}</h3>
            <p className="text-sm text-primary-400">{usp.description}</p>
          </Card>
        );
      })}
    </div>
  );
}
