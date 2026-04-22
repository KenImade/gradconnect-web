"use client";

import { useState } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { EmployerLogo } from "@/components/employer/employer-logo";
import { createApplication } from "@/lib/api/endpoints/applications";
import { listBookmarksClient } from "@/lib/api/endpoints/bookmarks";
import { APIError } from "@/lib/api/errors";
import type { BookmarkListItem } from "@/lib/api/endpoints/bookmarks.types";
import type {
    ApplicationTrack,
    TrackedOpportunity,
} from "@/lib/api/endpoints/applications.types";

type AddFromShortlistDialogProps = {
    open: boolean;
    onClose: () => void;
    existingOpportunityIds: Set<string>;
    onAdded: (app: ApplicationTrack) => void;
};

export function AddFromShortlistDialog({
    open,
    onClose,
    existingOpportunityIds,
    onAdded,
}: AddFromShortlistDialogProps) {
    const queryClient = useQueryClient();
    const [adding, setAdding] = useState<string | null>(null);

    // Fetch bookmarks only when the dialog is open
    const {
        data: bookmarksResponse,
        isLoading,
        isError
    } = useQuery({
        queryKey: ["bookmarks"],
        queryFn: listBookmarksClient,
        enabled: open,
    });

    const bookmarks = bookmarksResponse?.data ?? [];

    async function handleAdd(bookmark: BookmarkListItem) {
        setAdding(bookmark.id);
        try {
            const created = await createApplication({
                opportunity_id: bookmark.opportunity.id,
                status: "interested",
            });

            const tracked: TrackedOpportunity = {
                id: bookmark.opportunity.id,
                title: bookmark.opportunity.title,
                slug: bookmark.opportunity.slug,
                type: bookmark.opportunity.type,
                deadline: bookmark.opportunity.deadline,
                employer: {
                    name: bookmark.opportunity.employer.name,
                    slug: bookmark.opportunity.employer.slug,
                    logo_url: bookmark.opportunity.employer.logo_url,
                },
            };

            onAdded({
                id: created.id,
                status: created.status,
                notes: created.notes,
                updated_at: created.updated_at,
                opportunity: tracked,
            });

            toast.success(`Added "${bookmark.opportunity.title}" to tracker`);

            // Optionally invalidate the cache to keep bookmarks in sync
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
        } catch (err) {
            if (APIError.isAPIError(err) && err.status === 409) {
                toast.error("Already tracking this opportunity.");
            } else {
                toast.error("Couldn't add. Try again.");
            }
        } finally {
            setAdding(null);
        }
    }

    const available = bookmarks.filter(
        (b) => !existingOpportunityIds.has(b.opportunity.id),
    );

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="font-display">Add from shortlist</DialogTitle>
                    <DialogDescription>
                        Pick a bookmarked opportunity to start tracking.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto -mx-6 px-6">
                    {isLoading && (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="size-5 animate-spin text-text-faint" />
                        </div>
                    )}

                    {isError && (
                        <p className="py-6 text-center text-body-sm text-destructive">
                            Couldn&apos;t load your shortlist.
                        </p>
                    )}

                    {!isLoading && !isError && available.length === 0 && (
                        <div className="py-10 text-center">
                            <p className="text-body-sm text-text-dim">
                                {bookmarks.length === 0
                                    ? "You haven't saved any opportunities yet."
                                    : "You're already tracking everything in your shortlist."}
                            </p>
                            <p className="mt-2 text-caption text-text-faint italic">
                                {bookmarks.length === 0
                                    ? "Browse opportunities and save a few first."
                                    : "Save more opportunities to add here."}
                            </p>
                        </div>
                    )}

                    {!isLoading && !isError && available.length > 0 && (
                        <ul className="border-t border-border">
                            {available.map((bookmark) => {
                                const isAdding = adding === bookmark.id;
                                return (
                                    <li
                                        key={bookmark.id}
                                        className="flex items-center gap-4 border-b border-border py-3"
                                    >
                                        <EmployerLogo
                                            name={bookmark.opportunity.employer.name}
                                            logoUrl={bookmark.opportunity.employer.logo_url}
                                            size="sm"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-body-sm font-medium text-foreground line-clamp-1">
                                                {bookmark.opportunity.title}
                                            </p>
                                            <p className="text-caption text-text-faint italic line-clamp-1">
                                                {bookmark.opportunity.employer.name}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleAdd(bookmark)}
                                            disabled={isAdding}
                                            className="inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-transparent px-3 py-1.5 text-caption font-medium text-foreground hover:bg-surface-subtle disabled:opacity-60 transition-colors"
                                        >
                                            {isAdding ? (
                                                <Loader2 className="size-3 animate-spin" />
                                            ) : (
                                                <PlusCircle className="size-3" />
                                            )}
                                            Add
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}