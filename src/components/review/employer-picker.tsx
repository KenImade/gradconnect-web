"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { listEmployers } from "@/lib/api/endpoints/employers";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { EmployerLogo } from "@/components/employer/employer-logo";
import type { EmployerSummary } from "@/lib/api/endpoints/employers.types";

export function EmployerPicker() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<EmployerSummary[]>([]);
    const [loading, setLoading] = useState(false);

    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        listEmployers(debouncedQuery ? { q: debouncedQuery, page_size: 10 } : { page_size: 10 })
            .then((res) => {
                if (cancelled) return;
                setResults(res.data);
                setLoading(false);
            })
            .catch(() => {
                if (cancelled) return;
                setResults([]);
                setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [debouncedQuery]);

    return (
        <div>
            <label htmlFor="employer-search" className="sr-only">
                Search employers
            </label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-faint" />
                <input
                    id="employer-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for an employer…"
                    className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-3 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                    autoFocus
                />
            </div>

            <div className="mt-6">
                {loading && (
                    <div className="flex justify-center py-8">
                        <Loader2 className="size-5 animate-spin text-text-faint" />
                    </div>
                )}

                {!loading && results.length === 0 && debouncedQuery && (
                    <p className="py-8 text-center text-body-sm text-text-dim italic">
                        No employers match &ldquo;{debouncedQuery}&rdquo;.
                    </p>
                )}

                {!loading && results.length > 0 && (
                    <ul className="border-t border-border">
                        {results.map((employer) => (
                            <li
                                key={employer.id}
                                className="border-b border-border"
                            >
                                <Link
                                    href={`/reviews/new?employer=${employer.slug}`}
                                    className="flex items-center gap-4 py-4 hover:bg-surface-subtle/50 transition-colors"
                                >
                                    <EmployerLogo
                                        name={employer.name}
                                        logoUrl={employer.logo_url}
                                        size="sm"
                                    />
                                    <div>
                                        <p className="text-body-md font-medium text-foreground">
                                            {employer.name}
                                        </p>
                                        <p className="text-caption text-text-faint italic">
                                            {employer.industry}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}