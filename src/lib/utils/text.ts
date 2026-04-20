/**
 * Generate initials from a name. "Access Bank" → "AB", "PwC" → "PW".
 * Always returns 1-2 uppercase characters.
 */
export function getInitials(name: string): string {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "?";
    if (words.length === 1) {
        const first = words[0];
        if (!first) return "?";
        return first.slice(0, 2).toUpperCase();
    }
    const first = words[0];
    const last = words[words.length - 1];
    if (!first || !last) return "?";
    return (first[0]! + last[0]!).toUpperCase();
}