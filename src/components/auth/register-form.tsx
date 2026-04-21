"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { register as registerApi } from "@/lib/api/endpoints/auth";
import { APIError } from "@/lib/api/errors";
import { registerSchema, type RegisterInput } from "@/lib/validation/auth";

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
                // Treat 422 with an email field error as a duplicate-email case.
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
                    setSubmitError(
                        "An account with this email already exists. Try logging in instead.",
                    );
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="first_name" className="block text-body-sm font-medium text-foreground">
                            First name
                        </label>
                        <input
                            {...register("first_name")}
                            id="first_name"
                            type="text"
                            autoComplete="given-name"
                            autoFocus
                            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                            aria-invalid={!!errors.first_name}
                        />
                        {errors.first_name && (
                            <p className="mt-1.5 text-caption text-destructive" role="alert">
                                {errors.first_name.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="last_name" className="block text-body-sm font-medium text-foreground">
                            Last name
                        </label>
                        <input
                            {...register("last_name")}
                            id="last_name"
                            type="text"
                            autoComplete="family-name"
                            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                            aria-invalid={!!errors.last_name}
                        />
                        {errors.last_name && (
                            <p className="mt-1.5 text-caption text-destructive" role="alert">
                                {errors.last_name.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-body-sm font-medium text-foreground">
                        Email
                    </label>
                    <input
                        {...register("email")}
                        id="email"
                        type="email"
                        autoComplete="email"
                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                        aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-caption text-destructive" role="alert">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-body-sm font-medium text-foreground">
                        Password
                    </label>
                    <input
                        {...register("password")}
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                        aria-invalid={!!errors.password}
                    />
                    {errors.password ? (
                        <p className="mt-1.5 text-caption text-destructive" role="alert">
                            {errors.password.message}
                        </p>
                    ) : (
                        <p className="mt-1.5 text-caption text-text-faint">At least 8 characters.</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password_confirm" className="block text-body-sm font-medium text-foreground">
                        Confirm password
                    </label>
                    <input
                        {...register("password_confirm")}
                        id="password_confirm"
                        type="password"
                        autoComplete="new-password"
                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                        aria-invalid={!!errors.password_confirm}
                    />
                    {errors.password_confirm && (
                        <p className="mt-1.5 text-caption text-destructive" role="alert">
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
                    {isSubmitting ? "Creating account" : "Create account"}
                </button>

                <p className="text-center text-caption text-text-faint">
                    By creating an account, you agree to our{" "}
                    <a href="/terms" className="text-foreground hover:text-primary transition-colors underline underline-offset-2">
                        Terms
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-foreground hover:text-primary transition-colors underline underline-offset-2">
                        Privacy Policy
                    </a>
                    .
                </p>
            </div>
        </form>
    );
}