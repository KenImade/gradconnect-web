"use client";

import { env } from "@/lib/config";
import { APIError } from "../errors";

export type UploadedLogo = {
    url: string;
    key: string;
};

/**
 * POST /admin/uploads/logo — multipart upload.
 *
 * Cannot use fetchAPIClient because that wrapper sets Content-Type: application/json
 * and JSON.stringifies the body. Multipart needs the browser to set its own
 * Content-Type with boundary. We replicate the credentials + error-envelope
 * handling from fetchAPIClient inline.
 */
export async function uploadLogo(file: File): Promise<UploadedLogo> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/admin/uploads/logo`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    if (!res.ok) {
        let code = "internal_error";
        let message = res.statusText;
        let details: Array<{ field: string; message: string }> | undefined;

        try {
            const body = await res.json();
            code = body.error?.code ?? code;
            message = body.error?.message ?? message;
            details = body.error?.details;
        } catch {
            // Non-JSON response — keep defaults
        }

        throw new APIError(res.status, code, message, details);
    }

    const body = await res.json();
    return body.data as UploadedLogo;
}