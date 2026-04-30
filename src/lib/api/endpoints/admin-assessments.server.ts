import "server-only";
import { fetchAPI } from "../server";
import type { Envelope, PaginatedEnvelope } from "../envelope";
import type { Assessment } from "./assessments.types";

export type ListAdminAssessmentsParams = {
    q?: string;
    employer_id?: string;
    sort?: string;
    page?: number;
    page_size?: number;
};

export async function getAdminAssessmentById(id: string): Promise<Assessment> {
    const response = await fetchAPI<Envelope<Assessment>>(
        `/admin/assessments/${id}`,
    );
    return response.data;
}

export async function listAdminAssessments(
    params?: ListAdminAssessmentsParams,
): Promise<PaginatedEnvelope<Assessment[]>> {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.employer_id) qs.set("employer_id", params.employer_id);
    if (params?.sort) qs.set("sort", params.sort);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));

    const path = qs.toString() ? `/admin/assessments?${qs}` : "/admin/assessments";
    return fetchAPI<PaginatedEnvelope<Assessment[]>>(path);
}