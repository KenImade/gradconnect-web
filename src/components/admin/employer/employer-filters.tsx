"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { INDUSTRIES } from "@/lib/data/industries";

export function AdminEmployerFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const [query, setQuery] = useState(params.get("q") ?? "");
    const debouncedQuery = useDebounce(query, 300);

    // Sync query string with debounced search
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
    }, [debouncedQuery]); // intentionally narrow

    function setParam(key: string, value: string) {
        const next = new URLSearchParams(params);
        if (value) {
            next.set(key, value);
        } else {
            next.delete(key);
        }
        next.delete("page");
        const qs = next.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname);
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-admin-text-faint" />
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search employers"
                    className="w-full rounded border border-admin-border bg-admin-surface pl-9 pr-3 py-2 text-body-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                />
            </div>

            <select
                value={params.get("industry") ?? ""}
                onChange={(e) => setParam("industry", e.target.value)}
                className="rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
            >
                <option value="">All industries</option>
                {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>
                        {i}
                    </option>
                ))}
            </select>

            <select
                value={params.get("is_verified") ?? ""}
                onChange={(e) => setParam("is_verified", e.target.value)}
                className="rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
            >
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
            </select>
        </div>
    );
}