import "server-only";
import { fetchAPI } from "../server";
import type { Envelope } from "../envelope";
import type { ImportJob } from "./imports.types";

export async function listImports(): Promise<ImportJob[]> {
    const response = await fetchAPI<Envelope<ImportJob[]>>("/admin/import");
    return response.data;
}

export async function getImportJob(id: string): Promise<ImportJob> {
    const response = await fetchAPI<Envelope<ImportJob>>(`/admin/import/${id}`);
    return response.data;
}