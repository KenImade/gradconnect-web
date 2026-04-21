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
    createBookmark,
    deleteBookmark,
    listBookmarksClient,
} from "@/lib/api/endpoints/bookmarks";
import { APIError } from "@/lib/api/errors";
import type { User } from "@/lib/api/endpoints/users.types";

/**
 * Bookmark state for the current user.
 * Maps opportunity_id -> bookmark_id so we can both check existence
 * and know which bookmark row to DELETE.
 *
 * NOTE on lifecycle: the provider is keyed by `user?.id` at the layout level,
 * so sign-in / sign-out unmounts + remounts the provider.
 */
type BookmarkMap = Record<string, string>;

type BookmarksContextValue = {
    user: User | null;
    isVerified: boolean;
    isBookmarked: (opportunityId: string) => boolean;
    toggle: (opportunityId: string) => Promise<boolean>;
    count: number;
};

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

type BookmarksProviderProps = {
    user: User | null;
    children: React.ReactNode;
};

export function BookmarksProvider({ user, children }: BookmarksProviderProps) {
    const [map, setMap] = useState<BookmarkMap>({});

    // Fetch initial bookmarks when the provider mounts with a user.
    useEffect(() => {
        if (!user) return;

        let cancelled = false;

        listBookmarksClient()
            .then((res: Awaited<ReturnType<typeof listBookmarksClient>>) => {
                if (cancelled) return;
                const next: BookmarkMap = {};
                for (const item of res.data) {
                    next[item.opportunity.id] = item.id;
                }
                setMap(next);
            })
            .catch(() => {
                // Swallow errors — user sees no bookmark state.
            });

        return () => {
            cancelled = true;
        };
    }, [user?.id]);

    const isBookmarked = useCallback(
        (opportunityId: string) => Boolean(map[opportunityId]),
        [map],
    );

    const toggle = useCallback(
        async (opportunityId: string): Promise<boolean> => {
            const existingBookmarkId = map[opportunityId];

            if (existingBookmarkId) {
                setMap((prev) => {
                    const next = { ...prev };
                    delete next[opportunityId];
                    return next;
                });
                try {
                    await deleteBookmark(existingBookmarkId);
                    return false;
                } catch (err) {
                    setMap((prev) => ({
                        ...prev,
                        [opportunityId]: existingBookmarkId,
                    }));
                    throw err;
                }
            }

            const placeholderId = `pending-${opportunityId}`;
            setMap((prev) => ({ ...prev, [opportunityId]: placeholderId }));

            try {
                const created = await createBookmark(opportunityId);
                setMap((prev) => ({ ...prev, [opportunityId]: created.id }));
                return true;
            } catch (err) {
                if (APIError.isAPIError(err) && err.status === 409) {
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

    const value = useMemo<BookmarksContextValue>(
        () => ({
            user,
            isVerified: Boolean(user?.email_verified),
            isBookmarked,
            toggle,
            count: Object.keys(map).length,
        }),
        [user, isBookmarked, toggle, map],
    );

    return (
        <BookmarksContext.Provider value={value}>
            {children}
        </BookmarksContext.Provider>
    );
}

export function useBookmarks(): BookmarksContextValue {
    const ctx = useContext(BookmarksContext);
    if (!ctx) {
        return {
            user: null,
            isVerified: false,
            isBookmarked: () => false,
            toggle: async () => {
                throw new Error("Not authenticated");
            },
            count: 0,
        };
    }
    return ctx;
}