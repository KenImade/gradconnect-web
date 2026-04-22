import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { listApplications } from "@/lib/api/endpoints/applications.server";
import { TrackerPageClient } from "@/components/application/tracker-page-client";

export const metadata: Metadata = {
    title: "Application tracker",
    description: "Track your graduate programme applications from interested to offer.",
};

export default async function TrackerPage() {
    const user = await requireSession();

    if (!user.email_verified) {
        return (
            <div className="container mx-auto max-w-3xl px-4 py-12 lg:py-16">
                <p className="text-caption uppercase tracking-wider text-text-faint">
                    Tracker
                </p>
                <h1 className="mt-2 font-display text-display-lg text-foreground">
                    Verify your email to start tracking
                </h1>
                <p className="mt-4 text-body-md text-text-dim max-w-prose">
                    Your application tracker is unlocked once your email is verified. Head
                    back to your dashboard to resend the verification link.
                </p>
                <div className="mt-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                    >
                        Go to dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const { data: applications } = await listApplications();

    return (
        <div className="container mx-auto px-4 py-10 lg:py-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-caption uppercase tracking-wider text-text-faint">
                        Application tracker
                    </p>
                    <h1 className="mt-2 font-display text-display-lg text-foreground">
                        Where you stand
                    </h1>
                    {applications.length > 0 && (
                        <p className="mt-3 text-body-sm text-text-dim italic">
                            {applications.length}{" "}
                            {applications.length === 1 ? "application" : "applications"} in flight
                        </p>
                    )}
                </div>
            </div>

            <TrackerPageClient initial={applications} />
        </div>
    );
}