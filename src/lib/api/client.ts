"use client";

import { env } from "@/lib/config";
import { APIError } from "./errors";

type FetchOptions = Omit<RequestInit, "credentials">;

/**
 * Browser-side fetch wrapper.
 * - Sends session_id cookie automatically via credentials: "include"
 * - Parses backend error envelope into typed APIError
 * - Emits a global event on 403 email_verification_required so a top-level
 *   listener can open the verification modal without every caller needing
 *   to handle it explicitly
 */
export async function fetchAPIClient<T>(path: string, options?: FetchOptions): Promise<T> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let code = "api_error";
    let message = res.statusText;
    let details: Array<{ field: string; message: string }> | undefined;

    try {
      const body = await res.json();

      if (typeof body?.error === "string") {
        // 404-style: { error: "string" }
        message = body.error;
      } else if (body?.error && typeof body.error === "object") {
        if ("code" in body.error || "message" in body.error) {
          // Structured shape: { error: { code, message, details } }
          code = body.error.code ?? code;
          message = body.error.message ?? message;
          details = body.error.details;
        } else {
          // Field-error shape: { error: { fieldA: "msg", fieldB: "msg" } }
          // Turn it into `details` + pick the first as message.
          code = "validation_error";
          const entries = Object.entries(body.error).filter(
            ([, v]) => typeof v === "string",
          ) as Array<[string, string]>;
          details = entries.map(([field, msg]) => ({ field, message: msg }));
          message = details[0]?.message ?? message;
        }
      }
    } catch {
      // no JSON body, keep defaults
    }

    throw new APIError(res.status, code, message, details);
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
