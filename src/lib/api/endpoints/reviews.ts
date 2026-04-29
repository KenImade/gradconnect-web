import { fetchAPIClient } from "../client";
import type { Envelope } from "../envelope";
import type {
    ReviewSubmissionResult,
    SubmitReviewInput,
} from "./reviews.types";

/**
 * POST /reviews — submit a new review.
 * Returns a minimal stub; the review enters moderation (status: pending).
 */
export async function submitReview(
    input: SubmitReviewInput,
): Promise<ReviewSubmissionResult> {
    const response = await fetchAPIClient<Envelope<ReviewSubmissionResult>>(
        "/reviews",
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );
    return response.data;
}