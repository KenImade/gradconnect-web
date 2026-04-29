/**
 * Review domain types.
 * Matches the Go backend's data.Review struct (user_id is never exposed publicly).
 */

export type ReviewOutcome = "offer" | "waitlisted" | "rejected" | "withdrew";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type ReviewStage = {
    stage_name: string;
    description?: string;
    tips?: string;
    order: number;
};

export type Review = {
    id: string;
    employer_id: string;
    programme_name: string;
    application_year: number;
    outcome: ReviewOutcome;
    stage_breakdown: ReviewStage[];
    difficulty_rating: number;
    experience_rating: number;
    tips: string | null;
    degree_discipline: string | null;
    university: string | null;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    updated_at: string;
};

/** Query parameters for GET /employers/:slug/reviews */
export type ListReviewsParams = {
    sort?: "created_at" | "difficulty_rating" | "experience_rating";
    order?: "asc" | "desc";
    page?: number;
    page_size?: number;
};

/**
 * Minimal shape returned from POST /reviews on success.
 */
export type ReviewSubmissionResult = {
    id: string;
    employer_id: string;
    programme_name: string;
    status: ReviewStatus;
    created_at: string;
};

/**
 * Input for POST /reviews. Shape must match backend exactly —
 * unknown keys produce a 400.
 */
export type SubmitReviewInput = {
    employer_id: string;
    programme_name: string;
    application_year: number;
    outcome: ReviewOutcome;
    stage_breakdown: ReviewStage[];
    difficulty_rating: number;
    experience_rating: number;
    tips?: string;
    degree_discipline?: string;
    university?: string;
};