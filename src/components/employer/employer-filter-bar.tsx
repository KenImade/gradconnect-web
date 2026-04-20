"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFilterURL } from "@/lib/hooks/use-filter-url";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { INDUSTRIES } from "@/lib/data/industries";

export function EmployerFilterBar() {
    const { searchParams, updateFilters } = useFilterURL();

    const urlQuery = searchParams.get("q") ?? "";
    const industry = searchParams.get("industry") ?? "";
    const verified = searchParams.get("is_verified") ?? "";
    const sort = searchParams.get("sort") ?? "name";

    // Local input state for the search box — typing feels instant
    const [searchInput, setSearchInput] = useState(urlQuery);
    const debouncedSearch = useDebounce(searchInput, 300);

    // Sync debounced search -> URL, but only when it actually diverges
    useEffect(() => {
        if (debouncedSearch !== urlQuery) {
            updateFilters({ q: debouncedSearch || null });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const hasActiveFilters = Boolean(
        urlQuery || industry || verified || sort !== "name",
    );

    function clearAll() {
        setSearchInput("");
        updateFilters({
            q: null,
            industry: null,
            is_verified: null,
            sort: null,
            order: null,
        });
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search — keyed on urlQuery so external URL changes remount the input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-faint" />
                    <input
                        key={urlQuery}
                        type="search"
                        defaultValue={urlQuery}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search employers by name, industry, or location"
                        className="w-full rounded-md border border-border bg-background py-2.5 pl-10 pr-10 text-body-sm placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                        aria-label="Search employers"
                    />
                    {searchInput && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchInput("");
                                updateFilters({ q: null });
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-foreground transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                {/* Industry */}
                <Select
                    value={industry || "all"}
                    onValueChange={(v) =>
                        updateFilters({ industry: v === "all" ? null : v })
                    }
                >
                    <SelectTrigger className="w-full sm:w-50">
                        <SelectValue placeholder="All industries" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All industries</SelectItem>
                        {INDUSTRIES.map((ind) => (
                            <SelectItem key={ind} value={ind}>
                                {ind}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Sort */}
                <Select
                    value={sort}
                    onValueChange={(v) =>
                        updateFilters({ sort: v === "name" ? null : v })
                    }
                >
                    <SelectTrigger className="w-full sm:w-45">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Name (A–Z)</SelectItem>
                        <SelectItem value="created_at">Recently added</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() =>
                        updateFilters({
                            is_verified: verified === "true" ? null : "true",
                        })
                    }
                    className={
                        verified === "true"
                            ? "rounded-full border border-primary bg-primary/10 text-primary px-3 py-1 text-caption transition-colors"
                            : "rounded-full border border-border text-text-dim hover:border-border-strong px-3 py-1 text-caption transition-colors"
                    }
                    aria-pressed={verified === "true"}
                >
                    {verified === "true" ? "✓ " : ""}Verified only
                </button>

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="ml-auto text-caption text-text-dim hover:text-foreground transition-colors"
                    >
                        Clear all filters
                    </button>
                )}
            </div>
        </div>
    );
}