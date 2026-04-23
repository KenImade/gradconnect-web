import { listEmployers } from "@/lib/api/endpoints/employers";
import { listOpportunities } from "@/lib/api/endpoints/opportunities";
import { listEmployerReviews } from "@/lib/api/endpoints/reviews";
import type { EmployerSummary } from "@/lib/api/endpoints/employers.types";
import type { Opportunity } from "@/lib/api/endpoints/opportunities.types";
import type { Review } from "@/lib/api/endpoints/reviews.types";

/**
 * Homepage payload. All three sections have sensible fallbacks — if any
 * fetch fails or returns empty, the homepage renders without that block
 * rather than erroring. This matters because we hit the homepage before
 * any auth boundary, and a transient failure shouldn't blow up the landing.
 */
export type HomepageData = {
    featuredEmployers: EmployerSummary[];
    closingSoon: Opportunity[];
    featuredReview: Review | null;
    featuredReviewEmployer: { name: string; slug: string } | null;
};

export async function getHomepageData(): Promise<HomepageData> {
    const [employersRes, opportunitiesRes, reviewsRes] = await Promise.allSettled([
        listEmployers({ is_verified: true, page_size: 8 }),
        listOpportunities({ status: "open", sort: "deadline", order: "asc", page_size: 3 }),
        listEmployerReviews("access-bank", { sort: "created_at", order: "desc", page_size: 1 }),
    ]);

    const featuredEmployers =
        employersRes.status === "fulfilled" ? employersRes.value.data : [];

    const closingSoon =
        opportunitiesRes.status === "fulfilled" ? opportunitiesRes.value.data : [];

    let featuredReview: Review | null = null;
    if (reviewsRes.status === "fulfilled" && reviewsRes.value.data.length > 0) {
        const reviews = reviewsRes.value.data;
        featuredReview =
            reviews.find(
                (r) => r.outcome === "offer" && r.tips && r.tips.length >= 100,
            ) ?? reviews[0] ?? null;
    }

    return {
        featuredEmployers,
        closingSoon,
        featuredReview,
        featuredReviewEmployer: featuredReview
            ? { name: "Access Bank", slug: "access-bank" }
            : null,
    };
}