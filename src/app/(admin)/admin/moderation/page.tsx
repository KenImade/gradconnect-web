import type { Metadata } from "next";
import { listAdminReviews } from "@/lib/api/endpoints/admin-reviews.server";
import { listEmployers } from "@/lib/api/endpoints/employers.server";
import { ModerationStatusFilter } from "@/components/admin/moderation-status-filter";
import { ModerationList } from "@/components/admin/moderation-list";
import { Suspense } from "react";
import { FilterSkeleton } from "@/components/shared/filter-skeleton";

export const metadata: Metadata = { title: "Moderation" };

type ReviewStatus = "pending" | "approved" | "rejected";

type SearchParams = {
    status?: string;
    page?: string;
};

type PageProps = {
    searchParams: Promise<SearchParams>;
};

function isValidStatus(s: string | undefined): s is ReviewStatus {
    return s === "pending" || s === "approved" || s === "rejected";
}

export default async function ModerationPage({ searchParams }: PageProps) {
    const sp = await searchParams;
    const status: ReviewStatus = isValidStatus(sp.status) ? sp.status : "pending";
    const page = sp.page ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;

    // Fetch reviews + employer index in parallel.
    const [reviewsRes, employersRes] = await Promise.all([
        listAdminReviews({
            status,
            sort: "created_at",
            page,
            page_size: 50,
        }),
        listEmployers({ page_size: 100 }),
    ]);

    const employersById: Record<string, { id: string; name: string; slug: string }> = {};
    for (const e of employersRes.data) {
        employersById[e.id] = { id: e.id, name: e.name, slug: e.slug };
    }

    const totalRecords = reviewsRes.pagination.total_records;

    return (
        <div className="px-8 py-8">
            {/* Header */}
            <div className="max-w-5xl">
                <p className="text-caption uppercase tracking-wider text-admin-text-faint">
                    Moderation
                </p>
                <h1 className="mt-1 font-display text-display-md text-admin-foreground">
                    Reviews to moderate
                </h1>
                <p className="mt-2 text-body-sm text-admin-text-dim">
                    Review submissions from candidates. Approved reviews appear publicly on the employer&apos;s page; rejected reviews are hidden but kept for audit.
                </p>
            </div>

            {/* Filter tabs */}
            <div className="mt-8 max-w-5xl">
                <Suspense fallback={<FilterSkeleton />}>
                    <ModerationStatusFilter
                        counts={{ [status]: totalRecords } as Partial<Record<typeof status, number>>}
                    />
                </Suspense>
            </div>

            {/* List */}
            <div className="mt-2 max-w-5xl">
                <ModerationList
                    key={status}
                    initialReviews={reviewsRes.data}
                    employersById={employersById}
                    isPendingView={status === "pending"}
                />
            </div>
        </div>
    );
}