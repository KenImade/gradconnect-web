import { z } from "zod";

export const employerFiltersSchema = z.object({
    q: z.string().optional(),
    industry: z.string().optional(),
    is_verified: z
        .union([z.literal("true"), z.literal("false")])
        .optional()
        .transform((v) => (v === "true" ? true : v === "false" ? false : undefined)),
    sort: z.enum(["name", "created_at"]).optional().default("name"),
    order: z.enum(["asc", "desc"]).optional().default("asc"),
    page: z.coerce.number().int().positive().optional().default(1),
});

export type EmployerFilters = z.infer<typeof employerFiltersSchema>;

/**
 * Parse raw URL searchParams into a validated filter object.
 * Invalid values fall through to defaults rather than throwing.
 */
export function parseEmployerFilters(
    searchParams: Record<string, string | string[] | undefined>,
): EmployerFilters {
    // Flatten string[] to string (take first value if user sends duplicates)
    const normalized: Record<string, string | undefined> = {};
    for (const [key, value] of Object.entries(searchParams)) {
        if (Array.isArray(value)) {
            normalized[key] = value[0];
        } else {
            normalized[key] = value;
        }
    }

    const result = employerFiltersSchema.safeParse(normalized);
    return result.success
        ? result.data
        : employerFiltersSchema.parse({}); // fall back to defaults
}