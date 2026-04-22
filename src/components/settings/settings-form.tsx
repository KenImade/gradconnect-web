"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { updateProfile } from "@/lib/api/endpoints/users";
import { APIError } from "@/lib/api/errors";
import { profileSchema, type ProfileInput } from "@/lib/validation/profile";
import { TagInput } from "@/components/shared/tag-input";
import { INDUSTRIES } from "@/lib/data/industries";
import { NIGERIAN_LOCATIONS } from "@/lib/data/locations";
import type { User } from "@/lib/api/endpoints/users.types";

/**
 * Split a full name back into first + last for the form's initial values.
 * The User type stores a joined `name`, but the backend accepts first_name/last_name.
 */
function splitName(fullName: string): { first_name: string; last_name: string } {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return { first_name: "", last_name: "" };
    const [first, ...rest] = parts;
    return {
        first_name: first ?? "",
        last_name: rest.join(" "),
    };
}

export function SettingsForm({ user }: { user: User }) {
    const router = useRouter();
    const [showSaved, setShowSaved] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { first_name, last_name } = splitName(user.name);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            first_name,
            last_name,
            degree_discipline: user.degree_discipline ?? "",
            graduation_year: user.graduation_year?.toString() ?? "",
            target_industries: user.target_industries,
            preferred_locations: user.preferred_locations,
        },
    });

    async function onSubmit(data: ProfileInput) {
        setSubmitError(null);

        // Normalize empty strings to null for optional fields.
        const payload = {
            first_name: data.first_name,
            last_name: data.last_name,
            degree_discipline: data.degree_discipline || null,
            graduation_year: data.graduation_year
                ? parseInt(data.graduation_year, 10)
                : null,
            target_industries: data.target_industries,
            preferred_locations: data.preferred_locations,
        };

        try {
            const updated = await updateProfile(payload);
            setShowSaved(true);
            // Auto-hide after 5 seconds — using setTimeout instead of Date.now comparisons.
            setTimeout(() => setShowSaved(false), 5000);
            // Refresh layout data so dashboard + header pick up the updated user.
            router.refresh();
            // Reset form-dirty state with the new baseline.
            const parts = splitName(updated.name);
            reset({
                first_name: parts.first_name,
                last_name: parts.last_name,
                degree_discipline: updated.degree_discipline ?? "",
                graduation_year: updated.graduation_year?.toString() ?? "",
                target_industries: updated.target_industries,
                preferred_locations: updated.preferred_locations,
            });
        } catch (err) {
            if (APIError.isAPIError(err)) {
                if (err.status === 422) {
                    setSubmitError(err.message || "Check the fields and try again.");
                } else {
                    setSubmitError(err.message || "Something went wrong. Try again.");
                }
            } else {
                setSubmitError("Network error. Check your connection.");
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-12">
            {/* ---- Section: Name ---- */}
            <section>
                <h2 className="font-display text-heading-lg text-foreground">Name</h2>
                <p className="mt-1 text-body-sm text-text-dim">
                    How you&apos;re addressed across the platform.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="first_name"
                            className="block text-body-sm font-medium text-foreground"
                        >
                            First name
                        </label>
                        <input
                            {...register("first_name")}
                            id="first_name"
                            type="text"
                            autoComplete="given-name"
                            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                            aria-invalid={!!errors.first_name}
                        />
                        {errors.first_name && (
                            <p className="mt-1.5 text-caption text-destructive" role="alert">
                                {errors.first_name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="last_name"
                            className="block text-body-sm font-medium text-foreground"
                        >
                            Last name
                        </label>
                        <input
                            {...register("last_name")}
                            id="last_name"
                            type="text"
                            autoComplete="family-name"
                            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                            aria-invalid={!!errors.last_name}
                        />
                        {errors.last_name && (
                            <p className="mt-1.5 text-caption text-destructive" role="alert">
                                {errors.last_name.message}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* ---- Section: Profile ---- */}
            <section>
                <h2 className="font-display text-heading-lg text-foreground">Profile</h2>
                <p className="mt-1 text-body-sm text-text-dim">
                    Your education background — optional but helps us tailor recommendations.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="degree_discipline"
                            className="block text-body-sm font-medium text-foreground"
                        >
                            Degree discipline
                        </label>
                        <input
                            {...register("degree_discipline")}
                            id="degree_discipline"
                            type="text"
                            placeholder="e.g. Economics"
                            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                            aria-invalid={!!errors.degree_discipline}
                        />
                        {errors.degree_discipline && (
                            <p className="mt-1.5 text-caption text-destructive" role="alert">
                                {errors.degree_discipline.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="graduation_year"
                            className="block text-body-sm font-medium text-foreground"
                        >
                            Graduation year
                        </label>
                        <input
                            {...register("graduation_year")}
                            id="graduation_year"
                            type="number"
                            inputMode="numeric"
                            placeholder="e.g. 2026"
                            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                            aria-invalid={!!errors.graduation_year}
                        />
                        {errors.graduation_year && (
                            <p className="mt-1.5 text-caption text-destructive" role="alert">
                                {errors.graduation_year.message}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* ---- Section: Preferences ---- */}
            <section>
                <h2 className="font-display text-heading-lg text-foreground">
                    Preferences
                </h2>
                <p className="mt-1 text-body-sm text-text-dim">
                    These drive the &quot;Matched to your interests&quot; section on your dashboard.
                </p>

                <div className="mt-5 space-y-5">
                    <div>
                        <label
                            htmlFor="target_industries"
                            className="block text-body-sm font-medium text-foreground"
                        >
                            Target industries
                        </label>
                        <p className="mt-1 mb-2 text-caption text-text-faint italic">
                            Up to 10. Start typing to see suggestions.
                        </p>
                        <Controller
                            name="target_industries"
                            control={control}
                            render={({ field }) => (
                                <TagInput
                                    id="target_industries"
                                    value={field.value ?? []}
                                    onChange={field.onChange}
                                    suggestions={[...INDUSTRIES]}
                                    placeholder="e.g. Banking & Finance"
                                    maxTags={10}
                                />
                            )}
                        />
                        {errors.target_industries && (
                            <p className="mt-1.5 text-caption text-destructive" role="alert">
                                {errors.target_industries.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="preferred_locations"
                            className="block text-body-sm font-medium text-foreground"
                        >
                            Preferred locations
                        </label>
                        <p className="mt-1 mb-2 text-caption text-text-faint italic">
                            Cities or states where you&apos;d work.
                        </p>
                        <Controller
                            name="preferred_locations"
                            control={control}
                            render={({ field }) => (
                                <TagInput
                                    id="preferred_locations"
                                    value={field.value ?? []}
                                    onChange={field.onChange}
                                    suggestions={[...NIGERIAN_LOCATIONS]}
                                    placeholder="e.g. Lagos"
                                    maxTags={10}
                                />
                            )}
                        />
                        {errors.preferred_locations && (
                            <p className="mt-1.5 text-caption text-destructive" role="alert">
                                {errors.preferred_locations.message}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* ---- Save row ---- */}
            <div className="flex items-center gap-4 border-t border-border pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                    {isSubmitting ? "Saving" : "Save changes"}
                </button>

                {showSaved && !isDirty && (
                    <p
                        className="inline-flex items-center gap-1.5 text-caption text-success"
                        role="status"
                    >
                        <CheckCircle2 className="size-3.5" />
                        Saved
                    </p>
                )}

                {submitError && (
                    <p className="text-caption text-destructive" role="alert">
                        {submitError}
                    </p>
                )}
            </div>
        </form>
    );
}