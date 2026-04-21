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
      // Two possible error envelopes:
      //   { error: { code, message, details? } }  — standard
      //   { error: "string" }                     — some backend 404s
      if (typeof body?.error === "string") {
        message = body.error;
      } else if (body?.error) {
        code = body.error.code ?? code;
        message = body.error.message ?? message;
        details = body.error.details;
      }
    } catch {
      // no JSON body, keep defaults
    }

    throw new APIError(res.status, code, message, details);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}