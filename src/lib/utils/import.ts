import type { ImportType } from "@/lib/api/endpoints/imports.types";

export const IMPORT_TYPE_LABELS: Record<ImportType, string> = {
    employers: "Employers",
    opportunities: "Opportunities",
    assessments: "Assessments",
};

/**
 * The CSV columns the backend's row processor expects, per import type.
 * Used in the UI to show admins what columns their CSV needs.
 */
export const IMPORT_TYPE_COLUMNS: Record<ImportType, string[]> = {
    employers: ["name", "slug", "industry", "size", "hq_location", "logo_url", "website"],
    opportunities: [
        "employer_slug",
        "title",
        "slug",
        "type",
        "intake_year",
        "description",
        "location",
        "application_url",
        "opens_at",
        "deadline",
        "is_active",
    ],
    assessments: ["employer_slug", "programme_type", "aptitude_test_provider", "interview_format", "timeline_weeks"],
};