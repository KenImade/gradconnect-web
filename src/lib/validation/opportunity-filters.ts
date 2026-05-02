import { z } from "zod";

export const opportunityFiltersSchema = z.object({
    q: z.string().optional(),
    type: z
        .enum(["graduate_trainee", "internship", "nysc", "industrial_attachment"])
        .optional(),
    status: z
        .enum(["open", "upcoming", "open_or_upcoming"])
        .optional()
        .default("open_or_upcoming"),
    intake_year: z.coerce.number().int().optional(),
    industry: z.string().optional(),
    employer: z.string().optional(),
    location: z.string().optional(),
    discipline: z.string().optional(),
    sort: z
        .enum(["deadline", "opens_at", "created_at", "title"])
        .optional()
        .default("deadline"),
    order: z.enum(["asc", "desc"]).optional().default("asc"),
    page: z.coerce.number().int().positive().optional().default(1),
});

export type OpportunityFilters = z.infer<typeof opportunityFiltersSchema>;

export function parseOpportunityFilters(
    searchParams: Record<string, string | string[] | undefined>,
): OpportunityFilters {
    const normalized: Record<string, string | undefined> = {};
    for (const [key, value] of Object.entries(searchParams)) {
        normalized[key] = Array.isArray(value) ? value[0] : value;
    }

    const result = opportunityFiltersSchema.safeParse(normalized);
    return result.success
        ? result.data
        : opportunityFiltersSchema.parse({});
}