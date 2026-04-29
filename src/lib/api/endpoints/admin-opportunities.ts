import { fetchAPIClient } from "../client";
import type { Envelope, PaginatedEnvelope } from "../envelope";
import type { Opportunity, OpportunityType } from "./opportunities.types";

export type CreateOpportunityInput = {
    employer_id: string;
    title: string;
    slug: string;
    type: OpportunityType;
    intake_year: number;
    description: string;
    requirements?: string | null;
    location: string;
    discipline_tags?: string[] | null;
    opens_at?: string | null;
    deadline?: string | null;
    application_url: string;
    source_url?: string | null;
};

export type UpdateOpportunityInput = Partial<CreateOpportunityInput> & {
    is_active?: boolean;
};

export async function createOpportunity(
    input: CreateOpportunityInput,
): Promise<Opportunity> {
    const response = await fetchAPIClient<Envelope<Opportunity>>(
        "/admin/opportunities",
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );
    return response.data;
}

export async function updateOpportunity(
    id: string,
    input: UpdateOpportunityInput,
): Promise<Opportunity> {
    const response = await fetchAPIClient<Envelope<Opportunity>>(
        `/admin/opportunities/${id}`,
        {
            method: "PATCH",
            body: JSON.stringify(input),
        },
    );
    return response.data;
}