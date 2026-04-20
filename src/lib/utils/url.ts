/**
 * Build a URL query string from a params object, omitting undefined/null/empty values.
 * Returns an empty string (not "?") if no params are set.
 */
export function buildQueryString(
    params: Record<string, string | number | boolean | null | undefined>,
): string {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === "") continue;
        searchParams.set(key, String(value));
    }

    const qs = searchParams.toString();
    return qs ? `?${qs}` : "";
}