"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, Compass, PlusCircle } from "lucide-react";
import { TrackerBoard } from "./tracker-board";
import { AddFromShortlistDialog } from "./add-from-shortlist-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import type { ApplicationTrack } from "@/lib/api/endpoints/applications.types";

type TrackerPageClientProps = {
    initial: ApplicationTrack[];
};

export function TrackerPageClient({ initial }: TrackerPageClientProps) {
    const [applications, setApplications] = useState(initial);
    const [addOpen, setAddOpen] = useState(false);

    const existingOpportunityIds = new Set(
        applications.map((a) => a.opportunity.id),
    );

    function handleAdded(app: ApplicationTrack) {
        setApplications((prev) => [app, ...prev]);
    }

    const isEmpty = applications.length === 0;

    return (
        <>
            {/* Action row — always visible so users can add a first entry */}
            <div className="mt-6 flex">
                <button
                    type="button"
                    onClick={() => setAddOpen(true)}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                >
                    <PlusCircle className="size-4" />
                    Add from shortlist
                </button>
            </div>

            {isEmpty ? (
                <div className="mt-12">
                    <EmptyState
                        icon={ClipboardList}
                        title="Nothing tracked yet"
                        description="Start tracking applications to see your pipeline from 'Interested' through to 'Offer.' Add opportunities from your shortlist using the button above, or browse to discover new ones."
                        action={
                            <div className="flex flex-wrap justify-center gap-3">
                                <Link
                                    href="/shortlist"
                                    className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-transparent px-5 py-2.5 text-body-sm font-medium text-foreground hover:bg-surface-subtle transition-colors"
                                >
                                    <ClipboardList className="size-4" />
                                    Go to shortlist
                                </Link>
                                <Link
                                    href="/opportunities"
                                    className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-transparent px-5 py-2.5 text-body-sm font-medium text-foreground hover:bg-surface-subtle transition-colors"
                                >
                                    <Compass className="size-4" />
                                    Browse opportunities
                                </Link>
                            </div>
                        }
                    />
                </div>
            ) : (
                <TrackerBoard
                    initial={applications}
                    key={applications.length}
                />
            )}

            <AddFromShortlistDialog
                open={addOpen}
                onClose={() => setAddOpen(false)}
                existingOpportunityIds={existingOpportunityIds}
                onAdded={handleAdded}
            />
        </>
    );
}