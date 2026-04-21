import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api/endpoints/users";
import type { User } from "@/lib/api/endpoints/users.types";

/**
 * Get the current user, or null if not signed in.
 * Wrapped in React cache() so repeated calls in a single request
 * reuse the same fetch (layout + page both call this).
 */
export const getSession = cache(async (): Promise<User | null> => {
    return getCurrentUser();
});

/**
 * Get the current user or redirect to login.
 * For use in protected page layouts and route handlers.
 */
export async function requireSession(
    redirectTo = "/login",
): Promise<User> {
    const user = await getSession();
    if (!user) {
        redirect(redirectTo);
    }
    return user;
}

/**
 * Get the current user or redirect if not verified.
 * For use on pages where the user must have a verified email.
 */
export async function requireVerifiedSession(): Promise<User> {
    const user = await requireSession();
    if (!user.email_verified) {
        redirect("/verify-email");
    }
    return user;
}