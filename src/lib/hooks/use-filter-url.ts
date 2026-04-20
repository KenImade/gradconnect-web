"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * Hook for reading/writing URL query params as filter state.
 *
 * `updateFilters({ q: "bank", industry: null })` sets q=bank and removes industry.
 * `null` or empty string removes the param entirely.
 * Always resets `page` to 1 when a non-page filter changes, so pagination doesn't
 * get stuck on a page that no longer exists after filtering.
 */
export function useFilterURL() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateFilters = useCallback(
        (updates: Record<string, string | number | boolean | null>) => {
            const params = new URLSearchParams(searchParams.toString());

            const resetsPage = Object.keys(updates).some((key) => key !== "page");

            for (const [key, value] of Object.entries(updates)) {
                if (value === null || value === "") {
                    params.delete(key);
                } else {
                    params.set(key, String(value));
                }
            }

            if (resetsPage) {
                params.delete("page");
            }

            const qs = params.toString();
            router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
        },
        [router, pathname, searchParams],
    );

    return { searchParams, updateFilters };
}