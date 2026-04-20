"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
    currentPage: number;
    lastPage: number;
    className?: string;
};

/**
 * Numbered pagination with prev/next arrows.
 * Uses Link components so pages are real URLs — shareable, indexable, work with the back button.
 */
export function Pagination({ currentPage, lastPage, className }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (lastPage <= 1) return null;

    function buildPageURL(page: number) {
        const params = new URLSearchParams(searchParams.toString());
        if (page === 1) {
            params.delete("page"); // Keep /employers clean for page 1
        } else {
            params.set("page", String(page));
        }
        const qs = params.toString();
        return qs ? `${pathname}?${qs}` : pathname;
    }

    const pages = getPageList(currentPage, lastPage);
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < lastPage ? currentPage + 1 : null;

    return (
        <nav
            className={cn("flex items-center justify-center gap-1", className)}
            aria-label="Pagination"
        >
            {/* Previous */}
            {prevPage ? (
                <Link
                    href={buildPageURL(prevPage)}
                    className="inline-flex size-9 items-center justify-center rounded-md border border-border text-text-dim hover:border-border-strong hover:text-foreground transition-colors"
                    aria-label={`Go to page ${prevPage}`}
                >
                    <ChevronLeft className="size-4" />
                </Link>
            ) : (
                <span
                    className="inline-flex size-9 items-center justify-center rounded-md border border-border text-text-faint cursor-not-allowed"
                    aria-disabled="true"
                    aria-label="No previous page"
                >
                    <ChevronLeft className="size-4" />
                </span>
            )}

            {/* Page numbers */}
            {pages.map((item, idx) =>
                item === "…" ? (
                    <span
                        key={`gap-${idx}`}
                        className="inline-flex size-9 items-center justify-center text-caption text-text-faint"
                        aria-hidden="true"
                    >
                        …
                    </span>
                ) : item === currentPage ? (
                    <span
                        key={item}
                        className="inline-flex size-9 items-center justify-center rounded-md bg-primary text-body-sm font-medium text-primary-foreground"
                        aria-current="page"
                        aria-label={`Current page, page ${item}`}
                    >
                        {item}
                    </span>
                ) : (
                    <Link
                        key={item}
                        href={buildPageURL(item)}
                        className="inline-flex size-9 items-center justify-center rounded-md border border-border text-body-sm text-text-dim hover:border-border-strong hover:text-foreground transition-colors"
                        aria-label={`Go to page ${item}`}
                    >
                        {item}
                    </Link>
                ),
            )}

            {/* Next */}
            {nextPage ? (
                <Link
                    href={buildPageURL(nextPage)}
                    className="inline-flex size-9 items-center justify-center rounded-md border border-border text-text-dim hover:border-border-strong hover:text-foreground transition-colors"
                    aria-label={`Go to page ${nextPage}`}
                >
                    <ChevronRight className="size-4" />
                </Link>
            ) : (
                <span
                    className="inline-flex size-9 items-center justify-center rounded-md border border-border text-text-faint cursor-not-allowed"
                    aria-disabled="true"
                    aria-label="No next page"
                >
                    <ChevronRight className="size-4" />
                </span>
            )}
        </nav>
    );
}

/**
 * Build a page list with ellipses for large counts.
 * Always shows first, last, current, and neighbors of current.
 *
 * Examples (current of total):
 *   1 of 1      → []           (component returns null above)
 *   2 of 5      → [1, 2, 3, 4, 5]
 *   5 of 20     → [1, …, 4, 5, 6, …, 20]
 *   1 of 20     → [1, 2, 3, …, 20]
 *   20 of 20    → [1, …, 18, 19, 20]
 */
function getPageList(current: number, last: number): Array<number | "…"> {
    if (last <= 7) {
        return Array.from({ length: last }, (_, i) => i + 1);
    }

    const pages: Array<number | "…"> = [1];

    if (current > 3) pages.push("…");

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < last - 2) pages.push("…");

    pages.push(last);

    return pages;
}