"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { login } from "@/lib/api/endpoints/auth";
import { APIError } from "@/lib/api/errors";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { GoogleAuthButton } from "./google-auth-button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";

  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginInput) {
    setSubmitError(null);
    try {
      await login(data);
      router.replace(redirectTo);
      router.refresh();
    } catch (err) {
      if (APIError.isAPIError(err)) {
        if (err.status === 401) {
          setSubmitError("Email or password is incorrect.");
        } else if (err.status === 429) {
          setSubmitError("Too many attempts. Please wait a moment and try again.");
        } else {
          setSubmitError(err.message || "Something went wrong. Please try again.");
        }
      } else {
        setSubmitError("Network error. Check your connection and try again.");
      }
    }
  }

  return (
    <div>
      <GoogleAuthButton />

      <div className="my-6 flex items-center gap-3">
        <div className="bg-border h-px flex-1" />
        <span className="text-caption text-text-faint tracking-wide uppercase">or</span>
        <div className="bg-border h-px flex-1" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="text-body-sm text-foreground block font-medium">
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              autoComplete="email"
              className="border-border bg-background text-body-md placeholder:text-text-faint focus:border-ring focus:ring-ring/20 mt-1.5 w-full rounded-md border px-3 py-2.5 transition-colors focus:ring-2 focus:outline-none"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-caption text-destructive mt-1.5" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="password" className="text-body-sm text-foreground block font-medium">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-caption text-primary hover:text-primary-hover transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              {...register("password")}
              id="password"
              type="password"
              autoComplete="current-password"
              className="border-border bg-background text-body-md placeholder:text-text-faint focus:border-ring focus:ring-ring/20 mt-1.5 w-full rounded-md border px-3 py-2.5 transition-colors focus:ring-2 focus:outline-none"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-caption text-destructive mt-1.5" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {submitError && (
            <div
              className="border-destructive/30 bg-destructive/5 text-body-sm text-destructive rounded-md border px-4 py-3"
              role="alert"
            >
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-body-md text-primary-foreground hover:bg-primary-hover inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? "Signing in" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
