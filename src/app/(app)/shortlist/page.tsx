import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark, Compass } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import { listBookmarks } from "@/lib/api/endpoints/bookmarks.server";
import { ShortlistList } from "@/components/opportunity/shortlist-list";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
    title: "Your shortlist",
    description: "Opportunities you've saved.",
};

type PageProps = {
    searchParams: Promise<{ sort?: string; order?: string; page?: string }>;
};

export default async function ShortlistPage({ searchParams }: PageProps) {
    // Shortlist requires verification because the bookmarks would never have been created
    // otherwise. If the user ever ends up here unverified, show them the verification path.
    const user = await requireSession();
    const sp = await searchParams;

    const sort = sp.sort === "deadline" ? "deadline" : "created_at";
    const order = sp.order === "asc" ? "asc" : "desc";
    const page = typeof sp.page === "string" ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;

    if (!user.email_verified) {
        return (
            <div className="container mx-auto max-w-3xl px-4 py-12 lg:py-16">
                <p className="text-caption uppercase tracking-wider text-text-faint">Shortlist</p>
                <h1 className="mt-2 font-display text-display-lg text-foreground">
                    Verify your email to start saving
                </h1>
                <p className="mt-4 text-body-md text-text-dim max-w-prose">
                    Shortlists are unlocked once your email is verified. Head back to your dashboard
                    to resend the verification link.
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

    const { data: bookmarks, pagination } = await listBookmarks({
        sort,
        order,
        page,
        page_size: 20,
    });

    const totalRecords =
        "total_records" in pagination ? pagination.total_records : bookmarks.length;

    return (
        <div className="container mx-auto max-w-5xl px-4 py-10 lg:py-14">
            <p className="text-caption uppercase tracking-wider text-text-faint">
                Your shortlist
            </p>
            <h1 className="mt-2 font-display text-display-lg text-foreground">
                Opportunities you&apos;ve saved
            </h1>
            {totalRecords > 0 && (
                <p className="mt-3 text-body-sm text-text-dim italic">
                    {totalRecords} {totalRecords === 1 ? "opportunity" : "opportunities"} saved
                </p>
            )}

            {bookmarks.length === 0 ? (
                <div className="mt-12">
                    <EmptyState
                        icon={Bookmark}
                        title="No saved opportunities yet"
                        description="Save opportunities from any listing page to build your shortlist. They'll appear here, sorted by deadline."
                        action={
                            <Link
                                href="/opportunities"
                                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                            >
                                <Compass className="size-4" />
                                Browse opportunities
                            </Link>
                        }
                    />
                </div>
            ) : (
                <ShortlistList initial={bookmarks} />
            )}
        </div>
    );
}