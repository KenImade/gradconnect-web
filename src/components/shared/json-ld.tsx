import "server-only";

type Props = {
    data: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Inject JSON-LD structured data into the document.
 * Server component — renders raw JSON via dangerouslySetInnerHTML, the standard
 * pattern for structured data. Safe because data is stringified server-side from
 * typed objects, not user input.
 *
 * Accepts a single schema object or an array of schemas (e.g., a JobPosting plus
 * a BreadcrumbList on the same page).
 */
export function JsonLd({ data }: Props) {
    const payload = Array.isArray(data) ? data : [data];

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(payload),
            }}
        />
    );
}