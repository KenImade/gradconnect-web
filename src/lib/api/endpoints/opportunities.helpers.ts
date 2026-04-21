import { listOpportunities } from "./opportunities";
import type { Opportunity } from "./opportunities.types";

/**
 * Find up to `limit` related opportunities by industry.
 * Used on opportunity detail pages.
 */
export async function getRelatedOpportunities(
    current: Opportunity,
    limit = 3,
): Promise<Opportunity[]> {
    try {
        const { data } = await listOpportunities({
            industry: current.employer.industry,
            status: "open",
            page_size: limit + 3,
        });

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

/**
 * Fetch opportunities matching a user's target industries.
 * Runs one request per industry (API doesn't accept multi-industry filter yet),
 * dedupes, limits to `limit` total. Returns the freshest open listings first.
 */
export async function getRecommendedOpportunities(
    industries: string[],
    limit = 6,
): Promise<Opportunity[]> {
    if (industries.length === 0) return [];

    try {
        // Fire all industry queries in parallel.
        const perIndustryLimit = Math.max(3, Math.ceil((limit * 2) / industries.length));
        const results = await Promise.all(
            industries.map((industry) =>
                listOpportunities({
                    industry,
                    status: "open",
                    sort: "deadline",
                    order: "asc",
                    page_size: perIndustryLimit,
                }).catch(() => ({ data: [] as Opportunity[] })),
            ),
        );

        // Flatten, dedupe by id, keep the deadline-sorted order.
        const seen = new Set<string>();
        const flat: Opportunity[] = [];
        for (const result of results) {
            for (const opp of result.data) {
                if (!seen.has(opp.id)) {
                    seen.add(opp.id);
                    flat.push(opp);
                }
            }
        }

        // Re-sort the combined set by deadline ascending.
        flat.sort((a, b) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return a.deadline.localeCompare(b.deadline);
        });

        return flat.slice(0, limit);
    } catch {
        return [];
    }
}

/**
 * Fetch the N opportunities closing soonest across the platform.
 * Used on the dashboard for urgency-driven discovery.
 */
export async function getUrgentOpportunities(
    limit = 4,
): Promise<Opportunity[]> {
    try {
        const { data } = await listOpportunities({
            status: "open",
            sort: "deadline",
            order: "asc",
            page_size: limit,
        });
        return data;
    } catch {
        return [];
    }
}