import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
    title: "Forgot password",
    description: "Reset your GradConnect password.",
};

export default function ForgotPasswordPage() {
    return (
        <div>
            <div className="text-center">
                <h1 className="font-display text-display-lg text-foreground">
                    Forgot your password?
                </h1>
                <p className="mt-3 text-body-sm text-text-dim">
                    Enter your email and we&apos;ll send you a link to reset it.
                </p>
            </div>

            <div className="mt-10">
                <ForgotPasswordForm />
            </div>

            <p className="mt-8 text-center text-body-sm text-text-dim">
                Remember your password?{" "}
                <Link
                    href="/login"
                    className="text-primary hover:text-primary-hover underline underline-offset-4 transition-colors"
                >
                    Log in
                </Link>
            </p>
        </div>
    );
}