import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { requireSession } from "@/lib/auth/session";

export const metadata: Metadata = {
    title: "Review submitted",
};

type SearchParams = { employer?: string; id?: string };

type PageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function ReviewSubmittedPage({ searchParams }: PageProps) {
    await requireSession();
    const { employer } = await searchParams;

    return (
        <div className="container mx-auto max-w-2xl px-4 py-16 lg:py-24">
            <div className="flex items-start gap-4">
                <div className="shrink-0 mt-1 inline-flex items-center justify-center size-10 rounded-full bg-success/10 text-success">
                    <CheckCircle2 className="size-6" />
                </div>
                <div>
                    <p className="text-caption uppercase tracking-wider text-text-faint">
                        Review submitted
                    </p>
                    <h1 className="mt-2 font-display text-display-md text-foreground">
                        Thank you for contributing.
                    </h1>
                    <p className="mt-4 text-body-md text-text-dim">
                        Your review is in the moderation queue. A moderator will approve it within 1–2 days — at which point it becomes visible on the employer&apos;s page alongside other candidates&apos; reviews.
                    </p>
                    <p className="mt-3 text-body-sm text-text-dim italic">
                        You won&apos;t receive an email when it&apos;s approved — just check the employer&apos;s reviews tab.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        {employer && (
                            <Link
                                href={`/employers/${employer}#reviews`}
                                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                            >
                                View employer
                                <ArrowRight className="size-4" />
                            </Link>
                        )}
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-transparent px-5 py-2.5 text-body-sm text-foreground hover:bg-surface-subtle transition-colors"
                        >
                            Back to dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}