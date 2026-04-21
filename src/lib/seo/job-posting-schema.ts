import type { Opportunity } from "@/lib/api/endpoints/opportunities.types";

/**
 * Build a Google-Jobs-compliant JobPosting structured data object.
 * Required fields per https://developers.google.com/search/docs/appearance/structured-data/job-posting:
 * - datePosted, description, hiringOrganization, jobLocation, title, validThrough.
 * Optional but high-value: employmentType, educationRequirements, applicantLocationRequirements.
 */
export function jobPostingSchema(opportunity: Opportunity, siteUrl: string) {
    const { employer } = opportunity;

    // Map our enum to Google's employmentType values
    const employmentTypeMap = {
        graduate_trainee: "FULL_TIME",
        internship: "INTERN",
        nysc: "CONTRACTOR",
        industrial_attachment: "INTERN",
    } as const;

    return {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: opportunity.title,
        description: opportunity.description,
        datePosted: opportunity.created_at,
        validThrough: opportunity.deadline ?? undefined,
        employmentType: employmentTypeMap[opportunity.type],
        hiringOrganization: {
            "@type": "Organization",
            name: employer.name,
            sameAs: `${siteUrl}/employers/${employer.slug}`,
            logo: employer.logo_url ?? undefined,
        },
        jobLocation: {
            "@type": "Place",
            address: {
                "@type": "PostalAddress",
                addressLocality: opportunity.location,
                addressCountry: "NG",
            },
        },
        applicantLocationRequirements: {
            "@type": "Country",
            name: "Nigeria",
        },
        directApply: false,
        url: `${siteUrl}/opportunities/${opportunity.slug}`,
        educationRequirements: opportunity.requirements ?? undefined,
    };
}