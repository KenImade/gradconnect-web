export const SITE = {
    url: "https://gradconnect.ng",
    name: "GradConnect",
    description:
        "Nigeria's graduate career intelligence platform. Browse graduate programmes, internships, and NYSC roles with employer insights and assessment guides.",
    locale: "en_NG",
    twitter: "@gradconnectng", // adjust when you create the handle
} as const;

/**
 * Build an absolute URL from a path.
 * Used in sitemap, canonical, and OG tags.
 */
export function absoluteUrl(path: string): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${SITE.url}${cleanPath}`;
}

/**
 * Pages that should be indexed on the sitemap and crawled.
 * Used to centralize the public surface area.
 */
export const PUBLIC_STATIC_ROUTES = [
    "/",
    "/employers",
    "/opportunities",
    "/login",
    "/register",
] as const;