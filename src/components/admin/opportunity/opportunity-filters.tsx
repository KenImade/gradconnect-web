"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { OPPORTUNITY_TYPE_LABELS } from "@/lib/utils/opportunity";
import { OPPORTUNITY_TYPE_OPTIONS } from "@/lib/validation/opportunity";

const STATUS_OPTIONS = [
    { value: "all", label: "All statuses" },
    { value: "open", label: "Open" },
    { value: "upcoming", label: "Upcoming" },
    { value: "closed", label: "Closed" },
    { value: "withdrawn", label: "Withdrawn" },
];

export function AdminOpportunityFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const [query, setQuery] = useState(params.get("q") ?? "");
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        const next = new URLSearchParams(params);
        if (debouncedQuery) {
            next.set("q", debouncedQuery);
        } else {
            next.delete("q");
        }
        next.delete("page");
        const qs = next.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery]);

    function setParam(key: string, value: string) {
        const next = new URLSearchParams(params);
        if (value) next.set(key, value);
        else next.delete(key);
        next.delete("page");
        const qs = next.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname);
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-admin-text-faint" />
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search opportunities"
                    className="w-full rounded border border-admin-border bg-admin-surface pl-9 pr-3 py-2 text-body-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                />
            </div>

            <select
                value={params.get("type") ?? ""}
                onChange={(e) => setParam("type", e.target.value)}
                className="rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
            >
                <option value="">All types</option>
                {OPPORTUNITY_TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                        {OPPORTUNITY_TYPE_LABELS[t]}
                    </option>
                ))}
            </select>

            <select
                value={params.get("status") ?? ""}
                onChange={(e) => setParam("status", e.target.value)}
                className="rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
            >
                {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                        {s.label}
                    </option>
                ))}
            </select>
        </div>
    );
}