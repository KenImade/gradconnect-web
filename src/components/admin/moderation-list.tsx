"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Inbox } from "lucide-react";
import { ModerationReviewCard } from "./moderation-review-card";
import type { AdminReview } from "@/lib/api/endpoints/admin-reviews.types";

type EmployerStub = { id: string; name: string; slug: string };

type Props = {
    initialReviews: AdminReview[];
    employersById: Record<string, EmployerStub>;
    isPendingView: boolean;
};

export function ModerationList({ initialReviews, employersById, isPendingView }: Props) {
    const router = useRouter();
    const [reviews, setReviews] = useState(initialReviews);

    function handleResolved(id: string) {
        // On the pending view we drop the row immediately for fast feedback.
        // On approved/rejected views, server data will refresh via router.refresh().
        if (isPendingView) {
            setReviews((prev) => prev.filter((r) => r.id !== id));
        } else {
            router.refresh();
        }
    }

    if (reviews.length === 0) {
        return (
            <div className="px-8 py-16 flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center size-12 rounded-full bg-admin-surface-subtle text-admin-text-faint">
                    <Inbox className="size-5" />
                </div>
                <p className="mt-4 font-display text-heading-md text-admin-foreground">
                    {isPendingView ? "Inbox zero." : "Nothing here."}
                </p>
                <p className="mt-1 text-body-sm text-admin-text-dim">
                    {isPendingView
                        ? "All reviews have been moderated."
                        : "No reviews match this filter."}
                </p>
            </div>
        );
    }

    return (
        <div className="border-t border-admin-border bg-admin-surface">
            {reviews.map((review) => {
                const employer = employersById[review.employer_id];
                return (
                    <ModerationReviewCard
                        key={review.id}
                        review={review}
                        employerName={employer?.name ?? "Unknown employer"}
                        employerSlug={employer?.slug ?? ""}
                        onResolved={handleResolved}
                    />
                );
            })}
        </div>
    );
}