"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImportRefreshButton() {
    const router = useRouter();
    const [refreshing, startRefreshing] = useTransition();

    return (
        <button
            type="button"
            onClick={() => startRefreshing(() => router.refresh())}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded border border-admin-border bg-admin-surface px-2.5 py-1 text-caption font-medium text-admin-text-dim hover:bg-admin-surface-subtle transition-colors disabled:opacity-50"
        >
            <RefreshCw
                className={cn("size-3", refreshing && "animate-spin")}
                aria-hidden
            />
            Refresh
        </button>
    );
}