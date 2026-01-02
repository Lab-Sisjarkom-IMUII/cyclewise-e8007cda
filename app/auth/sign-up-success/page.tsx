import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-b from-pink-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-green-600 dark:text-green-400">Check Your Email!</CardTitle>
            <CardDescription>
              Account created successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We've sent a confirmation email to your address. Please click the link in the email to verify your account before logging in.
            </p>
            <Link href="/auth/login">
              <Button className="w-full bg-pink-600 hover:bg-pink-700">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
