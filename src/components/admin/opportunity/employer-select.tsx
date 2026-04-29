"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { listEmployers } from "@/lib/api/endpoints/employers";
import { EmployerLogo } from "@/components/employer/employer-logo";
import { cn } from "@/lib/utils";
import type { EmployerSummary } from "@/lib/api/endpoints/employers.types";

type Props = {
    value: string; // employer_id
    onChange: (id: string, employer?: EmployerSummary) => void;
    initialEmployer?: EmployerSummary;
    error?: string;
    disabled?: boolean;
};

export function EmployerSelect({
    value,
    onChange,
    initialEmployer,
    error,
    disabled,
}: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<EmployerSummary[]>([]);
    const [selected, setSelected] = useState<EmployerSummary | undefined>(
        initialEmployer,
    );

    const debouncedQuery = useDebounce(query, 250);

    // Fetch results when dropdown opens or query changes.
    useEffect(() => {
        if (!open) return;

        let cancelled = false;
        listEmployers({
            ...(debouncedQuery ? { q: debouncedQuery } : {}),
            page_size: 20,
            sort: "name",
        })
            .then((res) => {
                if (cancelled) return;
                setResults(res.data);
            })
            .catch(() => {
                if (cancelled) return;
                setResults([]);
            });

        return () => {
            cancelled = true;
        };
    }, [open, debouncedQuery]);

    function handleSelect(employer: EmployerSummary) {
        setSelected(employer);
        onChange(employer.id, employer);
        setOpen(false);
        setQuery("");
    }

    function handleClear() {
        setSelected(undefined);
        onChange("");
    }

    return (
        <div className="relative">
            <div
                className={cn(
                    "flex items-center gap-2 rounded border bg-admin-surface px-3 py-2 text-body-sm transition-colors",
                    error
                        ? "border-destructive"
                        : "border-admin-border focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/30",
                    disabled && "opacity-60 cursor-not-allowed",
                )}
            >
                {selected ? (
                    <>
                        <EmployerLogo
                            name={selected.name}
                            logoUrl={selected.logo_url}
                            size="sm"
                        />
                        <span className="flex-1 truncate text-admin-foreground">
                            {selected.name}
                        </span>
                        {!disabled && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-admin-text-faint hover:text-admin-foreground transition-colors"
                                aria-label="Clear selection"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </>
                ) : (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => setOpen((v) => !v)}
                        className="flex flex-1 items-center justify-between text-admin-text-dim hover:text-admin-foreground transition-colors disabled:cursor-not-allowed"
                    >
                        Pick an employer…
                        <ChevronDown className="size-4 text-admin-text-faint" />
                    </button>
                )}
            </div>

            {error && (
                <p className="mt-1 text-caption text-destructive">{error}</p>
            )}

            {open && !selected && (
                <div className="absolute left-0 right-0 top-full z-30 mt-1 rounded border border-admin-border bg-admin-surface shadow-md">
                    <div className="relative border-b border-admin-border">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-admin-text-faint" />
                        <input
                            autoFocus
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search employers"
                            className="w-full rounded-t bg-transparent pl-9 pr-3 py-2 text-body-sm focus:outline-none"
                        />
                    </div>
                    <ul className="max-h-64 overflow-y-auto">
                        {results.length === 0 ? (
                            <li className="px-3 py-4 text-center text-caption text-admin-text-faint italic">
                                {debouncedQuery
                                    ? `No employers match "${debouncedQuery}"`
                                    : "No employers"}
                            </li>
                        ) : (
                            results.map((employer) => (
                                <li key={employer.id}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(employer)}
                                        className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-body-sm hover:bg-admin-surface-subtle transition-colors"
                                    >
                                        <EmployerLogo
                                            name={employer.name}
                                            logoUrl={employer.logo_url}
                                            size="sm"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate font-medium text-admin-foreground">
                                                {employer.name}
                                            </p>
                                            <p className="truncate text-caption text-admin-text-faint italic">
                                                {employer.industry}
                                            </p>
                                        </div>
                                        {value === employer.id && (
                                            <Check className="size-4 text-primary" />
                                        )}
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}