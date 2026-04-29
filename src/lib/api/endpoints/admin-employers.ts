import { fetchAPIClient } from "../client";
import type { Envelope, PaginatedEnvelope } from "../envelope";
import type { Employer, ListEmployersParams } from "./employers.types";

export type CreateEmployerInput = {
    name: string;
    slug: string;
    industry: string;
    size?: string | null;
    hq_location?: string | null;
    offices?: Array<{ city: string; state: string; address: string }> | null;
    logo_url?: string | null;
    overview?: string | null;
    culture?: string | null;
    website?: string | null;
    social_links?: Record<string, string> | null;
    is_verified?: boolean;
};

export type UpdateEmployerInput = Partial<CreateEmployerInput>;

export async function createEmployer(
    input: CreateEmployerInput,
): Promise<Employer> {
    const response = await fetchAPIClient<Envelope<Employer>>(
        "/admin/employers",
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );
    return response.data;
}

export async function updateEmployer(
    id: string,
    input: UpdateEmployerInput,
): Promise<Employer> {
    const response = await fetchAPIClient<Envelope<Employer>>(
        `/admin/employers/${id}`,
        {
            method: "PATCH",
            body: JSON.stringify(input),
        },
    );
    return response.data;
}

export async function listEmployersClient(
    params?: ListEmployersParams,
): Promise<PaginatedEnvelope<Employer[]>> {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.industry) qs.set("industry", params.industry);
    if (params?.is_verified !== undefined) qs.set("is_verified", String(params.is_verified));
    if (params?.sort) qs.set("sort", params.sort);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));

    const path = qs.toString() ? `/employers?${qs}` : "/employers";
    return fetchAPIClient<PaginatedEnvelope<Employer[]>>(path);
}