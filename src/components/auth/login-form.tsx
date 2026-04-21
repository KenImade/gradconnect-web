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

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    console.log("[LoginForm] redirect param:", searchParams.get("redirect"));
    console.log("[LoginForm] all params:", searchParams.toString());
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
            console.log("[LoginForm] about to redirect to:", redirectTo);
            router.replace(redirectTo);
            console.log("[LoginForm] replace called, about to refresh");
            router.refresh();
            console.log("[LoginForm] refresh called");
        } catch (err) {
            if (APIError.isAPIError(err)) {
                if (err.status === 401) {
                    setSubmitError("Email or password is incorrect.");
                } else if (err.status === 429) {
                    setSubmitError(
                        "Too many attempts. Please wait a moment and try again.",
                    );
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

                <div>
                    <div className="flex items-baseline justify-between">
                        <label
                            htmlFor="password"
                            className="block text-body-sm font-medium text-foreground"
                        >
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
                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? "password-error" : undefined}
                    />
                    {errors.password && (
                        <p
                            id="password-error"
                            className="mt-1.5 text-caption text-destructive"
                            role="alert"
                        >
                            {errors.password.message}
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
                    {isSubmitting ? "Signing in" : "Sign in"}
                </button>
            </div>
        </form>
    );
}