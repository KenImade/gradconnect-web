/**
 * Date formatting helpers. All inputs are ISO 8601 strings (UTC) from the API.
 * All outputs use the user's local timezone via the browser's Intl APIs.
 */

/**
 * Format as a date and time, e.g. "13 Apr 2026, 14:30".
 * Used in admin tables and timestamps where precision matters.
 */
export function formatDateTime(iso: string): string {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}

/**
 * Format as a short date, e.g. "13 Apr 2026".
 */
export function formatDate(iso: string): string {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

/**
 * Relative time, e.g. "2 hours ago", "in 3 days". Uses Intl.RelativeTimeFormat.
 * Useful for "Started 5 minutes ago" labels on import jobs and reviews.
 */
export function formatRelative(iso: string, now: Date = new Date()): string {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return "—";

    const diffSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
    const absSeconds = Math.abs(diffSeconds);

    const formatter = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });

    if (absSeconds < 60) return formatter.format(diffSeconds, "second");
    if (absSeconds < 3600) return formatter.format(Math.round(diffSeconds / 60), "minute");
    if (absSeconds < 86400) return formatter.format(Math.round(diffSeconds / 3600), "hour");
    if (absSeconds < 2592000) return formatter.format(Math.round(diffSeconds / 86400), "day");
    if (absSeconds < 31536000) return formatter.format(Math.round(diffSeconds / 2592000), "month");
    return formatter.format(Math.round(diffSeconds / 31536000), "year");
}

/**
 * Days remaining until a date, e.g. for opportunity deadlines.
 * Returns null if the input is null. Negative if past.
 */
export function daysRemaining(iso: string | null): number | null {
    if (!iso) return null;
    const target = new Date(iso);
    if (isNaN(target.getTime())) return null;

    const now = new Date();
    const msPerDay = 86400000;
    return Math.ceil((target.getTime() - now.getTime()) / msPerDay);
}