import type {
    OpportunityType,
    OpportunityStoredStatus,
} from "@/lib/api/endpoints/opportunities.types";

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
    graduate_trainee: "Graduate Trainee",
    internship: "Internship",
    nysc: "NYSC",
    industrial_attachment: "Industrial Attachment",
};

export const OPPORTUNITY_STATUS_LABELS: Record<OpportunityStoredStatus, string> = {
    upcoming: "Upcoming",
    open: "Open",
    closed: "Closed",
    withdrawn: "Withdrawn",
};

/**
 * Format a deadline into a short relative label.
 * Backend provides days_remaining already — we just pick the display.
 */
export function formatDeadlineLabel(daysRemaining: number | null): string | null {
    if (daysRemaining === null) return null;
    if (daysRemaining < 0) return "Closed";
    if (daysRemaining === 0) return "Closes today";
    if (daysRemaining === 1) return "1 day left";
    if (daysRemaining <= 7) return `${daysRemaining} days left`;
    if (daysRemaining <= 30) return `${daysRemaining} days left`;
    if (daysRemaining <= 60) return `${Math.round(daysRemaining / 7)} weeks left`;
    return `${Math.round(daysRemaining / 30)} months left`;
}

/**
 * Pick the color intensity for the deadline indicator.
 * Shifts from neutral -> warning -> danger as the deadline approaches.
 */
export function deadlineSeverity(
    daysRemaining: number | null,
): "neutral" | "warning" | "danger" | "muted" {
    if (daysRemaining === null) return "muted";
    if (daysRemaining < 0) return "muted";
    if (daysRemaining <= 2) return "danger";
    if (daysRemaining <= 7) return "warning";
    return "neutral";
}