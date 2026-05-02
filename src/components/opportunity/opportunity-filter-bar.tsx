"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
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
import { OPPORTUNITY_TYPE_LABELS } from "@/lib/utils/opportunity";
import type { OpportunityType } from "@/lib/api/endpoints/opportunities.types";

const TYPE_OPTIONS: OpportunityType[] = [
    "graduate_trainee",
    "internship",
    "nysc",
    "industrial_attachment",
];

const STATUS_OPTIONS = [
    { value: "open", label: "Open now" },
    { value: "upcoming", label: "Upcoming" },
    { value: "all", label: "All statuses" },
];

export function OpportunityFilterBar() {
    const { searchParams, updateFilters } = useFilterURL();

    const urlQuery = searchParams.get("q") ?? "";
    const urlLocation = searchParams.get("location") ?? "";
    const urlDiscipline = searchParams.get("discipline") ?? "";
    const type = searchParams.get("type") ?? "";
    const status = searchParams.get("status") ?? "open";
    const industry = searchParams.get("industry") ?? "";

    // Debounced text inputs — all three use local state + debounce → URL
    const [searchInput, setSearchInput] = useState(urlQuery);
    const [locationInput, setLocationInput] = useState(urlLocation);
    const [disciplineInput, setDisciplineInput] = useState(urlDiscipline);

    const debouncedSearch = useDebounce(searchInput, 300);
    const debouncedLocation = useDebounce(locationInput, 400);
    const debouncedDiscipline = useDebounce(disciplineInput, 400);

    const [showMore, setShowMore] = useState(
        Boolean(urlLocation || urlDiscipline || industry),
    );

    // Sync debounced values to URL only when they diverge from what the URL holds
    useEffect(() => {
        if (debouncedSearch !== urlQuery) {
            updateFilters({ q: debouncedSearch || null });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    useEffect(() => {
        if (debouncedLocation !== urlLocation) {
            updateFilters({ location: debouncedLocation || null });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedLocation]);

    useEffect(() => {
        if (debouncedDiscipline !== urlDiscipline) {
            updateFilters({ discipline: debouncedDiscipline || null });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedDiscipline]);

    const hasActiveFilters = Boolean(
        urlQuery ||
        type ||
        status !== "open" ||
        industry ||
        urlLocation ||
        urlDiscipline ||
        searchParams.get("employer"),
    );

    function clearAll() {
        setSearchInput("");
        setLocationInput("");
        setDisciplineInput("");
        updateFilters({
            q: null,
            type: null,
            status: null,
            employer: null,
            industry: null,
            location: null,
            discipline: null,
            sort: null,
            order: null,
        });
    }

    return (
        <div className="space-y-4">
            {/* Row 1: primary filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-faint" />
                    <input
                        type="search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search by role, employer, or keyword"
                        className="w-full rounded-md border border-border bg-background py-2.5 pl-10 pr-10 text-body-sm placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                        aria-label="Search opportunities"
                    />
                    {searchInput && (
                        <button
                            type="button"
                            onClick={() => setSearchInput("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-foreground transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                <Select
                    value={type || "all"}
                    onValueChange={(v) => updateFilters({ type: v === "all" ? null : v })}
                >
                    <SelectTrigger className="w-full sm:w-45">
                        <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {TYPE_OPTIONS.map((t) => (
                            <SelectItem key={t} value={t}>
                                {OPPORTUNITY_TYPE_LABELS[t]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={status}
                    onValueChange={(v) =>
                        updateFilters({ status: v === "open" ? null : v })
                    }
                >
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                                {s.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Row 2: advanced filters (collapsible) */}
            <div>
                <button
                    type="button"
                    onClick={() => setShowMore((v) => !v)}
                    className="inline-flex items-center gap-1 text-caption text-text-dim hover:text-foreground transition-colors"
                    aria-expanded={showMore}
                >
                    {showMore ? (
                        <ChevronUp className="size-3" />
                    ) : (
                        <ChevronDown className="size-3" />
                    )}
                    {showMore ? "Hide" : "More"} filters
                </button>

                {showMore && (
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <Select
                            value={industry || "all"}
                            onValueChange={(v) =>
                                updateFilters({ industry: v === "all" ? null : v })
                            }
                        >
                            <SelectTrigger>
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

                        <input
                            type="text"
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            placeholder="Location (e.g. Lagos)"
                            className="rounded-md border border-border bg-background px-3 py-2 text-body-sm placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                            aria-label="Filter by location"
                        />

                        <input
                            type="text"
                            value={disciplineInput}
                            onChange={(e) => setDisciplineInput(e.target.value)}
                            placeholder="Discipline (e.g. Engineering)"
                            className="rounded-md border border-border bg-background px-3 py-2 text-body-sm placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                            aria-label="Filter by discipline"
                        />
                    </div>
                )}
            </div>

            {hasActiveFilters && (
                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        onClick={clearAll}
                        className="text-caption text-text-dim hover:text-foreground transition-colors"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}