import { fetchAPI } from "../server";
import { buildQueryString } from "@/lib/utils/url";
import type { PaginatedEnvelope } from "../envelope";
import type { Review, ListReviewsParams } from "./reviews.types";

/**
 * GET /employers/:slug/reviews — list approved reviews for an employer.
 */
export async function listEmployerReviews(
    slug: string,
    params: ListReviewsParams = {},
): Promise<PaginatedEnvelope<Review[]>> {
    const qs = buildQueryString(params);
    return fetchAPI<PaginatedEnvelope<Review[]>>(
        `/employers/${slug}/reviews${qs}`,
    );
}