import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to your GradConnect account.",
};

type PageProps = {
  searchParams: Promise<{ password_reset?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const user = await getSession();
  if (user) redirect("/dashboard");

  const { password_reset } = await searchParams;
  const showResetFlash = password_reset === "success";

  return (
    <div>
      <div className="text-center">
        <h1 className="font-display text-display-lg text-foreground">
          Welcome back
        </h1>
        <p className="mt-3 text-body-sm text-text-dim">
          Log in to save opportunities and track your applications.
        </p>
      </div>

      {showResetFlash && (
        <div
          className="mt-6 border-l-2 border-success pl-6 py-3"
          role="status"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              className="size-5 shrink-0 text-success mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-body-sm font-medium text-foreground">
                Password updated
              </p>
              <p className="mt-0.5 text-caption text-text-dim">
                Log in with your new password.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10">
        <LoginForm />
      </div>

      <p className="mt-8 text-center text-body-sm text-text-dim">
        New to GradConnect?{" "}
        <Link
          href="/register"
          className="text-primary hover:text-primary-hover underline underline-offset-4 transition-colors"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}