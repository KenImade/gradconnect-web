export type ApplicationStatus =
    | "interested"
    | "applied"
    | "assessment"
    | "interview"
    | "offer"
    | "rejected";

/**
 * Minimal embedded opportunity returned on tracker list items.
 * Intentionally doesn't include all Opportunity fields — the tracker
 * cards don't need description, requirements, discipline_tags, etc.
 */
export type TrackedOpportunity = {
    id: string;
    title: string;
    slug: string;
    type: "graduate_trainee" | "internship" | "nysc" | "industrial_attachment";
    deadline: string | null;
    employer: {
        name: string;
        slug: string;
        logo_url: string | null;
    };
};

/**
 * Tracker entry as returned from POST and PATCH.
 * No embedded opportunity — just the tracker fields.
 */
export type ApplicationTrackStub = {
    id: string;
    opportunity_id: string;
    status: ApplicationStatus;
    notes: string;
    created_at: string;
    updated_at: string;
};

/**
 * Tracker entry as returned from GET list.
 * Has embedded opportunity, but no opportunity_id as a top-level field.
 */
export type ApplicationTrack = {
    id: string;
    status: ApplicationStatus;
    notes: string;
    updated_at: string;
    opportunity: TrackedOpportunity;
};

export type CreateApplicationInput = {
    opportunity_id: string;
    status?: ApplicationStatus;
    notes?: string;
};

export type UpdateApplicationInput = Partial<{
    status: ApplicationStatus;
    notes: string;
}>;