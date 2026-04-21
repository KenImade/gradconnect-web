import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to your GradConnect account.",
};

export default async function LoginPage() {
  // Already signed in? Skip the form.
  const user = await getSession();
  if (user) {
    redirect("/dashboard");
  }

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