import type { User } from "@/lib/api/endpoints/users.types";

/**
 * Whether a user has filled in their optional profile fields.
 * Used to show / hide onboarding prompts on the dashboard.
 */
export function isProfileComplete(user: User): boolean {
    return Boolean(
        user.degree_discipline &&
        user.graduation_year &&
        user.target_industries.length > 0 &&
        user.preferred_locations.length > 0,
    );
}

/**
 * Human-readable list of missing profile fields.
 * Example: ['degree', 'target industries']
 */
export function missingProfileFields(user: User): string[] {
    const missing: string[] = [];
    if (!user.degree_discipline) missing.push("degree");
    if (!user.graduation_year) missing.push("graduation year");
    if (user.target_industries.length === 0) missing.push("target industries");
    if (user.preferred_locations.length === 0) missing.push("preferred locations");
    return missing;
}