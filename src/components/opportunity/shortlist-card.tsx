"use client";

import Link from "next/link";
import { useState } from "react";
import { Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { deleteBookmark } from "@/lib/api/endpoints/bookmarks";
import { EmployerLogo } from "@/components/employer/employer-logo";
import { TypeBadge } from "./type-badge";
import { DeadlineCountdown } from "./deadline-countdown";
import type { BookmarkListItem } from "@/lib/api/endpoints/bookmarks.types";
import { APIError } from "@/lib/api/errors";

type ShortlistCardProps = {
    bookmark: BookmarkListItem;
    /** Called after the user successfully removes this bookmark. */
    onRemove: (bookmarkId: string) => void;
};

export function ShortlistCard({ bookmark, onRemove }: ShortlistCardProps) {
    const { opportunity } = bookmark;
    const { employer } = opportunity;
    const [isRemoving, setIsRemoving] = useState(false);

    // Derive a human-friendly status.
    // Backend gives us is_active + days_remaining. If days_remaining < 0 or null,
    // the opportunity is closed. If is_active is false, it's withdrawn.
    const isWithdrawn = !opportunity.is_active;
    const isClosed =
        !isWithdrawn &&
        opportunity.days_remaining !== null &&
        opportunity.days_remaining < 0;
    const isStale = isWithdrawn || isClosed;

    async function handleRemove(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (isRemoving) return;
        setIsRemoving(true);

        try {
            await deleteBookmark(bookmark.id);
            toast.success("Removed from shortlist");
            onRemove(bookmark.id);
        } catch (err) {
            setIsRemoving(false);
            if (APIError.isAPIError(err) && err.status === 404) {
                // Already gone somehow — treat as success.
                onRemove(bookmark.id);
                return;
            }
            toast.error("Couldn't remove. Try again.");
        }
    }

    return (
        <Link
            href={`/opportunities/${opportunity.slug}`}
            className={cn(
                "group block border-b border-border py-6 transition-colors",
                "hover:bg-surface-subtle/50",
                "focus-visible:outline-none focus-visible:bg-surface-subtle/70",
                isStale && "opacity-70",
            )}
        >
            <div className="flex items-start gap-5">
                <EmployerLogo
                    name={employer.name}
                    logoUrl={employer.logo_url}
                    size="md"
                />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                        <p className="text-caption text-text-faint">
                            <span className="text-foreground font-medium">{employer.name}</span>
                            <span className="mx-1.5 text-border-strong">—</span>
                            <span className="italic">{employer.industry}</span>
                        </p>
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={isRemoving}
                            aria-label={`Remove "${opportunity.title}" from shortlist`}
                            className="inline-flex items-center justify-center size-9 rounded-md text-text-faint transition-colors hover:bg-destructive/5 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isRemoving ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Trash2 className="size-4" />
                            )}
                        </button>
                    </div>

                    <h3 className="mt-2 font-display text-heading-md text-foreground group-hover:text-primary transition-colors line-clamp-2 max-w-[52ch]">
                        {opportunity.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-caption">
                        <TypeBadge type={opportunity.type} />
                        {isWithdrawn ? (
                            <span className="inline-flex items-center gap-1 text-text-faint italic">
                                <AlertCircle className="size-3" />
                                Withdrawn
                            </span>
                        ) : isClosed ? (
                            <span className="inline-flex items-center gap-1 text-text-faint italic">
                                <AlertCircle className="size-3" />
                                Closed
                            </span>
                        ) : (
                            <DeadlineCountdown daysRemaining={opportunity.days_remaining} />
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}