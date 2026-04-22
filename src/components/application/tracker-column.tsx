"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { TrackerCard } from "./tracker-card";
import type {
    ApplicationStatus,
    ApplicationTrack,
} from "@/lib/api/endpoints/applications.types";
import {
    STATUS_LABELS,
    STATUS_HINTS,
    STATUS_ACCENT,
} from "@/lib/utils/application";

type TrackerColumnProps = {
    status: ApplicationStatus;
    applications: ApplicationTrack[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
};

export function TrackerColumn({
    status,
    applications,
    onEdit,
    onDelete,
}: TrackerColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: status });

    const ids = applications.map((a) => a.id);

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex min-w-[280px] flex-col border-t-2 transition-colors",
                STATUS_ACCENT[status],
                isOver && "bg-surface-subtle/50",
            )}
        >
            <div className="px-3 py-3">
                <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-heading-sm text-foreground">
                        {STATUS_LABELS[status]}
                    </h3>
                    <span className="text-caption text-text-faint tabular-nums">
                        {applications.length}
                    </span>
                </div>
                <p className="mt-0.5 text-caption text-text-faint italic">
                    {STATUS_HINTS[status]}
                </p>
            </div>

            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                <div className="flex-1 space-y-2 px-3 pb-4 min-h-[60px]">
                    {applications.map((app) => (
                        <TrackerCard
                            key={app.id}
                            application={app}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                    {applications.length === 0 && (
                        <div className="rounded-md border border-dashed border-border py-6 text-center text-caption text-text-faint italic">
                            Drop cards here
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}