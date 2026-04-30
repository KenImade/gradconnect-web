"use client";

import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { STAGE_TYPE_LABELS } from "@/lib/utils/assessment";
import { STAGE_TYPE_OPTIONS } from "@/lib/validation/assessment";
import type { AssessmentFormInput } from "@/lib/validation/assessment";

type Props = { form: UseFormReturn<AssessmentFormInput> };

export function StageEditor({ form }: Props) {
    const {
        register,
        control,
        formState: { errors },
    } = form;

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "stages",
    });

    function addStage() {
        append({
            order: fields.length + 1,
            stage_name: "",
            stage_type: "form",
            description: "",
        });
    }

    function moveUp(idx: number) {
        if (idx === 0) return;
        move(idx, idx - 1);
        // Renumber the order field for both swapped stages
        form.setValue(`stages.${idx}.order`, idx + 1);
        form.setValue(`stages.${idx - 1}.order`, idx);
    }

    function moveDown(idx: number) {
        if (idx === fields.length - 1) return;
        move(idx, idx + 1);
        form.setValue(`stages.${idx}.order`, idx + 1);
        form.setValue(`stages.${idx + 1}.order`, idx + 2);
    }

    return (
        <div className="space-y-3">
            {fields.length === 0 && (
                <p className="text-caption text-admin-text-faint italic">
                    No stages yet. Add the first below.
                </p>
            )}

            {fields.map((field, idx) => {
                const stageErrors = errors.stages?.[idx];
                return (
                    <div
                        key={field.id}
                        className="rounded border border-admin-border bg-admin-surface px-4 py-3"
                    >
                        <div className="flex items-start gap-3">
                            {/* Order column */}
                            <div className="flex flex-col items-center pt-2">
                                <span className="font-display text-heading-md text-admin-text-faint tabular-nums">
                                    {idx + 1}
                                </span>
                                <div className="mt-2 flex flex-col gap-0.5">
                                    <button
                                        type="button"
                                        onClick={() => moveUp(idx)}
                                        disabled={idx === 0}
                                        className="text-admin-text-faint hover:text-admin-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Move up"
                                    >
                                        <GripVertical className="size-3 rotate-90" />
                                    </button>
                                </div>
                            </div>

                            {/* Fields column */}
                            <div className="flex-1 grid grid-cols-1 gap-2 md:grid-cols-[2fr_1fr]">
                                <div>
                                    <input
                                        {...register(`stages.${idx}.stage_name`)}
                                        type="text"
                                        placeholder="Stage name (e.g. Aptitude Test)"
                                        className="w-full rounded border border-admin-border bg-admin-surface px-2 py-1.5 text-body-sm font-medium focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                                    />
                                    {stageErrors?.stage_name && (
                                        <p className="mt-1 text-caption text-destructive">
                                            {stageErrors.stage_name.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <select
                                        {...register(`stages.${idx}.stage_type`)}
                                        className="w-full rounded border border-admin-border bg-admin-surface px-2 py-1.5 text-body-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                                    >
                                        {STAGE_TYPE_OPTIONS.map((t) => (
                                            <option key={t} value={t}>
                                                {STAGE_TYPE_LABELS[t]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <textarea
                                        {...register(`stages.${idx}.description`)}
                                        rows={2}
                                        placeholder="What happens at this stage? (optional)"
                                        className="w-full rounded border border-admin-border bg-admin-surface px-2 py-1.5 text-body-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30 resize-y"
                                    />
                                    {stageErrors?.description && (
                                        <p className="mt-1 text-caption text-destructive">
                                            {stageErrors.description.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Actions column */}
                            <div className="flex flex-col gap-1 pt-1">
                                <button
                                    type="button"
                                    onClick={() => moveDown(idx)}
                                    disabled={idx === fields.length - 1}
                                    className="inline-flex items-center justify-center size-7 rounded text-admin-text-faint hover:bg-admin-surface-subtle hover:text-admin-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Move down"
                                >
                                    ↓
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveUp(idx)}
                                    disabled={idx === 0}
                                    className="inline-flex items-center justify-center size-7 rounded text-admin-text-faint hover:bg-admin-surface-subtle hover:text-admin-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Move up"
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    onClick={() => remove(idx)}
                                    className="inline-flex items-center justify-center size-7 rounded text-admin-text-faint hover:bg-destructive/5 hover:text-destructive transition-colors"
                                    aria-label="Remove stage"
                                >
                                    <Trash2 className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}

            <button
                type="button"
                onClick={addStage}
                disabled={fields.length >= 15}
                className="inline-flex items-center gap-1.5 rounded border border-dashed border-admin-border-strong px-3 py-1.5 text-body-sm text-admin-text-dim hover:bg-admin-surface-subtle hover:text-admin-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Plus className="size-3.5" />
                Add stage
            </button>
        </div>
    );
}