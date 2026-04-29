"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const STATUSES = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
] as const;

type Status = (typeof STATUSES)[number]["value"];

export function ModerationStatusFilter({ counts }: { counts?: Partial<Record<Status, number>> }) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const current = (params.get("status") ?? "pending") as Status;

    function setStatus(next: Status) {
        const search = new URLSearchParams(params);
        if (next === "pending") {
            search.delete("status");
        } else {
            search.set("status", next);
        }
        // Reset to page 1 on filter change
        search.delete("page");
        const qs = search.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname);
    }

    return (
        <div className="flex items-center gap-1 border-b border-admin-border">
            {STATUSES.map((s) => {
                const isActive = current === s.value;
                const count = counts?.[s.value];
                return (
                    <button
                        key={s.value}
                        type="button"
                        onClick={() => setStatus(s.value)}
                        className={cn(
                            "relative px-3 py-2 text-body-sm transition-colors",
                            isActive
                                ? "text-admin-foreground font-medium"
                                : "text-admin-text-dim hover:text-admin-foreground",
                        )}
                        aria-current={isActive ? "page" : undefined}
                    >
                        {s.label}
                        {typeof count === "number" && count > 0 && (
                            <span
                                className={cn(
                                    "ml-1.5 inline-flex items-center justify-center min-w-5 px-1.5 rounded-full text-caption tabular-nums",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-admin-surface-subtle text-admin-text-faint",
                                )}
                            >
                                {count}
                            </span>
                        )}
                        {isActive && (
                            <span
                                className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                                aria-hidden
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}