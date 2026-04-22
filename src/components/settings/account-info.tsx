import { CheckCircle2, AlertCircle, Mail } from "lucide-react";
import type { User } from "@/lib/api/endpoints/users.types";

export function AccountInfo({ user }: { user: User }) {
    const memberSince = new Date(user.created_at).toLocaleDateString("en-NG", {
        month: "long",
        year: "numeric",
    });

    const authProviderLabel =
        user.auth_provider === "google" ? "Google" : "Email and password";

    return (
        <section>
            <h2 className="font-display text-heading-lg text-foreground">Account</h2>
            <p className="mt-1 text-body-sm text-text-dim">
                Account details, read-only. To change your email, contact support.
            </p>

            <dl className="mt-6 space-y-5 border-l-2 border-border pl-6">
                <div>
                    <dt className="text-caption uppercase tracking-wide text-text-faint">
                        Email
                    </dt>
                    <dd className="mt-0.5 flex flex-wrap items-center gap-2 text-body-md text-foreground">
                        <span className="inline-flex items-center gap-1.5">
                            <Mail className="size-4 text-text-faint" />
                            {user.email}
                        </span>
                        {user.email_verified ? (
                            <span className="inline-flex items-center gap-1 text-caption text-success">
                                <CheckCircle2 className="size-3.5" />
                                Verified
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-caption text-warning">
                                <AlertCircle className="size-3.5" />
                                Unverified
                            </span>
                        )}
                    </dd>
                </div>

                <div>
                    <dt className="text-caption uppercase tracking-wide text-text-faint">
                        Sign-in method
                    </dt>
                    <dd className="mt-0.5 text-body-md text-foreground">
                        {authProviderLabel}
                    </dd>
                </div>

                <div>
                    <dt className="text-caption uppercase tracking-wide text-text-faint">
                        Member since
                    </dt>
                    <dd className="mt-0.5 text-body-md text-foreground italic">
                        {memberSince}
                    </dd>
                </div>
            </dl>

            {user.auth_provider === "email" && (
                <div className="mt-8 border-l-2 border-warning pl-6 py-3">
                    <p className="text-body-sm text-foreground">
                        Want to change your password?
                    </p>
                    <p className="mt-1 text-caption text-text-dim">
                        Use the{" "}
                        <a
                            href="/forgot-password"
                            className="text-primary hover:text-primary-hover underline underline-offset-4"
                        >
                            forgot-password flow
                        </a>{" "}
                        — an in-app password change is coming in a future update.
                    </p>
                </div>
            )
            }
        </section >
    );
}