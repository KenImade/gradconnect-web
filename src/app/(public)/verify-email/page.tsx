import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Clock, Info } from "lucide-react";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
    title: "Verify your email",
};

type PageProps = {
    searchParams: Promise<{ result?: string }>;
};

type ResultState = "success" | "invalid" | "expired" | "already_verified" | "error" | null;

function parseResult(raw: string | undefined): ResultState {
    if (raw === "success" || raw === "invalid" || raw === "expired"
        || raw === "already_verified" || raw === "error") {
        return raw;
    }
    return null;
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
    const { result: rawResult } = await searchParams;
    const result = parseResult(rawResult);
    const user = await getSession();

    // No result param — user navigated to /verify-email directly without a token flow.
    if (!result) {
        return (
            <div className="container mx-auto max-w-xl px-4 py-16 lg:py-24 text-center">
                <Info className="mx-auto size-10 text-text-faint" />
                <h1 className="mt-6 font-display text-display-lg text-foreground">Check your email</h1>
                <p className="mt-4 text-body-md text-text-dim">
                    We sent you a verification link. Click it to finish setting up your account.
                </p>
                {user && (
                    <p className="mt-8 text-body-sm text-text-dim">
                        Didn&apos;t get the email?{" "}
                        <Link
                            href="/dashboard"
                            className="text-primary hover:text-primary-hover underline underline-offset-4"
                        >
                            Go to your dashboard
                        </Link>{" "}
                        and click &quot;Resend verification email.&quot;
                    </p>
                )}
            </div>
        );
    }

    const config = (() => {
        switch (result) {
            case "success":
                return {
                    icon: CheckCircle2,
                    tone: "success" as const,
                    title: "Email verified",
                    body: "You can now bookmark opportunities, submit reviews, and receive deadline reminders.",
                    cta: { href: user ? "/dashboard" : "/login", label: user ? "Go to dashboard" : "Log in" },
                };
            case "already_verified":
                return {
                    icon: CheckCircle2,
                    tone: "success" as const,
                    title: "Already verified",
                    body: "Your email was already verified. No further action needed.",
                    cta: { href: user ? "/dashboard" : "/login", label: user ? "Go to dashboard" : "Log in" },
                };
            case "expired":
                return {
                    icon: Clock,
                    tone: "warning" as const,
                    title: "Link expired",
                    body: "This verification link has expired. Sign in to your account and request a new one.",
                    cta: { href: "/login", label: "Log in" },
                };
            case "invalid":
                return {
                    icon: AlertCircle,
                    tone: "error" as const,
                    title: "Link is invalid",
                    body: "This link is no longer valid. It may have already been used or been malformed. Sign in and request a new one.",
                    cta: { href: "/login", label: "Log in" },
                };
            case "error":
            default:
                return {
                    icon: AlertCircle,
                    tone: "error" as const,
                    title: "Something went wrong",
                    body: "We couldn't verify your email right now. Try again shortly, or log in and resend the link.",
                    cta: { href: "/login", label: "Log in" },
                };
        }
    })();

    const toneStyles = {
        success: "text-success",
        warning: "text-warning",
        error: "text-destructive",
    };

    const Icon = config.icon;

    return (
        <div className="container mx-auto max-w-xl px-4 py-16 lg:py-24 text-center">
            <Icon className={`mx-auto size-10 ${toneStyles[config.tone]}`} />
            <h1 className="mt-6 font-display text-display-lg text-foreground">{config.title}</h1>
            <p className="mt-4 text-body-md text-text-dim max-w-prose mx-auto">{config.body}</p>
            <div className="mt-10">
                <Link
                    href={config.cta.href}
                    className="inline-flex items-center rounded-md bg-primary px-6 py-2.5 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                >
                    {config.cta.label}
                </Link>
            </div>
        </div>
    );
}