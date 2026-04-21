import { fetchAPI } from "../server";
import type { Envelope } from "../envelope";
import type { User } from "./users.types";

/**
 * Defensive normalization for optional/nullable array and object fields.
 * The backend may return null where we expect [] or {}.
 */
function normalize(raw: User): User {
    return {
        ...raw,
        target_industries: raw.target_industries ?? [],
        preferred_locations: raw.preferred_locations ?? [],
        preferences: raw.preferences ?? {},
        permissions: raw.permissions ?? [],
    };
}

/**
 * GET /me — fetch the current user from the session cookie.
 * Returns null if the session is invalid or missing (401).
 */
export async function getCurrentUser(): Promise<User | null> {
    try {
        const response = await fetchAPI<Envelope<User>>("/me");
        return normalize(response.data);
    } catch (err: unknown) {
        if (err && typeof err === "object" && "status" in err && err.status === 401) {
            return null;
        }
        throw err;
    }
}