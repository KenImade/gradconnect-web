/**
 * Canonical industry list. Keep in sync with employer seed data and admin form dropdowns.
 * This is intentionally curated — free-text industries would fragment the filter UX.
 */
export const INDUSTRIES = [
    "Banking & Finance",
    "Oil & Gas",
    "FMCG",
    "Professional Services",
    "Technology & Fintech",
    "Telecommunications",
    "Manufacturing & FMCG",
    "Consulting",
    "Insurance",
    "Healthcare & Pharma",
    "Retail",
    "Media & Entertainment",
    "Logistics & Transport",
    "Real Estate",
    "Agriculture",
] as const;

export type Industry = (typeof INDUSTRIES)[number];