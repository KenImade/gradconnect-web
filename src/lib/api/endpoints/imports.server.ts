import "server-only";
import { fetchAPI } from "../server";
import type { Envelope, PaginatedEnvelope } from "../envelope";
import type { ImportJob } from "./imports.types";

/**
 * GET /admin/import — list import jobs (newest first).
 * Backend may not yet support pagination on this endpoint; if so, this
 * returns the full list. Update when pagination is added.
 */
export async function listImports(): Promise<ImportJob[]> {
    const response = await fetchAPI<Envelope<ImportJob[]> | PaginatedEnvelope<ImportJob>>(
        "/admin/import",
    );
    return response.data;
}

export async function getImportJob(id: string): Promise<ImportJob> {
    const response = await fetchAPI<Envelope<ImportJob>>(`/admin/import/${id}`);
    return response.data;
}