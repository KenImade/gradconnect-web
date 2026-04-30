import { SITE, absoluteUrl } from "./config";
import type { Opportunity } from "@/lib/api/endpoints/opportunities.types";
import type { Employer } from "@/lib/api/endpoints/employers.types";

/**
 * Schema.org Organization for an employer.
 * Tells Google "this is a company" — eligible for sitelinks searchbox,
 * logo in knowledge panel, etc.
 */
export function employerOrganizationSchema(employer: Employer) {
    const url = absoluteUrl(`/employers/${employer.slug}`);

    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": url,
        name: employer.name,
        url: employer.website ?? url,
        sameAs: employer.website ? [employer.website] : undefined,
    };

    if (employer.logo_url) {
        schema.logo = employer.logo_url;
    }

    if (employer.industry) {
        schema.industry = employer.industry;
    }

    if (employer.overview) {
        schema.description = employer.overview;
    }

    if (employer.hq_location) {
        schema.address = {
            "@type": "PostalAddress",
            addressLocality: employer.hq_location,
            addressCountry: "NG",
        };
    }

    // Add social profiles to sameAs
    const sameAs: string[] = employer.website ? [employer.website] : [];
    if (employer.social_links) {
        const social = employer.social_links as Record<string, string>;
        if (social.linkedin) sameAs.push(social.linkedin);
        if (social.twitter) sameAs.push(social.twitter);
        if (social.instagram) sameAs.push(social.instagram);
    }
    if (sameAs.length > 0) {
        schema.sameAs = sameAs;
    }

    return schema;
}

/**
 * Schema.org JobPosting for an opportunity.
 * Eligible for Google for Jobs surface — high-value placement.
 */
export function opportunityJobPostingSchema(opportunity: Opportunity) {
    const url = absoluteUrl(`/opportunities/${opportunity.slug}`);
    const employerUrl = absoluteUrl(`/employers/${opportunity.employer.slug}`);

    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "@id": url,
        title: opportunity.title,
        description: htmlEscape(opportunity.description),
        datePosted: opportunity.created_at,
        employmentType: mapTypeToEmploymentType(opportunity.type),
        directApply: false,
        url,
        hiringOrganization: {
            "@type": "Organization",
            "@id": employerUrl,
            name: opportunity.employer.name,
            sameAs: employerUrl,
            logo: opportunity.employer.logo_url ?? undefined,
        },
        jobLocation: {
            "@type": "Place",
            address: {
                "@type": "PostalAddress",
                addressLocality: opportunity.location,
                addressCountry: "NG",
            },
        },
    };

    if (opportunity.deadline) {
        // Google for Jobs uses validThrough as the close date
        schema.validThrough = `${opportunity.deadline}T23:59:59+01:00`;
    }

    if (opportunity.requirements) {
        schema.qualifications = opportunity.requirements;
    }

    // Industry / discipline as occupational categories
    if (opportunity.discipline_tags && opportunity.discipline_tags.length > 0) {
        schema.occupationalCategory = opportunity.discipline_tags.join(", ");
    }

    return schema;
}

/**
 * Schema.org BreadcrumbList — tells Google the page hierarchy.
 * Renders as breadcrumb path in search results.
 */
export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: crumb.name,
            item: crumb.url,
        })),
    };
}

/**
 * Map our opportunity type enum to Schema.org employmentType values.
 * Schema.org accepts: FULL_TIME, PART_TIME, CONTRACTOR, TEMPORARY, INTERN, VOLUNTEER, PER_DIEM, OTHER
 */
function mapTypeToEmploymentType(type: string): string {
    switch (type) {
        case "graduate_trainee":
            return "FULL_TIME";
        case "internship":
        case "industrial_attachment":
            return "INTERN";
        case "nysc":
            return "TEMPORARY"; // NYSC is a 1-year service year
        default:
            return "OTHER";
    }
}

function htmlEscape(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}