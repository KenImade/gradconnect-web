import { z } from "zod";

const currentYear = new Date().getFullYear();

export const profileSchema = z.object({
    first_name: z
        .string()
        .min(1, "First name is required")
        .max(100, "First name is too long"),
    last_name: z
        .string()
        .min(1, "Last name is required")
        .max(100, "Last name is too long"),
    degree_discipline: z.string().max(100, "Too long").optional(),
    graduation_year: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (!val) return true; // empty is allowed
                const n = parseInt(val, 10);
                return !isNaN(n) && n >= 1980 && n <= currentYear + 10;
            },
            { message: "Enter a valid year" },
        ),
    target_industries: z.array(z.string().min(1)).max(10, "Pick up to 10 industries"),
    preferred_locations: z.array(z.string().min(1)).max(10, "Pick up to 10 locations"),
});

export type ProfileInput = z.infer<typeof profileSchema>;