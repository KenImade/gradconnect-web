import { fetchAPIClient } from "../client";
import type { User } from "./users.types";
import type { Envelope } from "../envelope";

/**
 * POST /auth/login — authenticate with email and password.
 * Server sets the session_id cookie via Set-Cookie.
 * Returns the user record.
 */
export async function login(input: {
    email: string;
    password: string;
}): Promise<User> {
    const response = await fetchAPIClient<Envelope<User>>("/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
    });
    return response.data;
}

export async function logout(): Promise<void> {
    await fetchAPIClient("/auth/logout", {
        method: "POST",
    });
}