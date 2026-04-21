/**
 * User domain type.
 * Both POST /auth/login and GET /me return { data: User }.
 */
export type User = {
    id: string;
    email: string;
    name: string;
    auth_provider: "email" | "google";
    email_verified: boolean;
    degree_discipline: string | null;
    graduation_year: number | null;
    target_industries: string[];
    preferred_locations: string[];
    preferences: Record<string, unknown>;
    version: number;
    permissions: string[];
    created_at: string;
    updated_at: string;
};