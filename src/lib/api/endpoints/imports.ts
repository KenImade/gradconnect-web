"use client";

import { env } from "@/lib/config";
import { fetchAPIClient } from "../client";
import { APIError } from "../errors";
import type { Envelope } from "../envelope";
import type { ImportJob, ImportType } from "./imports.types";

/**
 * POST /admin/import?type=<type> — multipart upload, returns the created job.
 * Same multipart-can't-go-through-fetchAPIClient pattern as logo upload.
 */
export async function startImport(
    file: File,
    type: ImportType,
): Promise<ImportJob> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
        `${env.NEXT_PUBLIC_API_BASE_URL}/admin/import?type=${encodeURIComponent(type)}`,
        {
            method: "POST",
            credentials: "include",
            body: formData,
        },
    );

    if (!res.ok) {
        let code = "internal_error";
        let message = res.statusText;
        try {
            const body = await res.json();
            code = body.error?.code ?? code;
            message = body.error?.message ?? message;
        } catch {
            // ignore
        }
        throw new APIError(res.status, code, message);
    }

    const body = await res.json();
    return body.data as ImportJob;
}

/**
 * Client-side getImportJob for refresh actions.
 */
export async function getImportJobClient(id: string): Promise<ImportJob> {
    const response = await fetchAPIClient<Envelope<ImportJob>>(
        `/admin/import/${id}`,
    );
    return response.data;
}