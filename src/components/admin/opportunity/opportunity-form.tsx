"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    opportunityFormSchema,
    type OpportunityFormInput,
    OPPORTUNITY_TYPE_OPTIONS,
} from "@/lib/validation/opportunity";
import { OPPORTUNITY_TYPE_LABELS } from "@/lib/utils/opportunity";
import { slugify } from "@/lib/utils/slug";
import { TagInput } from "@/components/shared/tag-input";
import {
    createOpportunity,
    updateOpportunity,
} from "@/lib/api/endpoints/admin-opportunities";
import { APIError } from "@/lib/api/errors";
import { EmployerSelect } from "./employer-select";
import type { Opportunity } from "@/lib/api/endpoints/opportunities.types";
import type { EmployerSummary } from "@/lib/api/endpoints/employers.types";

type Props = {
    initial?: Opportunity;
};

const COMMON_DISCIPLINES = [
    "Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Chemical Engineering",
    "Petroleum Engineering",
    "Computer Science",
    "Software Engineering",
    "Finance",
    "Accounting",
    "Economics",
    "Business Administration",
    "Marketing",
    "Human Resources",
    "Law",
    "Geosciences",
];

function defaultsFromOpportunity(o?: Opportunity): OpportunityFormInput {
    return {
        employer_id: o?.employer.id ?? "",
        title: o?.title ?? "",
        slug: o?.slug ?? "",
        type: (o?.type as OpportunityFormInput["type"]) ?? ("graduate_trainee" as const),
        intake_year: o?.intake_year ? String(o.intake_year) : String(new Date().getFullYear()),
        description: o?.description ?? "",
        requirements: o?.requirements ?? "",
        location: o?.location ?? "",
        discipline_tags: o?.discipline_tags ?? [],
        opens_at: o?.opens_at ? o.opens_at.slice(0, 10) : "",
        deadline: o?.deadline ? o.deadline.slice(0, 10) : "",
        application_url: o?.application_url ?? "",
        source_url: o?.source_url ?? "",
    };
}

export function OpportunityForm({ initial }: Props) {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const isEdit = Boolean(initial);

    const form = useForm<OpportunityFormInput>({
        resolver: zodResolver(opportunityFormSchema),
        defaultValues: defaultsFromOpportunity(initial),
    });

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting, isDirty },
    } = form;

    // Auto-slug from title on create.
    const slugOverriddenRef = useRef(isEdit);
    const titleValue = watch("title");
    useEffect(() => {
        if (slugOverriddenRef.current) return;
        if (!titleValue) return;
        setValue("slug", slugify(titleValue), { shouldDirty: true });
    }, [titleValue, setValue]);

    function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
        slugOverriddenRef.current = true;
        setValue("slug", e.target.value, {
            shouldDirty: true,
            shouldValidate: true,
        });
    }

    async function onSubmit(data: OpportunityFormInput) {
        setSubmitError(null);

        const payload = {
            employer_id: data.employer_id,
            title: data.title,
            slug: data.slug,
            type: data.type,
            intake_year: parseInt(data.intake_year, 10),
            description: data.description,
            ...(data.requirements ? { requirements: data.requirements } : {}),
            location: data.location,
            ...(data.discipline_tags.length > 0
                ? { discipline_tags: data.discipline_tags }
                : {}),
            ...(data.opens_at ? { opens_at: data.opens_at } : {}),
            ...(data.deadline ? { deadline: data.deadline } : {}),
            application_url: data.application_url,
            ...(data.source_url ? { source_url: data.source_url } : {}),
        };

        try {
            const result = isEdit
                ? await updateOpportunity(initial!.id, payload)
                : await createOpportunity(payload);

            toast.success(isEdit ? `Saved ${result.title}` : `Created ${result.title}`);
            router.push(`/admin/opportunities/${result.id}/edit`);
            router.refresh();
        } catch (err) {
            if (APIError.isAPIError(err)) {
                if (err.status === 422 && err.details) {
                    for (const [field, msg] of Object.entries(err.details)) {
                        form.setError(field as keyof OpportunityFormInput, {
                            type: "server",
                            message: String(msg),
                        });
                    }
                    setSubmitError("Check the highlighted fields.");
                } else if (err.status === 400) {
                    setSubmitError(err.message);
                } else {
                    setSubmitError(err.message || "Couldn't save. Try again.");
                }
            } else {
                setSubmitError("Network error. Check your connection.");
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
            {/* SECTION 1: Programme */}
            <section>
                <h2 className="font-display text-heading-lg text-admin-foreground">
                    Programme
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="block text-body-sm font-medium text-admin-foreground">
                            Employer
                        </label>
                        <div className="mt-1.5">
                            <Controller
                                name="employer_id"
                                control={control}
                                render={({ field }) => (
                                    <EmployerSelect
                                        value={field.value}
                                        onChange={field.onChange}
                                        initialEmployer={
                                            initial
                                                ? ({
                                                    id: initial.employer.id,
                                                    name: initial.employer.name,
                                                    slug: initial.employer.slug,
                                                    logo_url: initial.employer.logo_url,
                                                    industry: initial.employer.industry,
                                                } as EmployerSummary)
                                                : undefined
                                        }
                                        error={errors.employer_id?.message}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="title" className="block text-body-sm font-medium text-admin-foreground">
                            Title
                        </label>
                        <input
                            {...register("title")}
                            id="title"
                            type="text"
                            placeholder="Graduate Trainee Programme 2027"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                            aria-invalid={!!errors.title}
                        />
                        {errors.title && (
                            <p className="mt-1 text-caption text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="slug" className="block text-body-sm font-medium text-admin-foreground">
                            Slug
                            <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                                {isEdit ? "edits affect public URL" : "auto from title"}
                            </span>
                        </label>
                        <input
                            id="slug"
                            type="text"
                            value={watch("slug")}
                            onChange={handleSlugChange}
                            placeholder="company-gtp-2027"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md font-mono focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                            aria-invalid={!!errors.slug}
                        />
                        {errors.slug && (
                            <p className="mt-1 text-caption text-destructive">{errors.slug.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-body-sm font-medium text-admin-foreground">
                            Type
                        </label>
                        <select
                            {...register("type")}
                            id="type"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                            aria-invalid={!!errors.type}
                        >
                            {OPPORTUNITY_TYPE_OPTIONS.map((t) => (
                                <option key={t} value={t}>
                                    {OPPORTUNITY_TYPE_LABELS[t]}
                                </option>
                            ))}
                        </select>
                        {errors.type && (
                            <p className="mt-1 text-caption text-destructive">{errors.type.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="intake_year" className="block text-body-sm font-medium text-admin-foreground">
                            Intake year
                            <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                                cohort start year
                            </span>
                        </label>
                        <input
                            {...register("intake_year")}
                            id="intake_year"
                            type="number"
                            inputMode="numeric"
                            placeholder="2027"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                            aria-invalid={!!errors.intake_year}
                        />
                        {errors.intake_year && (
                            <p className="mt-1 text-caption text-destructive">{errors.intake_year.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-body-sm font-medium text-admin-foreground">
                            Location
                        </label>
                        <input
                            {...register("location")}
                            id="location"
                            type="text"
                            placeholder="Lagos"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                            aria-invalid={!!errors.location}
                        />
                        {errors.location && (
                            <p className="mt-1 text-caption text-destructive">{errors.location.message}</p>
                        )}
                    </div>
                </div>
            </section>

            {/* SECTION 2: Dates */}
            <section>
                <h2 className="font-display text-heading-lg text-admin-foreground">
                    Dates
                </h2>
                <p className="mt-1 text-caption text-admin-text-faint">
                    Both optional. Leave blank for rolling admissions or always-open.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="opens_at" className="block text-body-sm font-medium text-admin-foreground">
                            Opens at
                        </label>
                        <input
                            {...register("opens_at")}
                            id="opens_at"
                            type="date"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                        />
                    </div>

                    <div>
                        <label htmlFor="deadline" className="block text-body-sm font-medium text-admin-foreground">
                            Deadline
                        </label>
                        <input
                            {...register("deadline")}
                            id="deadline"
                            type="date"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                            aria-invalid={!!errors.deadline}
                        />
                        {errors.deadline && (
                            <p className="mt-1 text-caption text-destructive">{errors.deadline.message}</p>
                        )}
                    </div>
                </div>
            </section>

            {/* SECTION 3: Content */}
            <section>
                <h2 className="font-display text-heading-lg text-admin-foreground">
                    Content
                </h2>
                <div className="mt-4 space-y-5">
                    <div>
                        <label htmlFor="description" className="block text-body-sm font-medium text-admin-foreground">
                            Description
                        </label>
                        <textarea
                            {...register("description")}
                            id="description"
                            rows={6}
                            placeholder="Describe the programme — what graduates do, rotations, key projects."
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30 resize-y min-h-[140px]"
                            aria-invalid={!!errors.description}
                        />
                        {errors.description && (
                            <p className="mt-1 text-caption text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="requirements" className="block text-body-sm font-medium text-admin-foreground">
                            Requirements
                            <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                                optional
                            </span>
                        </label>
                        <textarea
                            {...register("requirements")}
                            id="requirements"
                            rows={4}
                            placeholder="Minimum 2:1, completed NYSC, fluent English…"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30 resize-y min-h-[100px]"
                        />
                        {errors.requirements && (
                            <p className="mt-1 text-caption text-destructive">{errors.requirements.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-body-sm font-medium text-admin-foreground">
                            Discipline tags
                            <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                                optional, up to 20
                            </span>
                        </label>
                        <p className="mt-0.5 text-caption text-admin-text-faint">
                            Helps candidates filter by their degree.
                        </p>
                        <div className="mt-2">
                            <Controller
                                name="discipline_tags"
                                control={control}
                                render={({ field }) => (
                                    <TagInput
                                        value={field.value ?? []}
                                        onChange={field.onChange}
                                        suggestions={COMMON_DISCIPLINES}
                                        placeholder="e.g. Mechanical Engineering"
                                        maxTags={20}
                                    />
                                )}
                            />
                        </div>
                        {errors.discipline_tags && (
                            <p className="mt-1 text-caption text-destructive">
                                {errors.discipline_tags.message}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* SECTION 4: Application links */}
            <section>
                <h2 className="font-display text-heading-lg text-admin-foreground">
                    Application
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="application_url" className="block text-body-sm font-medium text-admin-foreground">
                            Application URL
                        </label>
                        <p className="mt-0.5 text-caption text-admin-text-faint">
                            Where the public &ldquo;Apply&rdquo; button sends candidates.
                        </p>
                        <input
                            {...register("application_url")}
                            id="application_url"
                            type="url"
                            placeholder="https://careers.example.com/apply/2027"
                            className="mt-2 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                            aria-invalid={!!errors.application_url}
                        />
                        {errors.application_url && (
                            <p className="mt-1 text-caption text-destructive">{errors.application_url.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="source_url" className="block text-body-sm font-medium text-admin-foreground">
                            Source URL
                            <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                                optional, for provenance
                            </span>
                        </label>
                        <input
                            {...register("source_url")}
                            id="source_url"
                            type="url"
                            placeholder="https://careers.example.com/programme-page"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                        />
                        {errors.source_url && (
                            <p className="mt-1 text-caption text-destructive">{errors.source_url.message}</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Submit row */}
            <div className="flex flex-wrap items-center gap-4 border-t border-admin-border pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting || (isEdit && !isDirty)}
                    className={cn(
                        "inline-flex items-center gap-2 rounded bg-primary px-5 py-2 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors",
                        "disabled:opacity-60 disabled:cursor-not-allowed",
                    )}
                >
                    {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                    {isSubmitting
                        ? isEdit ? "Saving" : "Creating"
                        : isEdit ? "Save changes" : "Create opportunity"}
                </button>

                {isEdit && initial && (
                    <a
                        href={`/opportunities/${initial.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-body-sm text-admin-text-dim hover:text-admin-foreground transition-colors"
                    >
                        View on public site
                        <ExternalLink className="size-3.5" />
                    </a>
                )}

                {submitError && (
                    <p className="inline-flex items-center gap-1.5 text-caption text-destructive">
                        <AlertCircle className="size-3.5" />
                        {submitError}
                    </p>
                )}
            </div>
        </form >
    );
}