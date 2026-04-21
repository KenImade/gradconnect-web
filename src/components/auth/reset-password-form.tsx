"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { resetPassword } from "@/lib/api/endpoints/auth";
import { APIError } from "@/lib/api/errors";
import {
    resetPasswordSchema,
    type ResetPasswordInput,
} from "@/lib/validation/auth";

export function ResetPasswordForm({ token }: { token: string }) {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [invalidToken, setInvalidToken] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { new_password: "", password_confirm: "" },
    });

    async function onSubmit(data: ResetPasswordInput) {
        setSubmitError(null);
        try {
            await resetPassword({
                token,
                new_password: data.new_password,
            });
            // Backend revokes all sessions on reset, so user must log in fresh.
            router.replace("/login?password_reset=success");
            router.refresh();
        } catch (err) {
            if (APIError.isAPIError(err)) {
                if (err.status === 400 || err.status === 404) {
                    setInvalidToken(true);
                } else if (err.status === 422) {
                    // Could be a token validation error OR a password validation error.
                    const tokenErr = err.details?.find((d) => d.field === "token");
                    if (tokenErr) {
                        setInvalidToken(true);
                    } else {
                        setSubmitError(
                            err.message || "Please check your details and try again.",
                        );
                    }
                } else if (err.status === 429) {
                    setSubmitError(
                        "Too many attempts. Please wait a moment and try again.",
                    );
                } else {
                    setSubmitError(
                        err.message || "Something went wrong. Please try again.",
                    );
                }
            } else {
                setSubmitError(
                    "Network error. Check your connection and try again.",
                );
            }
        }
    }

    if (invalidToken) {
        return (
            <div className="border-l-2 border-destructive pl-6 py-4" role="alert">
                <p className="font-display text-heading-md text-foreground">
                    This link is no longer valid
                </p>
                <p className="mt-2 text-body-sm text-text-dim">
                    Password reset links expire after one hour and can only be used once.
                    Request a new one and try again.
                </p>
                <div className="mt-4">
                    <a
                        href="/forgot-password"
                        className="inline-flex items-center rounded-md bg-primary px-5 py-2 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                    >
                        Request new link
                    </a>
                </div>
            </div >
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-5">
                <div>
                    <label
                        htmlFor="new_password"
                        className="block text-body-sm font-medium text-foreground"
                    >
                        New password
                    </label>
                    <input
                        {...register("new_password")}
                        id="new_password"
                        type="password"
                        autoComplete="new-password"
                        autoFocus
                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                        aria-invalid={!!errors.new_password}
                        aria-describedby={
                            errors.new_password ? "new_password-error" : "new_password-hint"
                        }
                    />
                    {errors.new_password ? (
                        <p
                            id="new_password-error"
                            className="mt-1.5 text-caption text-destructive"
                            role="alert"
                        >
                            {errors.new_password.message}
                        </p>
                    ) : (
                        <p id="new_password-hint" className="mt-1.5 text-caption text-text-faint">
                            At least 8 characters.
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="password_confirm"
                        className="block text-body-sm font-medium text-foreground"
                    >
                        Confirm new password
                    </label>
                    <input
                        {...register("password_confirm")}
                        id="password_confirm"
                        type="password"
                        autoComplete="new-password"
                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                        aria-invalid={!!errors.password_confirm}
                        aria-describedby={
                            errors.password_confirm ? "password_confirm-error" : undefined
                        }
                    />
                    {errors.password_confirm && (
                        <p
                            id="password_confirm-error"
                            className="mt-1.5 text-caption text-destructive"
                            role="alert"
                        >
                            {errors.password_confirm.message}
                        </p>
                    )}
                </div>

                {submitError && (
                    <div
                        className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-body-sm text-destructive"
                        role="alert"
                    >
                        {submitError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-body-md font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                    {isSubmitting ? "Updating password" : "Update password"}
                </button>
            </div>
        </form>
    );
}