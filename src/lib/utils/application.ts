import type { ApplicationStatus } from "@/lib/api/endpoints/applications.types";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
    "interested",
    "applied",
    "assessment",
    "interview",
    "offer",
    "rejected",
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
    interested: "Interested",
    applied: "Applied",
    assessment: "Assessment",
    interview: "Interview",
    offer: "Offer",
    rejected: "Rejected",
};

/**
 * Short one-liner describing what each status means, shown as a column caption.
 */
export const STATUS_HINTS: Record<ApplicationStatus, string> = {
    interested: "Programmes you're considering",
    applied: "Application submitted, waiting to hear",
    assessment: "Aptitude test or take-home in progress",
    interview: "Scheduled or completed an interview",
    offer: "Received an offer",
    rejected: "Unsuccessful or withdrew",
};

/**
 * Colors for status column accents. Kept minimal — the whole page can feel
 * like one big banner of colors if each column is strongly tinted.
 * Only "offer" and "rejected" get semantic color; the middle statuses stay neutral.
 */
export const STATUS_ACCENT: Record<ApplicationStatus, string> = {
    interested: "border-border",
    applied: "border-border",
    assessment: "border-border",
    interview: "border-border",
    offer: "border-success",
    rejected: "border-destructive",
};