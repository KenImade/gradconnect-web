import { fetchAPIClient } from "../client";
import type { Envelope, PaginatedEnvelope } from "../envelope";
import type {
    ApplicationTrack,
    ApplicationTrackStub,
    CreateApplicationInput,
    UpdateApplicationInput,
} from "./applications.types";

export async function listApplicationsClient(): Promise<PaginatedEnvelope<ApplicationTrack[]>> {
    return fetchAPIClient<PaginatedEnvelope<ApplicationTrack[]>>(
        "/me/applications?page_size=100",
    );
}

export async function createApplication(
    input: CreateApplicationInput,
): Promise<ApplicationTrackStub> {
    const response = await fetchAPIClient<Envelope<ApplicationTrackStub>>(
        "/me/applications",
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );
    return response.data;
}

export async function updateApplication(
    id: string,
    input: UpdateApplicationInput,
): Promise<ApplicationTrackStub> {
    const response = await fetchAPIClient<Envelope<ApplicationTrackStub>>(
        `/me/applications/${id}`,
        {
            method: "PATCH",
            body: JSON.stringify(input),
        },
    );
    return response.data;
}

export async function deleteApplication(id: string): Promise<void> {
    await fetchAPIClient(`/me/applications/${id}`, {
        method: "DELETE",
    });
}