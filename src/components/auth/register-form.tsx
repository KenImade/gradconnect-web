"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { register as registerApi } from "@/lib/api/endpoints/auth";
import { APIError } from "@/lib/api/errors";
import { registerSchema, type RegisterInput } from "@/lib/validation/auth";
import { GoogleAuthButton } from "./google-auth-button";

export function RegisterForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirm: "",
    },
  });

  async function onSubmit(data: RegisterInput) {
    setSubmitError(null);
    try {
      await registerApi({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      });
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      if (APIError.isAPIError(err)) {
        if (err.status === 422) {
          const emailErr = err.details?.find((d) => d.field === "email");
          if (emailErr) {
            setSubmitError(
              emailErr.message.toLowerCase().includes("already")
                ? "An account with this email already exists. Try logging in instead."
                : emailErr.message,
            );
            return;
          }
          setSubmitError(err.message || "Please check your details and try again.");
        } else if (err.status === 409) {
          setSubmitError("An account with this email already exists. Try logging in instead.");
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first_name"
                className="text-body-sm text-foreground block font-medium"
              >
                First name
              </label>
              <input
                {...register("first_name")}
                id="first_name"
                type="text"
                autoComplete="given-name"
                className="border-border bg-background text-body-md placeholder:text-text-faint focus:border-ring focus:ring-ring/20 mt-1.5 w-full rounded-md border px-3 py-2.5 transition-colors focus:ring-2 focus:outline-none"
                aria-invalid={!!errors.first_name}
              />
              {errors.first_name && (
                <p className="text-caption text-destructive mt-1.5" role="alert">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="last_name" className="text-body-sm text-foreground block font-medium">
                Last name
              </label>
              <input
                {...register("last_name")}
                id="last_name"
                type="text"
                autoComplete="family-name"
                className="border-border bg-background text-body-md placeholder:text-text-faint focus:border-ring focus:ring-ring/20 mt-1.5 w-full rounded-md border px-3 py-2.5 transition-colors focus:ring-2 focus:outline-none"
                aria-invalid={!!errors.last_name}
              />
              {errors.last_name && (
                <p className="text-caption text-destructive mt-1.5" role="alert">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

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
            />
            {errors.email && (
              <p className="text-caption text-destructive mt-1.5" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-body-sm text-foreground block font-medium">
              Password
            </label>
            <input
              {...register("password")}
              id="password"
              type="password"
              autoComplete="new-password"
              className="border-border bg-background text-body-md placeholder:text-text-faint focus:border-ring focus:ring-ring/20 mt-1.5 w-full rounded-md border px-3 py-2.5 transition-colors focus:ring-2 focus:outline-none"
              aria-invalid={!!errors.password}
            />
            {errors.password ? (
              <p className="text-caption text-destructive mt-1.5" role="alert">
                {errors.password.message}
              </p>
            ) : (
              <p className="text-caption text-text-faint mt-1.5">At least 8 characters.</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password_confirm"
              className="text-body-sm text-foreground block font-medium"
            >
              Confirm password
            </label>
            <input
              {...register("password_confirm")}
              id="password_confirm"
              type="password"
              autoComplete="new-password"
              className="border-border bg-background text-body-md placeholder:text-text-faint focus:border-ring focus:ring-ring/20 mt-1.5 w-full rounded-md border px-3 py-2.5 transition-colors focus:ring-2 focus:outline-none"
              aria-invalid={!!errors.password_confirm}
            />
            {errors.password_confirm && (
              <p className="text-caption text-destructive mt-1.5" role="alert">
                {errors.password_confirm.message}
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
            {isSubmitting ? "Creating account" : "Create account"}
          </button>

          <p className="text-caption text-text-faint text-center">
            By creating an account, you agree to our{" "}
            <a
              href="/terms"
              className="text-foreground hover:text-primary underline underline-offset-2 transition-colors"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-foreground hover:text-primary underline underline-offset-2 transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );
}
