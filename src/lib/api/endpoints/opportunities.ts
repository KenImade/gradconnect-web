import { cache } from "react";
import { fetchAPI } from "../server";
import { buildQueryString } from "@/lib/utils/url";
import type { PaginatedEnvelope, Envelope } from "../envelope";
import type {
    Opportunity,
    ListOpportunitiesParams,
} from "./opportunities.types";

/**
 * GET /opportunities — list opportunities with filters and pagination.
 */
export async function listOpportunities(
    params: ListOpportunitiesParams = {},
): Promise<PaginatedEnvelope<Opportunity[]>> {
    const qs = buildQueryString(params);
    return fetchAPI<PaginatedEnvelope<Opportunity[]>>(`/opportunities${qs}`);
}

/**
 * GET /opportunities/:slug — get a single opportunity detail.
 * Wrapped in cache() for dedup (used in both layout-less page and metadata).
 */
export const getOpportunity = cache(
    async (slug: string): Promise<Envelope<Opportunity>> => {
        return fetchAPI<Envelope<Opportunity>>(`/opportunities/${slug}`);
    },
);