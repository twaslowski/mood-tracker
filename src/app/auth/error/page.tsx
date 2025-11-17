import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    message?: string;
    error?: string;
    error_code?: string;
    error_description?: string;
  }>;
}) {
  const params = await searchParams;

  const getErrorMessage = () => {
    if (params.message) {
      return decodeURIComponent(params.message);
    }

    if (params.error_description) {
      return params.error_description;
    }

    if (params.error) {
      return params.error;
    }

    return "An unspecified error occurred.";
  };

  const errorMessage = getErrorMessage();
  const errorCode = params.error_code;

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
                Sorry, something went wrong.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
              {errorCode && (
                <p className="text-xs text-muted-foreground mt-2">
                  Error code: {errorCode}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
