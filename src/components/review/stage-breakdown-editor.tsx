"use client";

import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import type { ReviewFormInput } from "@/lib/validation/review";

type Props = {
    form: UseFormReturn<ReviewFormInput>;
};

const COMMON_STAGES = [
    "Online Application",
    "Aptitude Test",
    "Video Interview",
    "Phone Screen",
    "Case Study",
    "Group Exercise",
    "Assessment Centre",
    "Panel Interview",
    "Final Interview",
];

export function StageBreakdownEditor({ form }: Props) {
    const {
        register,
        control,
        formState: { errors },
    } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "stage_breakdown",
    });

    return (
        <div className="space-y-5">
            {fields.map((field, idx) => {
                const stageErrors = errors.stage_breakdown?.[idx];
                return (
                    <div
                        key={field.id}
                        className="relative rounded-md border border-border bg-background p-5"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                                <span className="inline-flex items-center justify-center size-7 rounded-full bg-surface-subtle text-caption font-medium text-foreground tabular-nums">
                                    {idx + 1}
                                </span>
                            </div>

                            <div className="min-w-0 flex-1 space-y-4">
                                <div>
                                    <label
                                        htmlFor={`stage-${idx}-name`}
                                        className="block text-body-sm font-medium text-foreground"
                                    >
                                        Stage name
                                    </label>
                                    <input
                                        {...register(`stage_breakdown.${idx}.stage_name`)}
                                        id={`stage-${idx}-name`}
                                        type="text"
                                        list="common-stages"
                                        placeholder="e.g. Aptitude Test"
                                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                        aria-invalid={!!stageErrors?.stage_name}
                                    />
                                    {stageErrors?.stage_name && (
                                        <p className="mt-1.5 text-caption text-destructive" role="alert">
                                            {stageErrors.stage_name.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor={`stage-${idx}-description`}
                                        className="block text-body-sm font-medium text-foreground"
                                    >
                                        What happened
                                        <span className="ml-1 text-caption text-text-faint font-normal">
                                            (optional)
                                        </span>
                                    </label>
                                    <textarea
                                        {...register(`stage_breakdown.${idx}.description`)}
                                        id={`stage-${idx}-description`}
                                        rows={2}
                                        placeholder="What the stage involved, how it felt, what they asked."
                                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors resize-y"
                                    />
                                    {stageErrors?.description && (
                                        <p className="mt-1.5 text-caption text-destructive" role="alert">
                                            {stageErrors.description.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor={`stage-${idx}-tips`}
                                        className="block text-body-sm font-medium text-foreground"
                                    >
                                        Tips for this stage
                                        <span className="ml-1 text-caption text-text-faint font-normal">
                                            (optional)
                                        </span>
                                    </label>
                                    <textarea
                                        {...register(`stage_breakdown.${idx}.tips`)}
                                        id={`stage-${idx}-tips`}
                                        rows={2}
                                        placeholder="Advice for future candidates."
                                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors resize-y"
                                    />
                                    {stageErrors?.tips && (
                                        <p className="mt-1.5 text-caption text-destructive" role="alert">
                                            {stageErrors.tips.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {fields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => remove(idx)}
                                    className="inline-flex items-center justify-center size-8 rounded-md text-text-faint hover:bg-destructive/5 hover:text-destructive transition-colors"
                                    aria-label={`Remove stage ${idx + 1}`}
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Native datalist for common stage name suggestions */}
            <datalist id="common-stages">
                {COMMON_STAGES.map((s) => (
                    <option key={s} value={s} />
                ))}
            </datalist>

            <button
                type="button"
                onClick={() =>
                    append({
                        stage_name: "",
                        description: "",
                        tips: "",
                    })
                }
                disabled={fields.length >= 10}
                className="inline-flex items-center gap-2 rounded-md border border-dashed border-border-strong bg-transparent px-4 py-3 text-body-sm text-text-dim hover:bg-surface-subtle hover:text-foreground disabled:opacity-50 transition-colors w-full justify-center"
            >
                <Plus className="size-4" />
                Add another stage
            </button>

            {errors.stage_breakdown?.root && (
                <p className="text-caption text-destructive" role="alert">
                    {errors.stage_breakdown.root.message}
                </p>
            )}
            {/* Also handle top-level array errors (e.g. "Add at least one stage") */}
            {errors.stage_breakdown?.message && (
                <p className="text-caption text-destructive" role="alert">
                    {errors.stage_breakdown.message}
                </p>
            )}
        </div>
    );
}