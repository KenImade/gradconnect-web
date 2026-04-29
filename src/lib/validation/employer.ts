import { z } from "zod";
import { INDUSTRIES } from "@/lib/data/industries";

const SIZES = ["1-50", "51-200", "201-1000", "1000+"] as const;

const officeSchema = z.object({
    city: z.string().min(1, "City required").max(100),
    state: z.string().min(1, "State required").max(100),
    address: z.string().min(1, "Address required").max(255),
});

const urlOrEmpty = z
    .string()
    .max(512)
    .refine(
        (v) => v === "" || /^https?:\/\//i.test(v),
        "Must be a URL starting with http:// or https://",
    );

export const employerFormSchema = z.object({
    name: z.string().min(1, "Name is required").max(255),
    slug: z
        .string()
        .min(2, "Slug is required")
        .max(255)
        .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
    industry: z.string().min(1, "Industry is required").max(100),
    size: z.enum(SIZES).or(z.literal("")).optional(),
    hq_location: z.string().max(255).optional(),
    offices: z.array(officeSchema),
    logo_url: urlOrEmpty.optional(),
    overview: z.string().max(5000, "Too long").optional(),
    culture: z.string().max(5000, "Too long").optional(),
    website: urlOrEmpty.optional(),
    social_linkedin: urlOrEmpty.optional(),
    social_twitter: urlOrEmpty.optional(),
    social_instagram: urlOrEmpty.optional(),
    is_verified: z.boolean(),
});

export type EmployerFormInput = z.infer<typeof employerFormSchema>;

export const SIZE_OPTIONS = SIZES;
export const INDUSTRY_OPTIONS = INDUSTRIES;