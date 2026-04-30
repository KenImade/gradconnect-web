"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function AdminAssessmentFilters() {
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

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-admin-text-faint" />
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search programme type or employer name"
                    className="w-full rounded border border-admin-border bg-admin-surface pl-9 pr-3 py-2 text-body-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30"
                />
            </div>
        </div>
    );
}