import type { MetadataRoute } from "next";
import { SITE, absoluteUrl, PUBLIC_STATIC_ROUTES } from "@/lib/seo/config";
import { listEmployers } from "@/lib/api/endpoints/employers.server";
import { listOpportunities } from "@/lib/api/endpoints/opportunities";

// Regenerate the sitemap hourly. New content appears in search within an hour.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    // Static pages — exclude auth pages (also robots-blocked)
    const staticEntries: MetadataRoute.Sitemap = PUBLIC_STATIC_ROUTES
        .filter((path) => !["/login", "/register"].includes(path))
        .map((path) => ({
            url: absoluteUrl(path),
            lastModified: now,
            changeFrequency: path === "/" ? "daily" : "weekly",
            priority: path === "/" ? 1.0 : 0.8,
        }));

    // Dynamic content — fetched in parallel, partial fallback on failure
    const [employerEntries, opportunityEntries] = await Promise.all([
        fetchAllEmployers(),
        fetchAllOpportunities(),
    ]);

    return [...staticEntries, ...employerEntries, ...opportunityEntries];
}

/**
 * Paginate through all employers. Each employer contributes 3 sitemap entries:
 * the hub, /process, and /reviews.
 */
async function fetchAllEmployers(): Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = [];
    const PAGE_SIZE = 100;
    let page = 1;

    try {
        while (true) {
            const { data, pagination } = await listEmployers({
                page,
                page_size: PAGE_SIZE,
            });

            for (const employer of data) {
                const baseUrl = absoluteUrl(`/employers/${employer.slug}`);

                entries.push(
                    {
                        url: baseUrl,
                        changeFrequency: "weekly",
                        priority: 0.7,
                    },
                    {
                        url: `${baseUrl}/process`,
                        changeFrequency: "monthly",
                        priority: 0.5,
                    },
                    {
                        url: `${baseUrl}/reviews`,
                        changeFrequency: "weekly",
                        priority: 0.6,
                    },
                );
            }

            if (page >= pagination.last_page) break;
            page += 1;

            // Safety cap — at 100/page that's 5,000 employers
            if (page > 50) break;
        }
    } catch (err) {
        console.error("sitemap: failed to fetch employers", err);
        // Continue with what we have rather than 500-ing the whole sitemap
    }

    return entries;
}

/**
 * Paginate through opportunities. Only index actively-recruiting listings.
 * Closed and withdrawn don't waste crawl budget.
 */
async function fetchAllOpportunities(): Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = [];
    const PAGE_SIZE = 100;
    let page = 1;

    try {
        while (true) {
            const { data, pagination } = await listOpportunities({
                page,
                page_size: PAGE_SIZE,
                status: "open_or_upcoming",
            });

            for (const opportunity of data) {
                entries.push({
                    url: absoluteUrl(`/opportunities/${opportunity.slug}`),
                    lastModified: new Date(opportunity.created_at),
                    changeFrequency: "weekly",
                    priority: opportunity.status === "open" ? 0.9 : 0.7,
                });
            }

            if (page >= pagination.last_page) break;
            page += 1;
            if (page > 50) break;
        }
    } catch (err) {
        console.error("sitemap: failed to fetch opportunities", err);
    }

    return entries;
}