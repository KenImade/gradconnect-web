"use client";

import { useState } from "react";
import { ShortlistCard } from "./shortlist-card";
import type { BookmarkListItem } from "@/lib/api/endpoints/bookmarks.types";

type ShortlistListProps = {
    initial: BookmarkListItem[];
};

export function ShortlistList({ initial }: ShortlistListProps) {
    const [items, setItems] = useState(initial);

    function handleRemove(bookmarkId: string) {
        setItems((prev) => prev.filter((item) => item.id !== bookmarkId));
    }

    if (items.length === 0) {
        // All removed in this session — show a gentle empty state instead of refetching.
        return (
            <div className="mt-8 border-l-2 border-border pl-6 py-3">
                <p className="text-body-sm text-text-dim">
                    You removed all the items from your shortlist. Refresh the page to see them
                    reappear, or save new opportunities.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-8 border-t border-border">
            {items.map((item) => (
                <ShortlistCard key={item.id} bookmark={item} onRemove={handleRemove} />
            ))}
        </div>
    );
}