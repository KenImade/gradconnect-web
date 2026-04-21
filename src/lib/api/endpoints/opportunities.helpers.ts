import { listOpportunities } from "./opportunities";
import type { Opportunity } from "./opportunities.types";

/**
 * Find up to `limit` related opportunities:
 *   1. Other open opportunities from the same employer (excluding the current one)
 *   2. Fallback: other open opportunities in the same industry
 */
export async function getRelatedOpportunities(
    current: Opportunity,
    limit = 3,
): Promise<Opportunity[]> {
    // Strategy 1: same employer, open status
    // We query by the employer's industry filter as a proxy since the API
    // doesn't expose an employer_id filter on the public opportunities endpoint.
    // This could be improved by adding that filter to the backend later.
    try {
        const { data } = await listOpportunities({
            industry: current.employer.industry,
            status: "open",
            page_size: limit + 3, // over-fetch to allow dedup
        });

        // Prioritize same-employer first, then same-industry
        const sameEmployer = data.filter(
            (o) => o.employer.slug === current.employer.slug && o.id !== current.id,
        );
        const sameIndustry = data.filter(
            (o) => o.employer.slug !== current.employer.slug && o.id !== current.id,
        );

        return [...sameEmployer, ...sameIndustry].slice(0, limit);
    } catch {
        return [];
    }
}