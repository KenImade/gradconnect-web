"use client";

import { useEffect, useState } from "react";

/**
 * Returns a debounced version of the value.
 * Useful for search inputs — wait for the user to stop typing before firing.
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(timer);
    }, [value, delayMs]);

    return debounced;
}