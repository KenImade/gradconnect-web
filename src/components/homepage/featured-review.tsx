import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Review } from "@/lib/api/endpoints/reviews.types";

type FeaturedReviewProps = {
    review: Review;
    employer: { name: string; slug: string };
};

export function FeaturedReview({ review, employer }: FeaturedReviewProps) {
    const excerpt =
        review.tips && review.tips.length > 260
            ? review.tips.slice(0, 260).trimEnd() + "…"
            : review.tips ?? "";

    if (!excerpt) return null;

    const outcomeLabel = {
        offer: "Received an offer",
        waitlisted: "Waitlisted",
        rejected: "Rejected",
        withdrew: "Withdrew",
    }[review.outcome];

    return (
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-14">
            <figure className="max-w-3xl">
                <blockquote className="font-display text-heading-xl text-foreground leading-snug">
                    {excerpt}
                </blockquote>
                <figcaption className="mt-6 text-body-sm text-text-dim italic">
                    {outcomeLabel}
                    {" · "}
                    {review.programme_name}
                    {review.degree_discipline && (
                        <>
                            {" · "}
                            {review.degree_discipline}
                        </>
                    )}
                    {review.university && (
                        <>
                            {" · "}
                            {review.university}
                        </>
                    )}
                </figcaption>

                <Link
                    href={`/employers/${employer.slug}#reviews`}
                    className="mt-6 inline-flex items-center gap-1.5 text-body-sm text-foreground hover:text-primary transition-colors"
                >
                    Read more reviews from {employer.name}
                    <ArrowRight className="size-4" />
                </Link>
            </figure>

            <div
                className="hidden text-primary lg:flex items-start justify-center"
                aria-hidden
            >
                <Image
                    src="/images/anonymous-feedback.webp"
                    alt="Getting feedback from users"
                    width={960}
                    height={676}
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="w-full h-auto"
                />
            </div>
        </div>
    );
}