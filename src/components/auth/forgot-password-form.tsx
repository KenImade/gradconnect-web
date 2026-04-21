"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { forgotPassword } from "@/lib/api/endpoints/auth";
import { APIError } from "@/lib/api/errors";
import {
    forgotPasswordSchema,
    type ForgotPasswordInput,
} from "@/lib/validation/auth";

export function ForgotPasswordForm() {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    async function onSubmit(data: ForgotPasswordInput) {
        setSubmitError(null);
        try {
            await forgotPassword({ email: data.email });
            setSubmittedEmail(data.email);
        } catch (err) {
            if (APIError.isAPIError(err)) {
                if (err.status === 429) {
                    setSubmitError(
                        "Too many requests. Please wait a moment and try again.",
                    );
                } else {
                    setSubmitError(
                        err.message || "Couldn't send the email. Try again shortly.",
                    );
                }
            } else {
                setSubmitError(
                    "Network error. Check your connection and try again.",
                );
            }
        }
    }

    // Success state — show confirmation, hide the form.
    if (submittedEmail) {
        return (
            <div className="border-l-2 border-success pl-6 py-4" role="status">
                <div className="flex items-start gap-3">
                    <CheckCircle2
                        className="size-5 shrink-0 text-success mt-0.5"
                        aria-hidden="true"
                    />
                    <div>
                        <p className="font-display text-heading-md text-foreground">
                            Check your email
                        </p>
                        <p className="mt-2 text-body-sm text-text-dim">
                            If an account exists for{" "}
                            <span className="font-medium text-foreground">
                                {submittedEmail}
                            </span>
                            , we&apos;ve sent a reset link. It expires in one hour.
                        </p>
                        <p className="mt-3 text-caption text-text-faint italic">
                            Didn&apos;t get the email? Check your spam folder, or{" "}
                            <button
                                type="button"
                                onClick={() => setSubmittedEmail(null)}
                                className="text-primary hover:text-primary-hover underline underline-offset-4"
                            >
                                try a different email
                            </button>
                            .
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-5">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-body-sm font-medium text-foreground"
                    >
                        Email
                    </label>
                    <input
                        {...register("email")}
                        id="email"
                        type="email"
                        autoComplete="email"
                        autoFocus
                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                        <p
                            id="email-error"
                            className="mt-1.5 text-caption text-destructive"
                            role="alert"
                        >
                            {errors.email.message}
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
                    {isSubmitting ? "Sending" : "Send reset link"}
                </button>
            </div>
        </form>
    );
}