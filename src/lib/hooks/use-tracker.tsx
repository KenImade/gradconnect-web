"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    createApplication,
    deleteApplication,
    listApplicationsClient,
} from "@/lib/api/endpoints/applications";
import { APIError } from "@/lib/api/errors";
import type { User } from "@/lib/api/endpoints/users.types";

/**
 * Tracker state for the current user.
 * Maps opportunity_id -> tracker_entry_id for fast lookup + delete.
 */
type TrackerMap = Record<string, string>;

type TrackerContextValue = {
    user: User | null;
    isVerified: boolean;
    /** Whether this opportunity is currently being tracked. */
    isTracked: (opportunityId: string) => boolean;
    /**
     * Toggle tracking. Returns the next state (true = tracking).
     * Adds as "interested" status on create.
     */
    toggle: (opportunityId: string) => Promise<boolean>;
    count: number;
};

const TrackerContext = createContext<TrackerContextValue | null>(null);

type TrackerProviderProps = {
    user: User | null;
    children: React.ReactNode;
};

export function TrackerProvider({ user, children }: TrackerProviderProps) {
    const [map, setMap] = useState<TrackerMap>({});

    useEffect(() => {
        if (!user) return;

        let cancelled = false;

        listApplicationsClient()
            .then((res) => {
                if (cancelled) return;
                const next: TrackerMap = {};
                for (const item of res.data) {
                    next[item.opportunity.id] = item.id;
                }
                setMap(next);
            })
            .catch(() => {
                // Swallow — user just doesn't see tracker state.
            });

        return () => {
            cancelled = true;
        };
    }, [user?.id]);

    const isTracked = useCallback(
        (opportunityId: string) => Boolean(map[opportunityId]),
        [map],
    );

    const toggle = useCallback(
        async (opportunityId: string): Promise<boolean> => {
            const existingId = map[opportunityId];

            if (existingId) {
                // Optimistic untrack.
                setMap((prev) => {
                    const next = { ...prev };
                    delete next[opportunityId];
                    return next;
                });
                try {
                    await deleteApplication(existingId);
                    return false;
                } catch (err) {
                    setMap((prev) => ({ ...prev, [opportunityId]: existingId }));
                    throw err;
                }
            }

            // Optimistic track.
            const placeholderId = `pending-${opportunityId}`;
            setMap((prev) => ({ ...prev, [opportunityId]: placeholderId }));
            try {
                const created = await createApplication({
                    opportunity_id: opportunityId,
                    status: "interested",
                });
                setMap((prev) => ({ ...prev, [opportunityId]: created.id }));
                return true;
            } catch (err) {
                if (APIError.isAPIError(err) && err.status === 409) {
                    // Already tracking — leave the placeholder.
                    return true;
                }
                setMap((prev) => {
                    const next = { ...prev };
                    delete next[opportunityId];
                    return next;
                });
                throw err;
            }
        },
        [map],
    );

    const value = useMemo<TrackerContextValue>(
        () => ({
            user,
            isVerified: Boolean(user?.email_verified),
            isTracked,
            toggle,
            count: Object.keys(map).length,
        }),
        [user, isTracked, toggle, map],
    );

    return (
        <TrackerContext.Provider value={value}>
            {children}
        </TrackerContext.Provider>
    );
}

export function useTracker(): TrackerContextValue {
    const ctx = useContext(TrackerContext);
    if (!ctx) {
        return {
            user: null,
            isVerified: false,
            isTracked: () => false,
            toggle: async () => {
                throw new Error("Not authenticated");
            },
            count: 0,
        };
    }
    return ctx;
}