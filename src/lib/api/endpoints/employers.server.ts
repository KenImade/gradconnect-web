import "server-only";
import { fetchAPI } from "../server";
import type { Envelope, PaginatedEnvelope } from "../envelope";
import type {
    EmployerSummary,
    ListEmployersParams,
    Employer
} from "./employers.types";

export async function listEmployers(
    params?: ListEmployersParams,
): Promise<PaginatedEnvelope<EmployerSummary[]>> {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.industry) qs.set("industry", params.industry);
    if (params?.is_verified !== undefined) {
        qs.set("is_verified", String(params.is_verified));
    }
    if (params?.sort) qs.set("sort", params.sort);
    if (params?.order) qs.set("order", params.order);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));

    const path = qs.toString() ? `/employers?${qs}` : "/employers";
    return fetchAPI<PaginatedEnvelope<EmployerSummary[]>>(path);
}

export async function getEmployer(
    slug: string,
): Promise<Envelope<Employer>> {
    return fetchAPI<Envelope<Employer>>(`/employers/${slug}`);
}