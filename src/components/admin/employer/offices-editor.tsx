"use client";

import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { EmployerFormInput } from "@/lib/validation/employer";

type Props = { form: UseFormReturn<EmployerFormInput> };

export function OfficesEditor({ form }: Props) {
    const {
        register,
        control,
        formState: { errors },
    } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "offices",
    });

    return (
        <div className="space-y-3">
            {fields.length === 0 && (
                <p className="text-caption text-admin-text-faint italic">
                    No offices added. Add one below.
                </p>
            )}

            {fields.map((field, idx) => {
                const officeErrors = errors.offices?.[idx];
                return (
                    <div
                        key={field.id}
                        className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_2fr_auto] items-start rounded border border-admin-border bg-admin-surface px-3 py-2"
                    >
                        <div>
                            <input
                                {...register(`offices.${idx}.city`)}
                                type="text"
                                placeholder="City"
                                className="w-full rounded border border-admin-border bg-admin-surface px-2 py-1.5 text-body-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                                aria-invalid={!!officeErrors?.city}
                            />
                            {officeErrors?.city && (
                                <p className="mt-1 text-caption text-destructive">
                                    {officeErrors.city.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <input
                                {...register(`offices.${idx}.state`)}
                                type="text"
                                placeholder="State"
                                className="w-full rounded border border-admin-border bg-admin-surface px-2 py-1.5 text-body-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                                aria-invalid={!!officeErrors?.state}
                            />
                            {officeErrors?.state && (
                                <p className="mt-1 text-caption text-destructive">
                                    {officeErrors.state.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <input
                                {...register(`offices.${idx}.address`)}
                                type="text"
                                placeholder="Street address"
                                className="w-full rounded border border-admin-border bg-admin-surface px-2 py-1.5 text-body-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                                aria-invalid={!!officeErrors?.address}
                            />
                            {officeErrors?.address && (
                                <p className="mt-1 text-caption text-destructive">
                                    {officeErrors.address.message}
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="inline-flex items-center justify-center size-8 rounded text-admin-text-faint hover:bg-destructive/5 hover:text-destructive transition-colors"
                            aria-label={`Remove office ${idx + 1}`}
                        >
                            <Trash2 className="size-4" />
                        </button>
                    </div>
                );
            })}

            <button
                type="button"
                onClick={() => append({ city: "", state: "", address: "" })}
                className="inline-flex items-center gap-1.5 rounded border border-dashed border-admin-border-strong px-3 py-1.5 text-body-sm text-admin-text-dim hover:bg-admin-surface-subtle hover:text-admin-foreground transition-colors"
            >
                <Plus className="size-3.5" />
                Add office
            </button>
        </div>
    );
}