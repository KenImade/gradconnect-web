"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, GripVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmployerLogo } from "@/components/employer/employer-logo";
import type { ApplicationTrack } from "@/lib/api/endpoints/applications.types";

type TrackerCardProps = {
    application: ApplicationTrack;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
};

function formatDeadline(iso: string | null): string | null {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
    });
}

function isDeadlinePassed(iso: string | null): boolean {
    if (!iso) return false;
    return new Date(iso) < new Date();
}

export function TrackerCard({ application, onEdit, onDelete }: TrackerCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: application.id });

    const [menuOpen, setMenuOpen] = useState(false);

    const { opportunity } = application;
    const deadline = formatDeadline(opportunity.deadline);
    const passed = isDeadlinePassed(opportunity.deadline);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <article
            ref={setNodeRef}
            style={style}
            className={cn(
                "group rounded-md border border-border bg-background p-3 transition-colors",
                "hover:border-border-strong",
                isDragging && "shadow-lg ring-1 ring-primary",
            )}
        >
            <div className="flex items-start gap-2">
                <button
                    type="button"
                    className="mt-1 shrink-0 cursor-grab text-text-faint hover:text-foreground active:cursor-grabbing"
                    {...attributes}
                    {...listeners}
                    aria-label="Drag to move"
                >
                    <GripVertical className="size-4" />
                </button>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                        <EmployerLogo
                            name={opportunity.employer.name}
                            logoUrl={opportunity.employer.logo_url}
                            size="sm"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-caption text-text-faint line-clamp-1">
                                {opportunity.employer.name}
                            </p>
                            <p className="text-body-sm font-medium text-foreground line-clamp-2 leading-snug">
                                {opportunity.title}
                            </p>
                        </div>
                    </div>

                    {(deadline || application.notes) && (
                        <div className="mt-2 space-y-1">
                            {deadline && (
                                <p
                                    className={cn(
                                        "inline-flex items-center gap-1 text-caption",
                                        passed ? "text-text-faint italic" : "text-text-dim",
                                    )}
                                >
                                    <Calendar className="size-3" />
                                    {passed ? `Closed ${deadline}` : `Deadline ${deadline}`}
                                </p>
                            )}
                            {application.notes && (
                                <p className="text-caption text-text-dim italic line-clamp-2">
                                    {application.notes}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            type="button"
                            onClick={() => onEdit(application.id)}
                            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-caption text-text-dim hover:bg-surface-subtle hover:text-foreground transition-colors"
                            aria-label="Edit notes"
                        >
                            <Pencil className="size-3" />
                            Edit
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(application.id)}
                            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-caption text-text-dim hover:bg-destructive/5 hover:text-destructive transition-colors"
                            aria-label="Remove from tracker"
                        >
                            <Trash2 className="size-3" />
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}