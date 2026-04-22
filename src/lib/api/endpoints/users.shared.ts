import type { User } from "./users.types";

/**
 * Raw user shape returned by /me, PATCH /me, login, and register.
 */
export type RawUser = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    auth_provider: "email" | "google";
    email_verified: boolean;
    degree_discipline: string | null;
    graduation_year: number | null;
    target_industries: string[] | null;
    preferred_locations: string[] | null;
    preferences: Record<string, unknown> | null;
    version: number;
    permissions?: string[] | null;
    created_at: string;
    updated_at: string;
};

export function normalize(raw: RawUser): User {
    const first = raw.first_name?.trim() ?? "";
    const last = raw.last_name?.trim() ?? "";
    const name = [first, last].filter(Boolean).join(" ") || raw.email;

    return {
        id: raw.id,
        email: raw.email,
        name,
        auth_provider: raw.auth_provider,
        email_verified: raw.email_verified,
        degree_discipline: raw.degree_discipline,
        graduation_year: raw.graduation_year,
        target_industries: raw.target_industries ?? [],
        preferred_locations: raw.preferred_locations ?? [],
        preferences: raw.preferences ?? {},
        version: raw.version,
        permissions: raw.permissions ?? [],
        created_at: raw.created_at,
        updated_at: raw.updated_at,
    };
}