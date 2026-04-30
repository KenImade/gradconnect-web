import { z } from "zod";

const currentYear = new Date().getFullYear();

/**
 * Each stage in the stage_breakdown array.
 * Required: stage_name. Optional: description, tips.
 * `order` is derived from array position at submission time.
 */
export const reviewStageSchema = z.object({
    stage_name: z
        .string()
        .min(1, "Stage name is required")
        .max(100, "Stage name is too long"),
    description: z.string().max(1000, "Description is too long").optional(),
    tips: z.string().max(1000, "Tips are too long").optional(),
});

export const reviewSubmitSchema = z.object({
    employer_id: z
        .string()
        .uuid("An employer must be selected"),
    programme_name: z
        .string()
        .min(3, "Programme name is required")
        .max(255, "Programme name is too long"),
    application_year: z
        .string()
        .refine((val) => {
            const n = parseInt(val, 10);
            return !isNaN(n) && n >= 2015 && n <= currentYear;
        }, { message: `Enter a year between 2015 and ${currentYear}` }),
    outcome: z.enum(["offer", "waitlisted", "rejected", "withdrew"], {
        message: "Pick an outcome",
    }),
    difficulty_rating: z
        .number({ message: "Rate the difficulty" })
        .int()
        .min(1, "Rate the difficulty")
        .max(5),
    experience_rating: z
        .number({ message: "Rate your experience" })
        .int()
        .min(1, "Rate your experience")
        .max(5),
    stage_breakdown: z
        .array(reviewStageSchema)
        .min(1, "Add at least one stage"),
    tips: z.string().max(5000, "Tips are too long").optional(),
    degree_discipline: z
        .string()
        .max(255, "Too long")
        .optional(),
    university: z
        .string()
        .max(255, "Too long")
        .optional(),
});

export type ReviewFormInput = z.infer<typeof reviewSubmitSchema>;