import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="err flex flex-col h-full items-center justify-center gap-6">
      <Image
        src="/images/moody-confused.png"
        alt="sad moody"
        height={256}
        width={256}
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            The page you are looking for does not exist.
          </CardTitle>
          <div className="flex items-center justify-center mt-2 text-sm">
            <Link href="/" className="underline">
              Go back home
            </Link>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
