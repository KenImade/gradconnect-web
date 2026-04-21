import "server-only";
import { cookies } from "next/headers";
import { serverEnv } from "@/lib/config.server";
import { APIError } from "./errors";

type FetchAPIOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export async function fetchAPI<T>(
  path: string,
  options: FetchAPIOptions = {},
): Promise<T> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session_id");

  const res = await fetch(`${serverEnv.API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(sessionCookie
        ? { Cookie: `session_id=${sessionCookie.value}` }
        : {}),
      ...options.headers,
    },
    cache: options.cache ?? "no-store",
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

  return res.json();
}