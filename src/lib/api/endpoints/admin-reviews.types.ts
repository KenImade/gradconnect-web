import type { Review } from "./reviews.types";

/**
 * Admin-only review shape — extends the public review with user_id.
 * Returned by GET /admin/reviews and PATCH /admin/reviews/:id.
 */
export type AdminReview = Review & {
    user_id: string;
};