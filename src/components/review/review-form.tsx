"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, Save, Info } from "lucide-react";
import { toast } from "sonner";
import {
    reviewSubmitSchema,
    type ReviewFormInput,
} from "@/lib/validation/review";
import { submitReview } from "@/lib/api/endpoints/reviews";
import { APIError } from "@/lib/api/errors";
import { StageBreakdownEditor } from "./stage-breakdown-editor";
import { RatingDotsInput } from "./rating-dots-input";
import { useReviewDraft } from "@/lib/hooks/use-review-draft";

type ReviewFormProps = {
    /** Pre-selected employer. Always required — standalone /reviews/new uses an employer picker upstream. */
    employerId: string;
    employerName: string;
    employerSlug: string;
};

const OUTCOMES: Array<{ value: "offer" | "waitlisted" | "rejected" | "withdrew"; label: string; hint: string }> = [
    { value: "offer", label: "Offer", hint: "Received an offer" },
    { value: "waitlisted", label: "Waitlisted", hint: "On the reserve list" },
    { value: "rejected", label: "Rejected", hint: "Unsuccessful" },
    { value: "withdrew", label: "Withdrew", hint: "Dropped out of the process" },
];

export function ReviewForm({
    employerId,
    employerName,
    employerSlug,
}: ReviewFormProps) {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm<ReviewFormInput>({
        resolver: zodResolver(reviewSubmitSchema),
        defaultValues: {
            employer_id: employerId,
            programme_name: "",
            application_year: "",
            outcome: undefined as unknown as ReviewFormInput["outcome"],
            difficulty_rating: 0 as unknown as ReviewFormInput["difficulty_rating"],
            experience_rating: 0 as unknown as ReviewFormInput["experience_rating"],
            stage_breakdown: [
                { stage_name: "", description: "", tips: "" },
            ],
            tips: "",
            degree_discipline: "",
            university: "",
        },
    });

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = form;

    const { clearDraft, saveDraftNow } = useReviewDraft({
        form,
        employerId,
    });

    const tipsValue = watch("tips") ?? "";

    async function onSubmit(data: ReviewFormInput) {
        setSubmitError(null);

        // Strip optional empty strings, parse year, add order to stages.
        const payload = {
            employer_id: data.employer_id,
            programme_name: data.programme_name,
            application_year: parseInt(data.application_year, 10),
            outcome: data.outcome,
            difficulty_rating: data.difficulty_rating,
            experience_rating: data.experience_rating,
            stage_breakdown: data.stage_breakdown.map((stage, idx) => ({
                stage_name: stage.stage_name,
                ...(stage.description ? { description: stage.description } : {}),
                ...(stage.tips ? { tips: stage.tips } : {}),
                order: idx + 1,
            })),
            ...(data.tips ? { tips: data.tips } : {}),
            ...(data.degree_discipline
                ? { degree_discipline: data.degree_discipline }
                : {}),
            ...(data.university ? { university: data.university } : {}),
        };

        try {
            const result = await submitReview(payload);
            clearDraft();
            router.push(
                `/reviews/submitted?employer=${encodeURIComponent(employerSlug)}&id=${result.id}`,
            );
        } catch (err) {
            if (APIError.isAPIError(err)) {
                if (err.status === 422 && err.details) {
                    // Hydrate field errors from backend validation response.
                    for (const [field, message] of Object.entries(err.details)) {
                        form.setError(field as keyof ReviewFormInput, {
                            type: "server",
                            message: String(message),
                        });
                    }
                    setSubmitError("Check the highlighted fields.");
                } else if (err.status === 403) {
                    setSubmitError("Your account can't submit reviews.");
                } else {
                    setSubmitError(err.message || "Couldn't submit. Try again.");
                }
            } else {
                setSubmitError("Network error. Check your connection.");
            }
        }
    }

    function handleSaveAndClose() {
        saveDraftNow();
        toast.success("Draft saved", {
            description: "Your draft is saved to this browser. Pick up where you left off next time.",
        });
        router.push(`/employers/${employerSlug}`);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-14">
            {/* SECTION 1: Which employer + programme */}
            <section>
                <h2 className="font-display text-heading-lg text-foreground">
                    The basics
                </h2>
                <p className="mt-1 text-body-sm text-text-dim">
                    You&apos;re reviewing{" "}
                    <Link
                        href={`/employers/${employerSlug}`}
                        className="text-foreground hover:text-primary transition-colors underline underline-offset-4"
                    >
                        {employerName}
                    </Link>
                    .
                </p>

                <div className="mt-6 space-y-5">
                    <div>
                        <label
                            htmlFor="programme_name"
                            className="block text-body-sm font-medium text-foreground"
                        >
                            Programme name
                        </label>
                        <input
                            {...register("programme_name")}
                            id="programme_name"
                            type="text"
                            placeholder="e.g. Graduate Trainee Programme 2026"
                            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                            aria-invalid={!!errors.programme_name}
                        />
                        {errors.programme_name && (
                            <p className="mt-1.5 text-caption text-destructive" role="alert">
                                {errors.programme_name.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="application_year"
                                className="block text-body-sm font-medium text-foreground"
                            >
                                Application year
                            </label>
                            <input
                                {...register("application_year")}
                                id="application_year"
                                type="number"
                                inputMode="numeric"
                                placeholder="e.g. 2026"
                                className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                aria-invalid={!!errors.application_year}
                            />
                            {errors.application_year && (
                                <p className="mt-1.5 text-caption text-destructive" role="alert">
                                    {errors.application_year.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <fieldset>
                                <legend className="block text-body-sm font-medium text-foreground">
                                    Outcome
                                </legend>
                                <div className="mt-1.5 grid grid-cols-2 gap-2">
                                    {OUTCOMES.map((opt) => (
                                        <label
                                            key={opt.value}
                                            className="relative flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-body-sm text-foreground hover:border-border-strong transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:text-primary"
                                        >
                                            <input
                                                {...register("outcome")}
                                                type="radio"
                                                value={opt.value}
                                                className="sr-only"
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                                {errors.outcome && (
                                    <p className="mt-1.5 text-caption text-destructive" role="alert">
                                        {errors.outcome.message}
                                    </p>
                                )}
                            </fieldset>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: Your experience */}
            <section>
                <h2 className="font-display text-heading-lg text-foreground">
                    Your experience
                </h2>
                <p className="mt-1 text-body-sm text-text-dim">
                    How hard was it, how did it feel?
                </p>

                <div className="mt-6 space-y-6">
                    <div>
                        <Controller
                            name="difficulty_rating"
                            control={control}
                            render={({ field }) => (
                                <RatingDotsInput
                                    label="Difficulty"
                                    description="1 = very easy, 5 = very challenging"
                                    value={field.value || 0}
                                    onChange={field.onChange}
                                    error={errors.difficulty_rating?.message}
                                />
                            )}
                        />
                    </div>

                    <div>
                        <Controller
                            name="experience_rating"
                            control={control}
                            render={({ field }) => (
                                <RatingDotsInput
                                    label="Overall experience"
                                    description="1 = frustrating, 5 = excellent"
                                    value={field.value || 0}
                                    onChange={field.onChange}
                                    error={errors.experience_rating?.message}
                                />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="degree_discipline"
                                className="block text-body-sm font-medium text-foreground"
                            >
                                Your degree
                                <span className="ml-1 text-caption text-text-faint font-normal">
                                    (optional)
                                </span>
                            </label>
                            <input
                                {...register("degree_discipline")}
                                id="degree_discipline"
                                type="text"
                                placeholder="e.g. Economics"
                                className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="university"
                                className="block text-body-sm font-medium text-foreground"
                            >
                                Your university
                                <span className="ml-1 text-caption text-text-faint font-normal">
                                    (optional)
                                </span>
                            </label>
                            <input
                                {...register("university")}
                                id="university"
                                type="text"
                                placeholder="e.g. University of Lagos"
                                className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: Stage breakdown */}
            <section>
                <h2 className="font-display text-heading-lg text-foreground">
                    Stage by stage
                </h2>
                <p className="mt-1 text-body-sm text-text-dim">
                    Walk future candidates through what you went through — one row per stage.
                </p>

                <div className="mt-6">
                    <StageBreakdownEditor form={form} />
                </div>
            </section>

            {/* SECTION 4: Overall tips */}
            <section>
                <h2 className="font-display text-heading-lg text-foreground">
                    Overall advice
                    <span className="ml-2 text-caption text-text-faint font-normal italic">
                        optional
                    </span>
                </h2>
                <p className="mt-1 text-body-sm text-text-dim">
                    Anything else future candidates should know — what would you tell your past self?
                </p>

                <div className="mt-6">
                    <textarea
                        {...register("tips")}
                        id="tips"
                        rows={5}
                        placeholder="Start preparing at least two weeks before the aptitude test. The assessment centre is intense but fair."
                        maxLength={5000}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors resize-y min-h-[140px]"
                    />
                    <div className="mt-1.5 flex items-center justify-between">
                        {errors.tips ? (
                            <p className="text-caption text-destructive" role="alert">
                                {errors.tips.message}
                            </p>
                        ) : (
                            <span />
                        )}
                        <span className="text-caption text-text-faint tabular-nums">
                            {tipsValue.length.toLocaleString()} / 5,000
                        </span>
                    </div>
                </div>
            </section>

            {/* SECTION 5: Anonymity + submit */}
            <section>
                <div className="border-l-2 border-primary pl-5 py-2">
                    <div className="flex items-start gap-2">
                        <Info className="size-4 text-primary mt-0.5 shrink-0" />
                        <div>
                            <p className="text-body-sm text-foreground font-medium">
                                Your review will be posted anonymously.
                            </p>
                            <p className="mt-1 text-caption text-text-dim">
                                Your name and email are never shown publicly. Context fields you provide (degree, university) will be visible alongside the review for readers&apos; benefit.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-caption text-text-faint italic">
                    After submission, a moderator reviews your post before it appears publicly. This usually takes 1–2 days.
                </div>

                {submitError && (
                    <div className="mt-6 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-body-sm text-destructive">
                        <AlertCircle className="size-4 shrink-0" />
                        {submitError}
                    </div>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-body-md font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                        {isSubmitting ? "Submitting" : "Submit for review"}
                    </button>

                    <button
                        type="button"
                        onClick={handleSaveAndClose}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-transparent px-6 py-3 text-body-md text-foreground hover:bg-surface-subtle transition-colors"
                    >
                        <Save className="size-4" />
                        Save and come back later
                    </button>
                </div>
            </section>
        </form>
    );
}