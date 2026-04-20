import { cookies } from "next/headers";
import { env } from "@/lib/config";
import { APIError } from "./errors";

type FetchOptions = RequestInit & {
    next?: { revalidate?: number | false; tags?: string[] };
};

/**
 * Server-side fetch wrapper.
 * - Forwards the session_id cookie to the Go API so authenticated requests work from Server Components
 * - Parses the backend's error envelope into a typed APIError
 * - Defaults to 60s revalidation; override per-call via options.next.revalidate
 */
export async function fetchAPI<T>(path: string, options?: FetchOptions): Promise<T> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session_id");

    const res = await fetch(`${env.API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(sessionCookie ? { Cookie: `session_id=${sessionCookie.value}` } : {}),
            ...options?.headers
        },
        next: { revalidate: 60, ...options?.next },
    });

    if (!res.ok) {
        let code = "internal_error";
        let message = res.statusText;
        let details: Array<{ field: string, message: string }> | undefined;

        try {
            const body = await res.json()
            code = body.error?.code ?? code;
            message = body.error?.message ?? message;
            details = body.error?.details;
        } catch {
            // Non-JSON error response — keep the defaults above
        }

        throw new APIError(res.status, code, message, details);
    }

    return res.json() as Promise<T>;
}