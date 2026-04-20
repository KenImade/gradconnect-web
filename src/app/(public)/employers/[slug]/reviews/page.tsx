import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { getEmployer } from "@/lib/api/endpoints/employers";
import { listEmployerReviews } from "@/lib/api/endpoints/reviews";
import { APIError } from "@/lib/api/errors";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { ReviewCard } from "@/components/review/review-card";
import { ReviewAggregates } from "@/components/review/review-aggregates";
import { ReviewsSortSelector } from "@/components/review/reviews-sort-selector";

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
        return {
            title: `${employer.name} — Community Reviews from Past Candidates`,
            description: `Anonymous reviews from candidates who applied to ${employer.name}'s graduate programmes. Difficulty ratings, interview tips, and stage-by-stage breakdowns.`,
            alternates: { canonical: `/employers/${employer.slug}/reviews` },
        };
    } catch {
        return { title: "Reviews not found" };
    }
}

export default async function EmployerReviewsPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const sp = await searchParams;

    // Parse URL params with sensible defaults.
    const sort =
        sp.sort === "difficulty_rating" || sp.sort === "experience_rating"
            ? sp.sort
            : "created_at";
    const order = sp.order === "asc" ? "asc" : "desc";
    const page = typeof sp.page === "string" ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;

    // Fetch employer (deduped via cache() with the layout fetch) + reviews.
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

    const totalRecords =
        "total_records" in pagination ? pagination.total_records : reviews.length;
    const currentPage =
        "current_page" in pagination ? pagination.current_page : 1;
    const lastPage = "last_page" in pagination ? pagination.last_page : 1;

    return (
        <div className="space-y-8">
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
                />
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <p className="text-body-sm text-text-dim">
                            Showing {reviews.length} of {totalRecords}
                        </p>
                        <ReviewsSortSelector />
                    </div>

                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>

                    <Pagination
                        className="mt-8"
                        currentPage={currentPage}
                        lastPage={lastPage}
                    />
                </>
            )}
        </div>
    );
}