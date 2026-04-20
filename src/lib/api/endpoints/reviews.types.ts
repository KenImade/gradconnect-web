/**
 * Review domain types.
 * Matches the Go backend's data.Review struct (user_id is never exposed publicly).
 */

export type ReviewOutcome = "offer" | "waitlisted" | "rejected" | "withdrew";

export type ReviewStage = {
    stage_name: string;
    description: string;
    tips?: string;
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