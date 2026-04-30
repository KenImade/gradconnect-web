import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageSquare, MessageSquarePlus } from "lucide-react";
import { getEmployer } from "@/lib/api/endpoints/employers.server";
import { listEmployerReviews } from "@/lib/api/endpoints/reviews.server";
import { APIError } from "@/lib/api/errors";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { ReviewCard } from "@/components/review/review-card";
import { ReviewAggregates } from "@/components/review/review-aggregates";
import { ReviewsSortSelector } from "@/components/review/reviews-sort-selector";
import { getSession } from "@/lib/auth/session";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import { SITE, absoluteUrl } from "@/lib/seo/config";
import { JsonLd } from "@/components/shared/json-ld";
import { Suspense } from "react";
import { PaginationSkeleton } from '@/components/shared/filter-skeleton';
import { FilterSkeleton } from '../../../../../components/shared/filter-skeleton';

type PageProps = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
    params,
}: Pick<PageProps, "params">): Promise<Metadata> {
    const { slug } = await params;
    try {
        const { data: employer } = await getEmployer(slug);
        const title = `${employer.name} — Community Reviews from Past Candidates`;
        const description = `Anonymous reviews from candidates who applied to ${employer.name}'s graduate programmes. Difficulty ratings, interview tips, and stage-by-stage breakdowns.`;
        const url = absoluteUrl(`/employers/${employer.slug}/reviews`);

        return {
            title,
            description,
            alternates: { canonical: url },
            openGraph: {
                type: "article",
                url,
                title,
                description,
                siteName: SITE.name,
                locale: SITE.locale,
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                site: SITE.twitter,
            },
        };
    } catch {
        return { title: "Reviews not found" };
    }
}

export default async function EmployerReviewsPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const sp = await searchParams;

    const sort =
        sp.sort === "difficulty_rating" || sp.sort === "experience_rating"
            ? sp.sort
            : "created_at";
    const order = sp.order === "asc" ? "asc" : "desc";
    const page = typeof sp.page === "string" ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;

    let employer;
    try {
        const result = await getEmployer(slug);
        employer = result.data;
    } catch (err) {
        if (APIError.isAPIError(err) && err.status === 404) notFound();
        throw err;
    }

    const { data: reviews, pagination } = await listEmployerReviews(slug, {
        sort,
        order,
        page,
        page_size: 10,
    });

    const user = await getSession();
    const canReview = user?.email_verified && user.permissions.includes("review:submit");

    const totalRecords =
        "total_records" in pagination ? pagination.total_records : reviews.length;
    const currentPage =
        "current_page" in pagination ? pagination.current_page : 1;
    const lastPage = "last_page" in pagination ? pagination.last_page : 1;

    // Build breadcrumb schema for SEO
    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: absoluteUrl("/") },
        { name: "Employers", url: absoluteUrl("/employers") },
        { name: employer.name, url: absoluteUrl(`/employers/${employer.slug}`) },
        {
            name: "Reviews",
            url: absoluteUrl(`/employers/${employer.slug}/reviews`),
        },
    ]);

    return (
        <>
            <JsonLd data={breadcrumbs} />
            <div className="space-y-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="font-display text-display-md text-foreground">
                            Candidate reviews
                        </h1>
                        <p className="mt-2 text-body-md text-text-dim max-w-prose">
                            First-hand accounts from candidates who&apos;ve been through {employer.name}&apos;s process.
                        </p>
                    </div>
                    {canReview && (
                        <Link
                            href={`/reviews/new?employer=${employer.slug}`}
                            className="inline-flex items-center gap-2 rounded-md border border-primary bg-primary/5 px-4 py-2 text-body-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                        >
                            <MessageSquarePlus className="size-4" />
                            Share your experience
                        </Link>
                    )}
                </div>

                <ReviewAggregates
                    reviewCount={employer.review_count}
                    avgDifficulty={employer.avg_difficulty_rating}
                    avgExperience={employer.avg_experience_rating}
                />

                {reviews.length === 0 ? (
                    <EmptyState
                        icon={MessageSquare}
                        title="No reviews yet"
                        description={`Be the first to share your experience applying to ${employer.name}.`}
                        action={
                            canReview ? (
                                <Link
                                    href={`/reviews/new?employer=${employer.slug}`}
                                    className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                                >
                                    <MessageSquarePlus className="size-4" />
                                    Share your experience
                                </Link>
                            ) : !user ? (
                                <Link
                                    href={`/login?redirect=${encodeURIComponent(`/employers/${employer.slug}/reviews`)}`}
                                    className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                                >
                                    Sign in to contribute
                                </Link>
                            ) : !user.email_verified ? (
                                <p className="text-caption text-text-dim italic">
                                    Verify your email to submit reviews.
                                </p>
                            ) : null
                        }
                    />
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <p className="text-body-sm text-text-dim">
                                Showing {reviews.length} of {totalRecords}
                            </p>
                            <Suspense fallback={<FilterSkeleton />}>
                                <ReviewsSortSelector />
                            </Suspense>
                        </div>

                        <div className="border-t border-border">
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>

                        <Suspense fallback={<PaginationSkeleton className="mt-8" />}>
                            <Pagination
                                className="mt-12"
                                currentPage={currentPage}
                                lastPage={lastPage}
                            />
                        </Suspense>
                    </>
                )}
            </div>
        </>
    );
}