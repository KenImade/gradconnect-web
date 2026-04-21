import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
    title: "Reset password",
};

type PageProps = {
    searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
    const { token } = await searchParams;

    // No token in the URL? Someone visited directly. Send to forgot-password.
    if (!token || typeof token !== "string") {
        redirect("/forgot-password");
    }

    return (
        <div>
            <div className="text-center">
                <h1 className="font-display text-display-lg text-foreground">
                    Reset your password
                </h1>
                <p className="mt-3 text-body-sm text-text-dim">
                    Choose a new password. You&apos;ll need to log in again after this.
                </p>
            </div>

            <div className="mt-10">
                <ResetPasswordForm token={token} />
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