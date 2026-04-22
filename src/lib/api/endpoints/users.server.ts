import "server-only";
import { fetchAPI } from "../server";
import type { Envelope } from "../envelope";
import type { User } from "./users.types";
import { normalize, type RawUser } from "./users.shared";

/**
 * GET /me — server-side only. Used by the session layer.
 * Returns null on 401.
 */
export async function getCurrentUser(): Promise<User | null> {
    try {
        const response = await fetchAPI<Envelope<RawUser>>("/me");
        return normalize(response.data);
    } catch (err: unknown) {
        if (err && typeof err === "object" && "status" in err && err.status === 401) {
            return null;
        }
        throw err;
    }
}