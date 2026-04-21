import { fetchAPIClient } from "../client";
import type { Envelope, PaginatedEnvelope } from "../envelope";
import type { BookmarkStub, BookmarkListItem } from "./bookmarks.types";

/**
 * GET /me/bookmarks — client-side variant for hook-driven fetches.
 * Used by the BookmarkProvider to hydrate the initial set.
 */
export async function listBookmarksClient(): Promise<PaginatedEnvelope<BookmarkListItem[]>> {
    return fetchAPIClient<PaginatedEnvelope<BookmarkListItem[]>>(
        "/me/bookmarks?page_size=100",
    );
}

/**
 * POST /me/bookmarks — create a bookmark. Returns the stub (no embedded opportunity).
 */
export async function createBookmark(
    opportunityId: string,
): Promise<BookmarkStub> {
    const response = await fetchAPIClient<Envelope<BookmarkStub>>(
        "/me/bookmarks",
        {
            method: "POST",
            body: JSON.stringify({ opportunity_id: opportunityId }),
        },
    );
    return response.data;
}

/**
 * DELETE /me/bookmarks/:id — remove a bookmark.
 */
export async function deleteBookmark(bookmarkId: string): Promise<void> {
    await fetchAPIClient(`/me/bookmarks/${bookmarkId}`, {
        method: "DELETE",
    });
}