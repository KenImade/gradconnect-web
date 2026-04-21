"use client";

import { useState, useEffect } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { resendVerificationEmail } from "@/lib/api/endpoints/auth";
import { APIError } from "@/lib/api/errors";

const COOLDOWN_SECONDS = 60;

export function VerificationBanner({ email }: { email: string }) {
    const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);

    // Countdown tick
    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(id);
    }, [cooldown]);

    async function handleResend() {
        setState("sending");
        setErrorMessage(null);
        try {
            await resendVerificationEmail();
            setState("sent");
            setCooldown(COOLDOWN_SECONDS);
        } catch (err) {
            setState("error");
            if (APIError.isAPIError(err)) {
                if (err.status === 429) {
                    setErrorMessage("Please wait a few minutes before requesting another email.");
                    // Assume a longer cooldown in this case — backend is explicitly rate limiting.
                    setCooldown(COOLDOWN_SECONDS * 5);
                } else if (err.status === 409) {
                    setErrorMessage("Your email is already verified. Try refreshing the page.");
                } else {
                    setErrorMessage(err.message || "Couldn't send the email. Try again shortly.");
                }
            } else {
                setErrorMessage("Network error. Check your connection and try again.");
            }
        }
    }

    const isCoolingDown = cooldown > 0;
    const isSending = state === "sending";
    const isDisabled = isSending || isCoolingDown;

    return (
        <div className="border-l-2 border-warning pl-6 py-3">
            <div className="flex items-start gap-3">
                <Mail className="size-5 shrink-0 text-warning mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                    <p className="text-body-sm font-medium text-foreground">
                        Verify your email to unlock bookmarks, reviews, and reminders
                    </p>
                    <p className="mt-1 text-caption text-text-dim">
                        We sent a link to <span className="font-medium text-foreground">{email}</span>.
                        Click it to verify your account.
                    </p>

                    {/* Sent confirmation */}
                    {state === "sent" && (
                        <p
                            className="mt-3 inline-flex items-center gap-1.5 text-caption text-success"
                            role="status"
                        >
                            <CheckCircle2 className="size-3.5" aria-hidden="true" />
                            Verification email sent. Check your inbox.
                        </p>
                    )}

                    {/* Error */}
                    {state === "error" && errorMessage && (
                        <p className="mt-3 text-caption text-destructive" role="alert">
                            {errorMessage}
                        </p>
                    )}

                    {/* Action row */}
                    <div className="mt-3">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={isDisabled}
                            className="inline-flex items-center gap-1.5 text-caption text-primary hover:text-primary-hover underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline transition-colors"
                            aria-live="polite"
                        >
                            {isSending && <Loader2 className="size-3 animate-spin" />}
                            {isSending
                                ? "Sending"
                                : isCoolingDown
                                    ? `Resend in ${cooldown}s`
                                    : state === "sent" || state === "error"
                                        ? "Resend verification email"
                                        : "Resend verification email"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}