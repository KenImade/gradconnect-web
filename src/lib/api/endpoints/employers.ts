import { fetchAPI } from "../server";
import { buildQueryString } from "@/lib/utils/url";
import type { PaginatedEnvelope, Envelope } from "../envelope";
import type {
    Employer,
    EmployerSummary,
    ListEmployersParams,
} from "./employers.types";

/**
 * GET /employers — list employer hub profiles.
 * Server-side only (uses next/headers cookies).
 */
export async function listEmployers(
    params: ListEmployersParams = {},
): Promise<PaginatedEnvelope<EmployerSummary[]>> {
    const qs = buildQueryString(params);
    return fetchAPI<PaginatedEnvelope<EmployerSummary[]>>(`/employers${qs}`);
}

/**
 * GET /employers/:slug — get a full employer hub profile.
 */
export async function getEmployer(slug: string): Promise<Envelope<Employer>> {
    return fetchAPI<Envelope<Employer>>(`/employers/${slug}`);
}