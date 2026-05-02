/**
 * Opportunity domain types.
 * Matches the Go backend's response from GET /opportunities.
 */

import { EmployerStub } from "./employers.types";

export type OpportunityType =
    | "graduate_trainee"
    | "internship"
    | "nysc"
    | "industrial_attachment";

// Stored status — what the backend returns on actual opportunity records
export type OpportunityStoredStatus = "open" | "upcoming" | "closed" | "withdrawn";

// Query filter status — what clients can request (includes the composite)
export type OpportunityStatus = OpportunityStoredStatus | "open_or_upcoming";

/** Returned by GET /opportunities (summary + in detail) */
export type Opportunity = {
    id: string;
    title: string;
    slug: string;
    type: OpportunityType;
    intake_year: number;
    status: OpportunityStoredStatus;
    description: string;
    requirements: string | null;
    location: string;
    discipline_tags: string[];
    opens_at: string | null;
    deadline: string | null;
    days_remaining: number | null;
    application_url: string;
    is_active: boolean;
    source_url: string | null;
    created_at: string;
    updated_at: string;
    employer: EmployerStub;
};

/** Query parameters for GET /opportunities */
export type ListOpportunitiesParams = {
    q?: string;
    type?: OpportunityType;
    status?: OpportunityStatus | "all";
    employer_slug?: string;
    intake_year?: number;
    industry?: string;
    location?: string;
    discipline?: string;
    deadline_before?: string;
    deadline_after?: string;
    sort?: "deadline" | "opens_at" | "created_at" | "title" | "-deadline" | "-opens_at" | "-created_at" | "-title";
    order?: "asc" | "desc";
    page?: number;
    page_size?: number;
};