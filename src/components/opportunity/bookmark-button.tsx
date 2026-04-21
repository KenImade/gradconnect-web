"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { APIError } from "@/lib/api/errors";

type BookmarkButtonProps = {
    opportunityId: string;
    opportunityTitle: string;
    variant?: "icon" | "inline";
    className?: string;
};

export function BookmarkButton({
    opportunityId,
    opportunityTitle,
    variant = "icon",
    className,
}: BookmarkButtonProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isBookmarked, toggle, isVerified } = useBookmarks();
    const [isBusy, setIsBusy] = useState(false);

    const bookmarked = isBookmarked(opportunityId);

    async function handleClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        if (!isVerified) {
            toast.warning("Verify your email to save opportunities.", {
                description: "Check your dashboard for the verification link.",
                action: {
                    label: "Go to dashboard",
                    onClick: () => router.push("/dashboard"),
                },
            });
            return;
        }

        if (isBusy) return;
        setIsBusy(true);

        try {
            const nowBookmarked = await toggle(opportunityId);
            toast.success(
                nowBookmarked
                    ? `Saved "${truncate(opportunityTitle, 60)}"`
                    : "Removed from shortlist",
            );
        } catch (err) {
            if (APIError.isAPIError(err) && err.status === 403) {
                toast.error("Verify your email to save opportunities.");
            } else {
                toast.error("Couldn't update shortlist. Try again.");
            }
        } finally {
            setIsBusy(false);
        }
    }

    const label = bookmarked ? "Remove from shortlist" : "Save to shortlist";
    const Icon = bookmarked ? BookmarkCheck : Bookmark;

    if (variant === "icon") {
        return (
            <button
                type="button"
                onClick={handleClick}
                disabled={isBusy}
                aria-label={label}
                aria-pressed={bookmarked}
                className={cn(
                    "inline-flex items-center justify-center size-9 rounded-md transition-colors",
                    "hover:bg-surface-subtle",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                    bookmarked && "text-primary",
                    className,
                )}
            >
                {isBusy ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    <Icon className={cn("size-4", bookmarked && "fill-current")} />
                )}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isBusy}
            aria-pressed={bookmarked}
            className={cn(
                "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-body-sm font-medium transition-colors",
                bookmarked
                    ? "border-primary bg-primary/5 text-primary hover:bg-primary/10"
                    : "border-border-strong bg-transparent text-foreground hover:bg-surface-subtle",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                className,
            )}
        >
            {isBusy ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                <Icon className={cn("size-4", bookmarked && "fill-current")} />
            )}
            {bookmarked ? "Saved" : "Save"}
        </button>
    );
}

function truncate(s: string, max: number): string {
    if (s.length <= max) return s;
    return s.slice(0, max - 1).trimEnd() + "…";
}