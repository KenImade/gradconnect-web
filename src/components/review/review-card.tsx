import { Calendar, GraduationCap, Lightbulb } from "lucide-react";
import type { Review } from "@/lib/api/endpoints/reviews.types";
import { RatingDots } from "./rating-dots";
import { OutcomeBadge } from "./outcome-badge";

export function ReviewCard({ review }: { review: Review }) {
    return (
        <article className="border-b border-border py-8">
            {/* Top row: programme + year + outcome */}
            <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="font-display text-heading-lg text-foreground">
                        {review.programme_name}
                    </h3>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-caption text-text-faint italic">
                        <Calendar className="size-3" />
                        Applied {review.application_year}
                    </p>
                </div>
                <OutcomeBadge outcome={review.outcome} />
            </header>

            {/* Ratings row */}
            <dl className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-3">
                <div className="flex items-center gap-3">
                    <dt className="text-caption uppercase tracking-wide text-text-faint">
                        Difficulty
                    </dt>
                    <dd>
                        <RatingDots value={review.difficulty_rating} label="Difficulty rating" />
                    </dd>
                </div>
                <div className="flex items-center gap-3">
                    <dt className="text-caption uppercase tracking-wide text-text-faint">
                        Experience
                    </dt>
                    <dd>
                        <RatingDots value={review.experience_rating} label="Experience rating" />
                    </dd>
                </div>
            </dl>

            {/* Stage breakdown */}
            {review.stage_breakdown.length > 0 && (
                <section className="mt-8">
                    <p className="text-overline uppercase tracking-wider text-text-faint">
                        Stage by stage
                    </p>
                    <ul className="mt-4 space-y-5 max-w-prose">
                        {review.stage_breakdown.map((stage, idx) => (
                            <li key={idx}>
                                <p className="text-body-sm font-semibold text-foreground">
                                    {stage.stage_name}
                                </p>
                                {stage.description && (
                                    <p className="mt-1 text-body-sm text-text-dim">
                                        {stage.description}
                                    </p>
                                )}
                                {stage.tips && (
                                    <p className="mt-2 flex items-start gap-2 text-body-sm text-text-dim border-l-2 border-primary/40 pl-3">
                                        <Lightbulb className="size-4 shrink-0 text-primary/70 mt-0.5" />
                                        <span className="italic">{stage.tips}</span>
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Overall tips */}
            {review.tips && (
                <section className="mt-8 max-w-prose">
                    <p className="text-overline uppercase tracking-wider text-text-faint">
                        Overall advice
                    </p>
                    <p className="mt-3 text-body-md text-text-dim whitespace-pre-line italic border-l-2 border-border-strong pl-4">
                        {review.tips}
                    </p>
                </section>
            )}

            {/* Footer: optional attribution */}
            {(review.degree_discipline || review.university) && (
                <footer className="mt-6 text-caption text-text-faint italic">
                    <span className="inline-flex items-center gap-1.5">
                        <GraduationCap className="size-3.5" />
                        {review.degree_discipline && <span>{review.degree_discipline}</span>}
                        {review.degree_discipline && review.university && <span>·</span>}
                        {review.university && <span>{review.university}</span>}
                    </span>
                </footer>
            )}
        </article>
    );
}