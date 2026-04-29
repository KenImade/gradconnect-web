import "server-only";
import { fetchAPI } from "../server";
import type { PaginatedEnvelope, Envelope } from "../envelope";
import type { Opportunity, OpportunityType } from "./opportunities.types";

export async function getAdminOpportunityById(id: string): Promise<Opportunity> {
    const response = await fetchAPI<Envelope<Opportunity>>(
        `/admin/opportunities/${id}`,
    );
    return response.data;
}

export type ListAdminOpportunitiesParams = {
    q?: string;
    type?: OpportunityType;
    status?: "all" | "open" | "upcoming" | "closed" | "withdrawn";
    intake_year?: number;
    sort?: string;
    page?: number;
    page_size?: number;
};

export async function listAdminOpportunities(
    params?: ListAdminOpportunitiesParams,
): Promise<PaginatedEnvelope<Opportunity[]>> {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.type) qs.set("type", params.type);
    if (params?.status) qs.set("status", params.status);
    if (params?.intake_year) qs.set("intake_year", String(params.intake_year));
    if (params?.sort) qs.set("sort", params.sort);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));

    const path = qs.toString()
        ? `/admin/opportunities?${qs}`
        : "/admin/opportunities";
    return fetchAPI<PaginatedEnvelope<Opportunity[]>>(path);
}