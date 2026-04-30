"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    assessmentFormSchema,
    type AssessmentFormInput,
} from "@/lib/validation/assessment";
import {
    COMMON_PROGRAMME_TYPES,
    COMMON_TEST_PROVIDERS,
    COMMON_INTERVIEW_FORMATS,
} from "@/lib/utils/assessment";
import {
    createAssessment,
    updateAssessment,
} from "@/lib/api/endpoints/admin-assessments";
import { APIError } from "@/lib/api/errors";
import { EmployerSelect } from "@/components/admin/opportunity/employer-select";
import { StageEditor } from "./stage-editor";
import type { Assessment } from "@/lib/api/endpoints/assessments.types";
import type { EmployerSummary } from "@/lib/api/endpoints/employers.types";

type Props = {
    initial?: Assessment;
};

const KNOWN_STAGE_TYPES = ["form", "test", "interview", "assessment", "other"] as const;
type KnownStageType = (typeof KNOWN_STAGE_TYPES)[number];

function isKnownStageType(value: string): value is KnownStageType {
    return (KNOWN_STAGE_TYPES as readonly string[]).includes(value);
}

function defaultsFromAssessment(a?: Assessment): AssessmentFormInput {
    return {
        employer_id: a?.employer.id ?? "",
        programme_type: a?.programme_type ?? "",
        stages: a?.stages
            ? a.stages.map((stage) => ({
                order: stage.order,
                stage_name: stage.stage_name,
                stage_type: isKnownStageType(stage.stage_type) ? stage.stage_type : "other",
                description: stage.description ?? "",
            }))
            : [
                { order: 1, stage_name: "", stage_type: "form", description: "" },
            ],
        aptitude_test_provider: a?.aptitude_test_provider ?? "",
        interview_format: a?.interview_format ?? "",
        timeline_weeks: a?.timeline_weeks ? String(a.timeline_weeks) : "",
        prep_guide: a?.prep_guide ?? "",
    };
}

export function AssessmentForm({ initial }: Props) {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const isEdit = Boolean(initial);

    const form = useForm<AssessmentFormInput>({
        resolver: zodResolver(assessmentFormSchema),
        defaultValues: defaultsFromAssessment(initial),
    });

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = form;

    async function onSubmit(data: AssessmentFormInput) {
        setSubmitError(null);

        // Renumber stages on submit just in case the user reordered without
        // explicit re-numbering.
        const renumberedStages = data.stages.map((stage, idx) => ({
            ...stage,
            order: idx + 1,
        }));

        const payload = {
            employer_id: data.employer_id,
            programme_type: data.programme_type,
            stages: renumberedStages,
            ...(data.aptitude_test_provider
                ? { aptitude_test_provider: data.aptitude_test_provider }
                : {}),
            ...(data.interview_format
                ? { interview_format: data.interview_format }
                : {}),
            ...(data.timeline_weeks
                ? { timeline_weeks: parseInt(data.timeline_weeks, 10) }
                : {}),
            ...(data.prep_guide ? { prep_guide: data.prep_guide } : {}),
        };

        try {
            const result = isEdit
                ? await updateAssessment(initial!.id, payload)
                : await createAssessment(payload);

            toast.success(
                isEdit
                    ? `Saved ${result.programme_type}`
                    : `Created ${result.programme_type}`,
            );
            router.push(`/admin/assessments/${result.id}/edit`);
            router.refresh();
        } catch (err) {
            if (APIError.isAPIError(err)) {
                if (err.status === 422 && err.details) {
                    for (const [field, msg] of Object.entries(err.details)) {
                        // Backend returns nested errors like "stages[0].stage_name"
                        // RHF accepts dot-paths. Normalize the bracket syntax.
                        const normalized = field.replace(/\[(\d+)\]/g, ".$1");
                        form.setError(normalized as Parameters<typeof form.setError>[0], {
                            type: "server",
                            message: String(msg),
                        });
                    }
                    setSubmitError("Check the highlighted fields.");
                } else if (err.status === 409) {
                    setSubmitError("Someone else updated this. Please reload and try again.");
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
                        <p className="mt-0.5 text-caption text-admin-text-faint">
                            {isEdit
                                ? "Cannot be changed after creation"
                                : "Pick the employer this assessment belongs to"}
                        </p>
                        <div className="mt-2">
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
                                        disabled={isEdit}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="programme_type" className="block text-body-sm font-medium text-admin-foreground">
                            Programme type
                        </label>
                        <input
                            {...register("programme_type")}
                            id="programme_type"
                            type="text"
                            list="programme-suggestions"
                            placeholder="Graduate Trainee"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                            aria-invalid={!!errors.programme_type}
                        />
                        <datalist id="programme-suggestions">
                            {COMMON_PROGRAMME_TYPES.map((t) => (
                                <option key={t} value={t} />
                            ))}
                        </datalist>
                        {errors.programme_type && (
                            <p className="mt-1 text-caption text-destructive">
                                {errors.programme_type.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="timeline_weeks" className="block text-body-sm font-medium text-admin-foreground">
                            Timeline
                            <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                                weeks, optional
                            </span>
                        </label>
                        <input
                            {...register("timeline_weeks")}
                            id="timeline_weeks"
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={52}
                            placeholder="8"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                            aria-invalid={!!errors.timeline_weeks}
                        />
                        {errors.timeline_weeks && (
                            <p className="mt-1 text-caption text-destructive">
                                {errors.timeline_weeks.message}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* SECTION 2: Stages */}
            <section>
                <h2 className="font-display text-heading-lg text-admin-foreground">
                    Stages
                </h2>
                <p className="mt-1 text-caption text-admin-text-faint">
                    Each stage of the recruitment process from application to offer. At
                    least one required, max 15.
                </p>
                {errors.stages?.message && (
                    <p className="mt-2 text-caption text-destructive">
                        {errors.stages.message}
                    </p>
                )}
                <div className="mt-4">
                    <StageEditor form={form} />
                </div>
            </section>

            {/* SECTION 3: Process metadata */}
            <section>
                <h2 className="font-display text-heading-lg text-admin-foreground">
                    Process metadata
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="aptitude_test_provider" className="block text-body-sm font-medium text-admin-foreground">
                            Aptitude test provider
                            <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                                optional
                            </span>
                        </label>
                        <input
                            {...register("aptitude_test_provider")}
                            id="aptitude_test_provider"
                            type="text"
                            list="provider-suggestions"
                            placeholder="SHL"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                        />
                        <datalist id="provider-suggestions">
                            {COMMON_TEST_PROVIDERS.map((p) => (
                                <option key={p} value={p} />
                            ))}
                        </datalist>
                        {errors.aptitude_test_provider && (
                            <p className="mt-1 text-caption text-destructive">
                                {errors.aptitude_test_provider.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="interview_format" className="block text-body-sm font-medium text-admin-foreground">
                            Interview format
                            <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                                optional
                            </span>
                        </label>
                        <input
                            {...register("interview_format")}
                            id="interview_format"
                            type="text"
                            list="format-suggestions"
                            placeholder="competency-based"
                            className="mt-1.5 w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                        />
                        <datalist id="format-suggestions">
                            {COMMON_INTERVIEW_FORMATS.map((f) => (
                                <option key={f} value={f} />
                            ))}
                        </datalist>
                        {errors.interview_format && (
                            <p className="mt-1 text-caption text-destructive">
                                {errors.interview_format.message}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* SECTION 4: Prep guide */}
            <section>
                <h2 className="font-display text-heading-lg text-admin-foreground">
                    Preparation guide
                </h2>
                <p className="mt-1 text-caption text-admin-text-faint">
                    Markdown supported. Public-facing — written for candidates preparing
                    for this process.
                </p>
                <div className="mt-4">
                    <textarea
                        {...register("prep_guide")}
                        id="prep_guide"
                        rows={12}
                        placeholder={`## How to prepare\n\nStart with practice questions from the official provider…`}
                        className="w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md font-mono focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30 resize-y min-h-65"
                    />
                    {errors.prep_guide && (
                        <p className="mt-1 text-caption text-destructive">
                            {errors.prep_guide.message}
                        </p>
                    )}
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
                        : isEdit ? "Save changes" : "Create assessment"}
                </button>

                {isEdit && initial && (
                    <a
                        href={`/employers/${initial.employer.slug}/process`}
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