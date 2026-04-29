import { z } from "zod";

const OPPORTUNITY_TYPES = [
    "graduate_trainee",
    "internship",
    "nysc",
    "industrial_attachment",
] as const;

const currentYear = new Date().getFullYear();

const urlOrEmpty = z
    .string()
    .max(512)
    .refine(
        (v) => v === "" || /^https?:\/\//i.test(v),
        "Must be a URL starting with http:// or https://",
    );

const httpUrl = z
    .string()
    .min(1, "URL is required")
    .max(512)
    .refine(
        (v) => /^https?:\/\//i.test(v),
        "Must be a URL starting with http:// or https://",
    );

export const opportunityFormSchema = z
    .object({
        employer_id: z.string().uuid("Pick an employer"),
        title: z.string().min(1, "Title is required").max(255),
        slug: z
            .string()
            .min(2, "Slug is required")
            .max(255)
            .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
        type: z.enum(OPPORTUNITY_TYPES, {
            message: "Pick a type",
        }),
        intake_year: z
            .string()
            .refine((v) => {
                const n = parseInt(v, 10);
                return !isNaN(n) && n >= currentYear - 1 && n <= currentYear + 5;
            }, `Year must be between ${currentYear - 1} and ${currentYear + 5}`),
        description: z.string().min(1, "Description is required").max(10000),
        requirements: z.string().max(5000).optional(),
        location: z.string().min(1, "Location is required").max(255),
        discipline_tags: z.array(z.string().min(1)).max(20),
        opens_at: z.string().optional(), // ISO date string from <input type="date">
        deadline: z.string().optional(),
        application_url: httpUrl,
        source_url: urlOrEmpty.optional(),
    })
    .refine(
        (data) => {
            if (!data.opens_at || !data.deadline) return true;
            return new Date(data.opens_at) <= new Date(data.deadline);
        },
        { message: "Deadline must be after opens_at", path: ["deadline"] },
    );

export type OpportunityFormInput = z.infer<typeof opportunityFormSchema>;
export const OPPORTUNITY_TYPE_OPTIONS = OPPORTUNITY_TYPES;