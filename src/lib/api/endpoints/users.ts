import { fetchAPIClient } from "../client";
import type { Envelope } from "../envelope";
import type { User } from "./users.types";
import { normalize, type RawUser } from "./users.shared";

export type UpdateProfileInput = Partial<{
    first_name: string;
    last_name: string;
    degree_discipline: string | null;
    graduation_year: number | null;
    target_industries: string[];
    preferred_locations: string[];
}>;

/**
 * PATCH /me — client-side. Last-write-wins.
 */
export async function updateProfile(input: UpdateProfileInput): Promise<User> {
    const response = await fetchAPIClient<Envelope<RawUser>>("/me", {
        method: "PATCH",
        body: JSON.stringify(input),
    });
    return normalize(response.data);
}