"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, AlertTriangle } from "lucide-react";
import { deleteAccount } from "@/lib/api/endpoints/auth";
import { APIError } from "@/lib/api/errors";
import type { User } from "@/lib/api/endpoints/users.types";

type Props = {
  user: User;
};

type FormValues = {
  password: string;
  confirmation: string;
  reason: string;
};

export function DeleteAccountSection({ user }: Props) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEmailUser = user.auth_provider === "email";

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { password: "", confirmation: "", reason: "" },
  });

  const confirmation = watch("confirmation");
  const password = watch("password");

  // Manual gate: backend will validate too, but disabling the button
  // when the user clearly hasn't typed DELETE (or hasn't entered their
  // password if they're an email user) is the right UX.
  const canSubmit = confirmation === "DELETE" && (!isEmailUser || password.length > 0);

  async function onSubmit(data: FormValues) {
    setSubmitError(null);
    try {
      await deleteAccount({
        password: data.password,
        confirmation: data.confirmation,
        reason: data.reason.trim() || undefined,
      });
      // Account is now soft-deleted; session is cleared server-side.
      // Take the user back to a public page.
      router.replace("/");
      router.refresh();
    } catch (err) {
      if (APIError.isAPIError(err)) {
        if (err.status === 401) {
          setSubmitError("Password is incorrect.");
        } else if (err.status === 422) {
          setSubmitError(err.message || "Please check the confirmation and try again.");
        } else {
          setSubmitError(err.message || "Something went wrong. Please try again.");
        }
      } else {
        setSubmitError("Network error. Check your connection and try again.");
      }
    }
  }

  return (
    <section aria-labelledby="delete-heading">
      <h2 id="delete-heading" className="font-display text-display-sm text-foreground">
        Delete account
      </h2>
      <p className="text-body-md text-text-dim mt-3 max-w-prose">
        Permanently delete your GradConnect account and personal information. Your reviews will
        remain on the site (they&rsquo;re already shown anonymously). You can recover your account
        by signing in within 30 days of deletion.
      </p>

      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="border-destructive/40 bg-background text-body-md text-destructive hover:bg-destructive/5 mt-6 inline-flex items-center justify-center gap-2 rounded-md border px-5 py-2.5 font-medium transition-colors"
        >
          Delete my account
        </button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6">
          <div className="border-destructive/30 bg-destructive/5 max-w-md rounded-md border p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="text-destructive mt-0.5 size-5 shrink-0"
                aria-hidden="true"
              />
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-body-sm text-foreground font-medium">
                    This will delete your account.
                  </p>
                  <p className="text-caption text-text-dim mt-1">
                    You&rsquo;ll be signed out everywhere. Your profile, bookmarks, and application
                    tracking will be removed within 30 days. Sign in before then to recover.
                  </p>
                </div>

                {isEmailUser && (
                  <div>
                    <label
                      htmlFor="delete-password"
                      className="text-caption text-foreground block font-medium"
                    >
                      Confirm with your password
                    </label>
                    <input
                      {...register("password")}
                      id="delete-password"
                      type="password"
                      autoComplete="current-password"
                      className="border-border bg-background text-body-sm focus:border-ring focus:ring-ring/20 mt-1.5 w-full rounded-md border px-3 py-2 transition-colors focus:ring-2 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="delete-confirmation"
                    className="text-caption text-foreground block font-medium"
                  >
                    Type <span className="font-mono">DELETE</span> to confirm
                  </label>
                  <input
                    {...register("confirmation")}
                    id="delete-confirmation"
                    type="text"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    className="border-border bg-background text-body-sm focus:border-ring focus:ring-ring/20 mt-1.5 w-full rounded-md border px-3 py-2 font-mono transition-colors focus:ring-2 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="delete-reason"
                    className="text-caption text-foreground block font-medium"
                  >
                    Why are you leaving? <span className="text-text-faint">(optional)</span>
                  </label>
                  <textarea
                    {...register("reason")}
                    id="delete-reason"
                    rows={2}
                    className="border-border bg-background text-body-sm focus:border-ring focus:ring-ring/20 mt-1.5 w-full resize-none rounded-md border px-3 py-2 transition-colors focus:ring-2 focus:outline-none"
                  />
                </div>

                {submitError && (
                  <p className="text-caption text-destructive" role="alert">
                    {submitError}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="bg-destructive text-body-sm text-destructive-foreground hover:bg-destructive/90 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                    {isSubmitting ? "Deleting" : "Permanently delete account"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded(false);
                      setSubmitError(null);
                    }}
                    className="border-border bg-background text-body-sm text-foreground hover:bg-surface-subtle inline-flex items-center justify-center rounded-md border px-4 py-2 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
