"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronDown,
    ChevronRight,
    Loader2,
    Check,
    X,
    User,
    GraduationCap,
    Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { moderateReview } from "@/lib/api/endpoints/admin-reviews";
import { APIError } from "@/lib/api/errors";
import type { AdminReview } from "@/lib/api/endpoints/admin-reviews.types";

type Props = {
    review: AdminReview;
    employerName: string;
    employerSlug: string;
    onResolved?: (id: string) => void;
};

const OUTCOME_LABEL: Record<AdminReview["outcome"], string> = {
    offer: "Offer",
    waitlisted: "Waitlisted",
    rejected: "Rejected",
    withdrew: "Withdrew",
};

const STATUS_TONE: Record<AdminReview["status"], string> = {
    pending: "border-warning bg-warning/5 text-warning",
    approved: "border-success bg-success/5 text-success",
    rejected: "border-destructive bg-destructive/5 text-destructive",
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function ModerationReviewCard({
    review,
    employerName,
    employerSlug,
    onResolved,
}: Props) {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [actionInFlight, setActionInFlight] = useState<"approve" | "reject" | null>(null);

    const isPending = review.status === "pending";
    const tipsExcerpt =
        review.tips && review.tips.length > 140
            ? review.tips.slice(0, 140).trimEnd() + "…"
            : review.tips;

    async function handleAction(next: "approved" | "rejected") {
        if (actionInFlight) return;
        setActionInFlight(next === "approved" ? "approve" : "reject");

        try {
            await moderateReview(review.id, next);
            toast.success(
                next === "approved"
                    ? `Approved review of ${employerName}`
                    : `Rejected review of ${employerName}`,
            );
            // Notify the parent so it can drop the row from the list
            onResolved?.(review.id);
            router.refresh(); // Refresh server data so any stale aggregates update
        } catch (err) {
            const message =
                APIError.isAPIError(err) && err.message
                    ? err.message
                    : "Couldn't update review status. Try again.";
            toast.error(message);
            setActionInFlight(null);
        }
    }

    return (
        <article className="border-b border-admin-border bg-admin-surface">
            {/* Collapsed summary row */}
            <button
                type="button"
                onClick={() => setIsExpanded((v) => !v)}
                className="w-full text-left px-5 py-4 hover:bg-admin-surface-subtle transition-colors flex items-start gap-3"
                aria-expanded={isExpanded}
            >
                <span className="mt-1 text-admin-text-faint shrink-0">
                    {isExpanded ? (
                        <ChevronDown className="size-4" />
                    ) : (
                        <ChevronRight className="size-4" />
                    )}
                </span>

                <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-y-1 gap-x-6 items-start">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="font-medium text-admin-foreground">
                                {employerName}
                            </span>
                            <span className="text-admin-text-faint">·</span>
                            <span className="text-admin-foreground truncate">
                                {review.programme_name}
                            </span>
                        </div>
                        {tipsExcerpt && (
                            <p className="mt-1 text-body-sm text-admin-text-dim line-clamp-1 italic">
                                &ldquo;{tipsExcerpt}&rdquo;
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-caption text-admin-text-dim shrink-0">
                        <span
                            className={cn(
                                "inline-flex items-center px-1.5 py-0.5 rounded border text-caption",
                                STATUS_TONE[review.status],
                            )}
                        >
                            {review.status}
                        </span>
                        <span>{OUTCOME_LABEL[review.outcome]}</span>
                        <span aria-hidden>·</span>
                        <span title="Difficulty rating">D {review.difficulty_rating}/5</span>
                        <span aria-hidden>·</span>
                        <span title="Experience rating">E {review.experience_rating}/5</span>
                        <span aria-hidden>·</span>
                        <span>{formatDate(review.created_at)}</span>
                    </div>
                </div>
            </button>

            {/* Expanded body */}
            {isExpanded && (
                <div className="px-5 pb-6 pt-1">
                    <div className="grid gap-6 md:grid-cols-[1fr_280px]">
                        {/* Main content */}
                        <div className="min-w-0 space-y-6">
                            {/* Stage breakdown */}
                            <section>
                                <h3 className="text-caption uppercase tracking-wide text-admin-text-faint">
                                    Stage breakdown
                                </h3>
                                <ol className="mt-3 space-y-4">
                                    {review.stage_breakdown.map((stage, idx) => (
                                        <li
                                            key={idx}
                                            className="border-l-2 border-admin-border-strong pl-4"
                                        >
                                            <p className="font-medium text-admin-foreground">
                                                {stage.stage_name}
                                            </p>
                                            {stage.description && (
                                                <p className="mt-1 text-body-sm text-admin-text-dim whitespace-pre-line">
                                                    {stage.description}
                                                </p>
                                            )}
                                            {stage.tips && (
                                                <p className="mt-2 text-caption text-admin-text-faint italic">
                                                    Tip: {stage.tips}
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            </section>

                            {/* Overall tips */}
                            {review.tips && (
                                <section>
                                    <h3 className="text-caption uppercase tracking-wide text-admin-text-faint">
                                        Overall advice
                                    </h3>
                                    <p className="mt-2 text-body-sm text-admin-foreground whitespace-pre-line">
                                        {review.tips}
                                    </p>
                                </section>
                            )}
                        </div>

                        {/* Sidebar — author + meta */}
                        <aside className="space-y-4 text-body-sm">
                            <div>
                                <p className="text-caption uppercase tracking-wide text-admin-text-faint">
                                    Author
                                </p>
                                <p className="mt-1 inline-flex items-center gap-1.5 text-admin-text-dim">
                                    <User className="size-3.5 text-admin-text-faint" />
                                    <code className="text-caption font-mono break-all">
                                        {review.user_id}
                                    </code>
                                </p>
                            </div>

                            {review.degree_discipline && (
                                <div>
                                    <p className="text-caption uppercase tracking-wide text-admin-text-faint">
                                        Degree
                                    </p>
                                    <p className="mt-1 inline-flex items-center gap-1.5 text-admin-text-dim">
                                        <GraduationCap className="size-3.5 text-admin-text-faint" />
                                        {review.degree_discipline}
                                        {review.university && (
                                            <span className="italic">
                                                — {review.university}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-caption uppercase tracking-wide text-admin-text-faint">
                                    Submitted
                                </p>
                                <p className="mt-1 inline-flex items-center gap-1.5 text-admin-text-dim">
                                    <Calendar className="size-3.5 text-admin-text-faint" />
                                    {formatDate(review.created_at)}
                                </p>
                            </div>

                            <div>
                                <p className="text-caption uppercase tracking-wide text-admin-text-faint">
                                    Application year
                                </p>
                                <p className="mt-1 text-admin-text-dim">
                                    {review.application_year}
                                </p>
                            </div>
                        </aside>
                    </div>

                    {/* Actions */}
                    {isPending && (
                        <div className="mt-6 pt-4 border-t border-admin-border flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => handleAction("approved")}
                                disabled={!!actionInFlight}
                                className="inline-flex items-center gap-2 rounded-md bg-success/10 border border-success px-4 py-2 text-body-sm font-medium text-success hover:bg-success/20 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                                {actionInFlight === "approve" ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Check className="size-4" />
                                )}
                                Approve
                            </button>
                            <button
                                type="button"
                                onClick={() => handleAction("rejected")}
                                disabled={!!actionInFlight}
                                className="inline-flex items-center gap-2 rounded-md bg-destructive/5 border border-destructive px-4 py-2 text-body-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                                {actionInFlight === "reject" ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <X className="size-4" />
                                )}
                                Reject
                            </button>

                            <a
                                href={`/employers/${employerSlug}/reviews`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto inline-flex items-center gap-1 text-caption text-admin-text-dim hover:text-admin-foreground transition-colors"
                            >
                                View employer reviews →
                            </a>
                        </div>
                    )}
                </div>
            )
            }
        </article >
    );
}