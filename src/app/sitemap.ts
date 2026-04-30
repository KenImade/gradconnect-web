import type { MetadataRoute } from "next";
import { absoluteUrl, PUBLIC_STATIC_ROUTES } from "@/lib/seo/config";

// Regenerate the sitemap hourly. New content appears in search within an hour.
export const revalidate = 3600;

// Cookieless API base for sitemap fetches. Falls back to localhost for dev.
const API_BASE =
    (process.env.API_BASE_URL ?? "http://127.0.0.1:4000/api/v1").replace(/\/$/, "");

type EmployerSummary = {
    id: string;
    slug: string;
    updated_at?: string;
};

type OpportunitySummary = {
    id: string;
    slug: string;
    status: string;
    created_at: string;
};

type Pagination = {
    last_page: number;
};

type PaginatedResponse<T> = {
    data: T[];
    pagination: Pagination;
};

async function fetchPublicEmployers(
    page: number,
    pageSize: number,
): Promise<PaginatedResponse<EmployerSummary>> {
    const res = await fetch(
        `${API_BASE}/employers?page=${page}&page_size=${pageSize}`,
        { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error(`employers fetch failed: ${res.status}`);
    return res.json();
}

async function fetchPublicOpportunities(
    page: number,
    pageSize: number,
): Promise<PaginatedResponse<OpportunitySummary>> {
    const res = await fetch(
        `${API_BASE}/opportunities?page=${page}&page_size=${pageSize}&status=open_or_upcoming`,
        { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error(`opportunities fetch failed: ${res.status}`);
    return res.json();
}

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

async function fetchAllEmployers(): Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = [];
    const PAGE_SIZE = 100;
    let page = 1;

    try {
        while (true) {
            const { data, pagination } = await fetchPublicEmployers(page, PAGE_SIZE);

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
            if (page > 50) break; // safety cap (5,000 employers)
        }
    } catch (err) {
        console.error("sitemap: failed to fetch employers", err);
    }

    return entries;
}

async function fetchAllOpportunities(): Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = [];
    const PAGE_SIZE = 100;
    let page = 1;

    try {
        while (true) {
            const { data, pagination } = await fetchPublicOpportunities(page, PAGE_SIZE);

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