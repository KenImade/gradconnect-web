"use client";

import { useState, useMemo } from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    closestCenter,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { toast } from "sonner";
import {
    updateApplication,
    deleteApplication,
} from "@/lib/api/endpoints/applications";
import type {
    ApplicationStatus,
    ApplicationTrack,
} from "@/lib/api/endpoints/applications.types";
import { APPLICATION_STATUSES } from "@/lib/utils/application";
import { APIError } from "@/lib/api/errors";
import { TrackerColumn } from "./tracker-column";
import { TrackerCard } from "./tracker-card";
import { EditNotesDialog } from "./edit-notes-dialog";

type TrackerBoardProps = {
    initial: ApplicationTrack[];
};

export function TrackerBoard({ initial }: TrackerBoardProps) {
    const [applications, setApplications] = useState<ApplicationTrack[]>(initial);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    // Group applications by status, preserving insertion order from the flat list.
    const grouped = useMemo(() => {
        const out: Record<ApplicationStatus, ApplicationTrack[]> = {
            interested: [],
            applied: [],
            assessment: [],
            interview: [],
            offer: [],
            rejected: [],
        };
        for (const app of applications) {
            out[app.status].push(app);
        }
        return out;
    }, [applications]);

    const activeApp = useMemo(
        () => applications.find((a) => a.id === activeId) ?? null,
        [applications, activeId],
    );

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        // `over.id` is either a status (column drop) or an application id (card drop).
        // We need the destination status either way.
        let destinationStatus: ApplicationStatus | null = null;

        if (APPLICATION_STATUSES.includes(over.id as ApplicationStatus)) {
            destinationStatus = over.id as ApplicationStatus;
        } else {
            const overApp = applications.find((a) => a.id === over.id);
            if (overApp) destinationStatus = overApp.status;
        }

        if (!destinationStatus) return;

        const movedApp = applications.find((a) => a.id === active.id);
        if (!movedApp || movedApp.status === destinationStatus) return;

        const previousStatus = movedApp.status;

        // Optimistic update.
        setApplications((prev) =>
            prev.map((a) =>
                a.id === active.id ? { ...a, status: destinationStatus! } : a,
            ),
        );

        try {
            await updateApplication(active.id as string, {
                status: destinationStatus,
            });
        } catch (err) {
            // Revert.
            setApplications((prev) =>
                prev.map((a) =>
                    a.id === active.id ? { ...a, status: previousStatus } : a,
                ),
            );
            if (APIError.isAPIError(err) && err.status === 403) {
                toast.error("Verify your email to update your tracker.");
            } else {
                toast.error("Couldn't update status. Try again.");
            }
        }
    }

    async function handleDelete(id: string) {
        const prev = applications;
        setApplications((all) => all.filter((a) => a.id !== id));

        try {
            await deleteApplication(id);
            toast.success("Removed from tracker");
        } catch (err) {
            setApplications(prev);
            if (APIError.isAPIError(err) && err.status === 404) {
                // Already gone somehow — success path.
                setApplications((all) => all.filter((a) => a.id !== id));
                return;
            }
            toast.error("Couldn't remove. Try again.");
        }
    }

    function handleEdit(id: string) {
        setEditingId(id);
    }

    function handleNotesSaved(updatedApp: ApplicationTrack) {
        setApplications((prev) =>
            prev.map((a) => (a.id === updatedApp.id ? updatedApp : a)),
        );
        setEditingId(null);
    }

    const editingApp = applications.find((a) => a.id === editingId) ?? null;

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="mt-8 grid gap-4 overflow-x-auto pb-6 [grid-template-columns:repeat(6,minmax(280px,1fr))]">
                    {APPLICATION_STATUSES.map((status) => (
                        <TrackerColumn
                            key={status}
                            status={status}
                            applications={grouped[status]}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeApp ? (
                        <TrackerCard
                            application={activeApp}
                            onEdit={() => { }}
                            onDelete={() => { }}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {editingApp && (
                <EditNotesDialog
                    application={editingApp}
                    open={Boolean(editingApp)}
                    onClose={() => setEditingId(null)}
                    onSaved={handleNotesSaved}
                />
            )}
        </>
    );
}