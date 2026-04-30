import { z } from "zod";

const STAGE_TYPES = [
    "form",
    "test",
    "interview",
    "assessment",
    "other",
] as const;

const stageSchema = z.object({
    order: z.number().int().min(1),
    stage_name: z
        .string()
        .min(1, "Stage name is required")
        .max(100, "Stage name too long"),
    stage_type: z.enum(STAGE_TYPES, { message: "Pick a stage type" }),
    description: z.string().max(2000, "Description too long").optional(),
});

export const assessmentFormSchema = z.object({
    employer_id: z.string().uuid("Pick an employer"),
    programme_type: z
        .string()
        .min(1, "Programme type is required")
        .max(100, "Too long"),
    stages: z
        .array(stageSchema)
        .min(1, "At least one stage required")
        .max(15, "Maximum 15 stages"),
    aptitude_test_provider: z.string().max(100).optional(),
    interview_format: z.string().max(255).optional(),
    timeline_weeks: z
        .string()
        .optional()
        .refine((v) => {
            if (!v || v === "") return true;
            const n = parseInt(v, 10);
            return !isNaN(n) && n > 0 && n <= 52;
        }, "Must be between 1 and 52"),
    prep_guide: z.string().max(10000, "Prep guide too long").optional(),
});

export type AssessmentFormInput = z.infer<typeof assessmentFormSchema>;
export const STAGE_TYPE_OPTIONS = STAGE_TYPES;