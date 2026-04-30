import { fetchAPIClient } from "../client";
import type { Envelope, PaginatedEnvelope } from "../envelope";
import type { Assessment } from "./assessments.types";

export type AdminAssessmentStage = {
    order: number;
    stage_name: string;
    stage_type: string;
    description?: string;
};

export type CreateAssessmentInput = {
    employer_id: string;
    programme_type: string;
    stages: AdminAssessmentStage[];
    aptitude_test_provider?: string | null;
    interview_format?: string | null;
    timeline_weeks?: number | null;
    prep_guide?: string | null;
};

export type UpdateAssessmentInput = Partial<Omit<CreateAssessmentInput, "employer_id">>;

type ListAdminAssessmentsParams = {
    q?: string;
    employer_id?: string;
    sort?: string;
    page?: number;
    page_size?: number;
};

export async function listAdminAssessmentsClient(
    params?: ListAdminAssessmentsParams,
): Promise<PaginatedEnvelope<Assessment[]>> {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.employer_id) qs.set("employer_id", params.employer_id);
    if (params?.sort) qs.set("sort", params.sort);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));

    const path = qs.toString() ? `/admin/assessments?${qs}` : "/admin/assessments";
    return fetchAPIClient<PaginatedEnvelope<Assessment[]>>(path);
}

export async function createAssessment(
    input: CreateAssessmentInput,
): Promise<Assessment> {
    const response = await fetchAPIClient<Envelope<Assessment>>(
        "/admin/assessments",
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );
    return response.data;
}

export async function updateAssessment(
    id: string,
    input: UpdateAssessmentInput,
): Promise<Assessment> {
    const response = await fetchAPIClient<Envelope<Assessment>>(
        `/admin/assessments/${id}`,
        {
            method: "PATCH",
            body: JSON.stringify(input),
        },
    );
    return response.data;
}

export async function deleteAssessment(id: string): Promise<void> {
    await fetchAPIClient(`/admin/assessments/${id}`, {
        method: "DELETE",
    });
}