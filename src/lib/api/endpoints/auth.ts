import { fetchAPIClient } from "../client";

/**
 * POST /auth/logout — destroy the current session.
 * Client-side only: this is called from the header menu, not server components.
 * The backend clears the session cookie via Set-Cookie: session_id=; Max-Age=0.
 */
export async function logout(): Promise<void> {
    await fetchAPIClient("/auth/logout", {
        method: "POST",
    });
}