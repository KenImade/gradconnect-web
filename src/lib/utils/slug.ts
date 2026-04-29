/**
 * Generate a URL slug from a free-text name.
 * Lowercase, strip non-alphanumeric, replace spaces with hyphens, collapse repeats.
 */
export function slugify(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}