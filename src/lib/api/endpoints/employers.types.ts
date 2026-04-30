/**
 * Employer domain types.
 */

export type Office = {
    city: string;
    state: string;
    address: string;
};

export type SocialLinks = {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
};

/** Returned by GET /employers (list response — summary view) */
export type EmployerSummary = {
    id: string;
    name: string;
    slug: string;
    industry: string;
    size: string | null;
    hq_location: string | null;
    logo_url: string | null;
    overview: string | null;
    is_verified: boolean;
    opportunity_count: number;
    avg_experience_rating: number | null;
    review_count: number;
};

/** Returned by GET /employers/:slug and GET /admin/employers/:id (full profile) */
export type Employer = {
    id: string;
    name: string;
    slug: string;
    industry: string;
    size: string | null;
    hq_location: string | null;
    offices: Office[];
    logo_url: string | null;
    overview: string | null;
    culture: string | null;
    website: string | null;
    social_links: SocialLinks;
    is_verified: boolean;
    version: number;
    created_at: string;
    updated_at: string;
    review_count: number;
    avg_difficulty_rating: number | null;
    avg_experience_rating: number | null;
};

/** Query parameters for GET /employers */
export type ListEmployersParams = {
    q?: string;
    industry?: string;
    is_verified?: boolean;
    sort?: "name" | "created_at";
    order?: "asc" | "desc";
    page?: number;
    page_size?: number;
};

export type EmployerStub = {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    industry: string;
}