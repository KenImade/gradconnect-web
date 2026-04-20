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
    let code = "internal_error";
    let message = res.statusText;
    let details: Array<{ field: string; message: string }> | undefined;

    try {
      const body = await res.json();
      code = body.error?.code ?? code;
      message = body.error?.message ?? message;
      details = body.error?.details;
    } catch {
      // Non-JSON error — keep defaults
    }

    const error = new APIError(res.status, code, message, details);

    // Verification-gate interception: broadcast a global event that the
    // VerificationModal listener will pick up. Caller still receives the
    // thrown error so it can stop its own flow.
    if (res.status === 403 && code === "email_verfification_required") {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("gradconnect:verification-required"));
      }
    }

    throw error;
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
