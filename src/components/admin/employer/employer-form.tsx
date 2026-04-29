"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    employerFormSchema,
    type EmployerFormInput,
    SIZE_OPTIONS,
    INDUSTRY_OPTIONS,
} from "@/lib/validation/employer";
import { slugify } from "@/lib/utils/slug";
import {
    createEmployer,
    updateEmployer,
} from "@/lib/api/endpoints/admin-employers";
import { APIError } from "@/lib/api/errors";
import { OfficesEditor } from "./offices-editor";
import type { Employer } from "@/lib/api/endpoints/employers.types";

type Props = {
    /** When provided, form is in edit mode; otherwise create. */
    initial?: Employer;
};

function defaultsFromEmployer(e?: Employer): EmployerFormInput {
    return {
        name: e?.name ?? "",
        slug: e?.slug ?? "",
        industry: e?.industry ?? "",
        size: (e?.size as EmployerFormInput["size"]) ?? "",
        hq_location: e?.hq_location ?? "",
        offices: e?.offices ?? [],
        logo_url: e?.logo_url ?? "",
        overview: e?.overview ?? "",
        culture: e?.culture ?? "",
        website: e?.website ?? "",
        social_linkedin: (e?.social_links as Record<string, string> | null)?.linkedin ?? "",
        social_twitter: (e?.social_links as Record<string, string> | null)?.twitter ?? "",
        social_instagram: (e?.social_links as Record<string, string> | null)?.instagram ?? "",
        is_verified: e?.is_verified ?? false,
    };
}

export function EmployerForm({ initial }: Props) {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const isEdit = Boolean(initial);

    const form = useForm<EmployerFormInput>({
        resolver: zodResolver(employerFormSchema),
        defaultValues: defaultsFromEmployer(initial),
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting, isDirty },
    } = form;

    // Auto-slug from name on create. Stops as soon as the user manually edits the slug.
    const slugOverriddenRef = useRef(isEdit);
    const nameValue = watch("name");
    useEffect(() => {
        if (slugOverriddenRef.current) return;
        if (!nameValue) return;
        setValue("slug", slugify(nameValue), { shouldDirty: true });
    }, [nameValue, setValue]);

    function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
        slugOverriddenRef.current = true;
        setValue("slug", e.target.value, {
            shouldDirty: true,
            shouldValidate: true,
        });
    }

    const logoUrl = watch("logo_url");

    async function onSubmit(data: EmployerFormInput) {
        setSubmitError(null);

        // Reassemble social_links from individual fields. Only include non-empty.
        const socialLinks: Record<string, string> = {};
        if (data.social_linkedin) socialLinks.linkedin = data.social_linkedin;
        if (data.social_twitter) socialLinks.twitter = data.social_twitter;
        if (data.social_instagram) socialLinks.instagram = data.social_instagram;

        // Build payload, omitting empties so the backend doesn't error on unknown
        // empty strings or set columns to "".
        const payload = {
            name: data.name,
            slug: data.slug,
            industry: data.industry,
            ...(data.size ? { size: data.size } : {}),
            ...(data.hq_location ? { hq_location: data.hq_location } : {}),
            ...(data.offices.length > 0 ? { offices: data.offices } : {}),
            ...(data.logo_url ? { logo_url: data.logo_url } : {}),
            ...(data.overview ? { overview: data.overview } : {}),
            ...(data.culture ? { culture: data.culture } : {}),
            ...(data.website ? { website: data.website } : {}),
            ...(Object.keys(socialLinks).length > 0
                ? { social_links: socialLinks }
                : {}),
            is_verified: data.is_verified,
        };

        try {
            const result = isEdit
                ? await updateEmployer(initial!.id, payload)
                : await createEmployer(payload);

            toast.success(
                isEdit
                    ? `Saved ${result.name}`
                    : `Created ${result.name}`,
            );
            router.push(`/admin/employers/${result.id}/edit`);
            router.refresh();
        } catch (err) {
            if (APIError.isAPIError(err)) {
                if (err.status === 422 && err.details) {
                    for (const [field, msg] of Object.entries(err.details)) {
                        // Map backend field names → form field names for any divergences.
                        // Most field names line up 1:1.
                        form.setError(field as keyof EmployerFormInput, {
                            type: "server",
                            message: String(msg),
                        });
                    }
                    setSubmitError("Check the highlighted fields.");
                } else if (err.status === 400) {
                    setSubmitError(err.message);
                } else if (err.status === 409) {
                    setSubmitError("Slug already in use.");
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
            {/* SECTION 1: Identity */}
            <section>
                <h2 className="font-display text-heading-lg text-admin-foreground">
                    Identity
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block text-body-sm font-medium text-admin-foreground">
                            Name
                        </label>
                        <input
                            {...register("name")}
                            id="name"
                            type="text"
                            placeholder="Access Bank"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                            <p className="mt-1 text-caption text-destructive">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="slug" className="block text-body-sm font-medium text-admin-foreground">
                            Slug
                            <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                                {isEdit ? "edits affect public URL" : "auto from name"}
                            </span>
                        </label>
                        <input
                            id="slug"
                            type="text"
                            value={watch("slug")}
                            onChange={handleSlugChange}
                            placeholder="access-bank"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md font-mono focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                            aria-invalid={!!errors.slug}
                        />
                        {errors.slug && (
                            <p className="mt-1 text-caption text-destructive">
                                {errors.slug.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="industry" className="block text-body-sm font-medium text-admin-foreground">
                            Industry
                        </label>
                        <input
                            {...register("industry")}
                            id="industry"
                            type="text"
                            list="industry-suggestions"
                            placeholder="Banking & Finance"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                            aria-invalid={!!errors.industry}
                        />
                        <datalist id="industry-suggestions">
                            {INDUSTRY_OPTIONS.map((i) => (
                                <option key={i} value={i} />
                            ))}
                        </datalist>
                        {errors.industry && (
                            <p className="mt-1 text-caption text-destructive">
                                {errors.industry.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="size" className="block text-body-sm font-medium text-admin-foreground">
                            Size
                            <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                                optional
                            </span>
                        </label>
                        <select
                            {...register("size")}
                            id="size"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                        >
                            <option value="">—</option>
                            {SIZE_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* SECTION 2: Location */}
            <section>
                <h2 className="font-display text-heading-lg text-admin-foreground">
                    Location
                </h2>
                <div className="mt-4 space-y-5">
                    <div>
                        <label htmlFor="hq_location" className="block text-body-sm font-medium text-admin-foreground">
                            Headquarters
                            <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                                optional
                            </span>
                        </label>
                        <input
                            {...register("hq_location")}
                            id="hq_location"
                            type="text"
                            placeholder="Lagos"
                            className="mt-1.5 w-full max-w-md rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                        />
                    </div>

                    <div>
                        <label className="block text-body-sm font-medium text-admin-foreground">
                            Offices
                            <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                                optional
                            </span>
                        </label>
                        <p className="mt-0.5 text-caption text-admin-text-faint">
                            Specific Nigerian offices where graduates would work.
                        </p>
                        <div className="mt-3">
                            <OfficesEditor form={form} />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: Profile */}
            <section>
                <h2 className="font-display text-heading-lg text-admin-foreground">
                    Profile
                </h2>
                <div className="mt-4 space-y-5">
                    <div>
                        <label htmlFor="logo_url" className="block text-body-sm font-medium text-admin-foreground">
                            Logo URL
                            <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                                optional
                            </span>
                        </label>
                        <p className="mt-0.5 text-caption text-admin-text-faint">
                            Paste a CDN URL. Upload widget coming later.
                        </p>
                        <div className="mt-2 flex items-start gap-3">
                            <input
                                {...register("logo_url")}
                                id="logo_url"
                                type="url"
                                placeholder="https://cdn.gradconnect.ng/logos/example.png"
                                className="flex-1 rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                            />
                            {logoUrl && (
                                <div className="size-10 shrink-0 rounded border border-admin-border bg-admin-surface overflow-hidden flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={logoUrl}
                                        alt="Logo preview"
                                        className="size-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = "none";
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        {errors.logo_url && (
                            <p className="mt-1 text-caption text-destructive">
                                {errors.logo_url.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="overview" className="block text-body-sm font-medium text-admin-foreground">
                            Overview
                            <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                                optional
                            </span>
                        </label>
                        <textarea
                            {...register("overview")}
                            id="overview"
                            rows={4}
                            placeholder="Access Bank Plc is one of Nigeria's largest commercial banks…"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30 resize-y min-h-[100px]"
                        />
                        {errors.overview && (
                            <p className="mt-1 text-caption text-destructive">
                                {errors.overview.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="culture" className="block text-body-sm font-medium text-admin-foreground">
                            Culture
                            <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                                optional
                            </span>
                        </label>
                        <textarea
                            {...register("culture")}
                            id="culture"
                            rows={4}
                            placeholder="The graduate programme emphasises rotational learning…"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30 resize-y min-h-[100px]"
                        />
                        {errors.culture && (
                            <p className="mt-1 text-caption text-destructive">
                                {errors.culture.message}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* SECTION 4: Web presence */}
            <section>
                <h2 className="font-display text-heading-lg text-admin-foreground">
                    Web presence
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label htmlFor="website" className="block text-body-sm font-medium text-admin-foreground">
                            Website
                        </label>
                        <input
                            {...register("website")}
                            id="website"
                            type="url"
                            placeholder="https://www.example.com"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                        />
                        {errors.website && (
                            <p className="mt-1 text-caption text-destructive">
                                {errors.website.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="social_linkedin" className="block text-body-sm font-medium text-admin-foreground">
                            LinkedIn
                        </label>
                        <input
                            {...register("social_linkedin")}
                            id="social_linkedin"
                            type="url"
                            placeholder="https://linkedin.com/company/example"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                        />
                        {errors.social_linkedin && (
                            <p className="mt-1 text-caption text-destructive">
                                {errors.social_linkedin.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="social_twitter" className="block text-body-sm font-medium text-admin-foreground">
                            Twitter / X
                        </label>
                        <input
                            {...register("social_twitter")}
                            id="social_twitter"
                            type="url"
                            placeholder="https://twitter.com/example"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                        />
                        {errors.social_twitter && (
                            <p className="mt-1 text-caption text-destructive">
                                {errors.social_twitter.message}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="social_instagram" className="block text-body-sm font-medium text-admin-foreground">
                            Instagram
                        </label>
                        <input
                            {...register("social_instagram")}
                            id="social_instagram"
                            type="url"
                            placeholder="https://instagram.com/example"
                            className="mt-1.5 w-full max-w-md rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                        />
                        {errors.social_instagram && (
                            <p className="mt-1 text-caption text-destructive">
                                {errors.social_instagram.message}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* SECTION 5: Status */}
            <section>
                <h2 className="font-display text-heading-lg text-admin-foreground">
                    Status
                </h2>
                <div className="mt-4">
                    <label className="inline-flex items-start gap-3 cursor-pointer">
                        <input
                            {...register("is_verified")}
                            type="checkbox"
                            className="mt-0.5 size-4 rounded border-admin-border text-primary focus:ring-ring/30"
                        />
                        <span>
                            <span className="block text-body-sm font-medium text-admin-foreground">
                                Verified
                            </span>
                            <span className="mt-0.5 block text-caption text-admin-text-faint">
                                Verified employers display a badge on the public site and rank higher in listings.
                            </span>
                        </span>
                    </label>
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
                        ? isEdit
                            ? "Saving"
                            : "Creating"
                        : isEdit
                            ? "Save changes"
                            : "Create employer"}
                </button>

                {isEdit && initial && (
                    <a
                        href={`/employers/${initial.slug}`}
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