"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { changePassword } from "@/lib/api/endpoints/auth";
import { APIError } from "@/lib/api/errors";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validation/auth";
import type { User } from "@/lib/api/endpoints/users.types";

type Props = {
  user: User;
};

export function ChangePasswordSection({ user }: Props) {
  // Google-authenticated users don't have a GradConnect password to change.
  // Surface this honestly rather than hiding the section entirely; users
  // who don't know how they signed up would otherwise wonder where the
  // password change option is.
  if (user.auth_provider !== "email") {
    return (
      <section aria-labelledby="password-heading">
        <h2 id="password-heading" className="font-display text-display-sm text-foreground">
          Password
        </h2>
        <p className="text-body-md text-text-dim mt-3 max-w-prose">
          You signed in with Google, so GradConnect doesn&apos;t store a password for your account.
          Manage your password through your Google account settings.
        </p>
      </section>
    );
  }

  return <ChangePasswordForm />;
}

function ChangePasswordForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirm: "",
    },
  });

  async function onSubmit(data: ChangePasswordInput) {
    setSubmitError(null);
    setSuccess(false);
    try {
      await changePassword(data);
      setSuccess(true);
      reset();
    } catch (err) {
      if (APIError.isAPIError(err)) {
        if (err.status === 401) {
          setSubmitError("Current password is incorrect.");
        } else if (err.status === 409) {
          setSubmitError("This account doesn't use a GradConnect password.");
        } else if (err.status === 429) {
          setSubmitError("Too many attempts. Please wait a moment and try again.");
        } else if (err.status === 422) {
          setSubmitError(err.message || "Please check your password and try again.");
        } else {
          setSubmitError(err.message || "Something went wrong. Please try again.");
        }
      } else {
        setSubmitError("Network error. Check your connection and try again.");
      }
    }
  }

  return (
    <section aria-labelledby="password-heading">
      <h2 id="password-heading" className="font-display text-display-sm text-foreground">
        Password
      </h2>
      <p className="text-body-md text-text-dim mt-3 max-w-prose">
        Change the password you use to sign in. Other devices will be signed out as a precaution.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8">
        <div className="max-w-md space-y-5">
          <div>
            <label
              htmlFor="current_password"
              className="text-body-sm text-foreground block font-medium"
            >
              Current password
            </label>
            <input
              {...register("current_password")}
              id="current_password"
              type="password"
              autoComplete="current-password"
              className="border-border bg-background text-body-md placeholder:text-text-faint focus:border-ring focus:ring-ring/20 mt-1.5 w-full rounded-md border px-3 py-2.5 transition-colors focus:ring-2 focus:outline-none"
              aria-invalid={!!errors.current_password}
              aria-describedby={errors.current_password ? "current-password-error" : undefined}
            />
            {errors.current_password && (
              <p
                id="current-password-error"
                className="text-caption text-destructive mt-1.5"
                role="alert"
              >
                {errors.current_password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="new_password"
              className="text-body-sm text-foreground block font-medium"
            >
              New password
            </label>
            <input
              {...register("new_password")}
              id="new_password"
              type="password"
              autoComplete="new-password"
              className="border-border bg-background text-body-md placeholder:text-text-faint focus:border-ring focus:ring-ring/20 mt-1.5 w-full rounded-md border px-3 py-2.5 transition-colors focus:ring-2 focus:outline-none"
              aria-invalid={!!errors.new_password}
              aria-describedby={errors.new_password ? "new-password-error" : undefined}
            />
            {errors.new_password ? (
              <p
                id="new-password-error"
                className="text-caption text-destructive mt-1.5"
                role="alert"
              >
                {errors.new_password.message}
              </p>
            ) : (
              <p className="text-caption text-text-faint mt-1.5">At least 8 characters.</p>
            )}
          </div>

          <div>
            <label
              htmlFor="new_password_confirm"
              className="text-body-sm text-foreground block font-medium"
            >
              Confirm new password
            </label>
            <input
              {...register("new_password_confirm")}
              id="new_password_confirm"
              type="password"
              autoComplete="new-password"
              className="border-border bg-background text-body-md placeholder:text-text-faint focus:border-ring focus:ring-ring/20 mt-1.5 w-full rounded-md border px-3 py-2.5 transition-colors focus:ring-2 focus:outline-none"
              aria-invalid={!!errors.new_password_confirm}
              aria-describedby={
                errors.new_password_confirm ? "new-password-confirm-error" : undefined
              }
            />
            {errors.new_password_confirm && (
              <p
                id="new-password-confirm-error"
                className="text-caption text-destructive mt-1.5"
                role="alert"
              >
                {errors.new_password_confirm.message}
              </p>
            )}
          </div>

          {success && (
            <div
              className="border-success/30 bg-success/5 rounded-md border px-4 py-3"
              role="status"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-success mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-body-sm text-foreground font-medium">Password updated</p>
                  <p className="text-caption text-text-dim mt-0.5">
                    Other devices have been signed out. We&apos;ve sent you a confirmation email.
                  </p>
                </div>
              </div>
            </div>
          )}

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
            className="bg-primary text-body-md text-primary-foreground hover:bg-primary-hover inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? "Updating" : "Update password"}
          </button>
        </div>
      </form>
    </section>
  );
}
