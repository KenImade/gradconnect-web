import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import type { Review } from "@/lib/api/endpoints/reviews.types";

type Props = {
    employerSlug: string;
    employerName: string;
    reviews: Review[];
};

const OUTCOME_LABELS: Record<string, string> = {
    offer: "Received an offer",
    waitlisted: "Waitlisted",
    rejected: "Not offered",
    withdrew: "Withdrew",
};

export function EmployerReviewsSidebar({
    employerSlug,
    employerName,
    reviews,
}: Props) {
    return (
        <div className="rounded-lg border border-border bg-background p-6">
            <h3 className="font-display text-heading-md text-foreground">
                Recent reviews
            </h3>

            {reviews.length === 0 ? (
                <div className="mt-4 space-y-3">
                    <p className="text-body-sm text-text-dim">
                        No reviews yet for {employerName}. Have you been
                        through their process?
                    </p>
                    <Link
                        href={`/reviews/new?employer=${employerSlug}`}
                        className="inline-flex items-center gap-1 text-body-sm text-foreground hover:text-primary transition-colors"
                    >
                        Share your experience
                        <ArrowRight className="size-3.5" />
                    </Link>
                </div>
            ) : (
                <ul className="mt-4 space-y-5 divide-y divide-border">
                    {reviews.map((review, i) => (
                        <li
                            key={review.id}
                            className={i > 0 ? "pt-5" : undefined}
                        >
                            <div className="flex items-start gap-2">
                                <Quote
                                    className="size-3.5 shrink-0 text-text-faint mt-1"
                                    aria-hidden
                                />
                                <p className="text-body-sm text-foreground leading-relaxed">
                                    {truncate(review.tips, 140)}
                                </p>
                            </div>
                            <p className="mt-2 text-caption italic text-text-dim">
                                {OUTCOME_LABELS[review.outcome] ?? review.outcome}
                                {" · "}
                                {review.programme_name}
                                {review.application_year && (
                                    <> · {review.application_year}</>
                                )}
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            {reviews.length > 0 && (
                <Link
                    href={`/employers/${employerSlug}/reviews`}
                    className="mt-5 inline-flex items-center gap-1 text-body-sm text-foreground hover:text-primary transition-colors"
                >
                    See all reviews
                    <ArrowRight className="size-3.5" />
                </Link>
            )}
        </div>
    );
}

function truncate(text: string | null, max: number): string {
    if (!text) return "";
    if (text.length <= max) return text;
    return text.slice(0, max).trimEnd() + "…";
}