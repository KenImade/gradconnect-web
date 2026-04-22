import "server-only";
import { fetchAPI } from "../server";
import type { PaginatedEnvelope } from "../envelope";
import type { ApplicationTrack } from "./applications.types";

/**
 * GET /me/applications — server-side list.
 */
export async function listApplications(): Promise<PaginatedEnvelope<ApplicationTrack[]>> {
    return fetchAPI<PaginatedEnvelope<ApplicationTrack[]>>(
        "/me/applications?page_size=100",
    );
}