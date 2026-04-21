import "server-only";
import { fetchAPI } from "../server";
import { buildQueryString } from "@/lib/utils/url";
import type { PaginatedEnvelope } from "../envelope";
import type {
    BookmarkListItem,
    ListBookmarksParams,
} from "./bookmarks.types";

/**
 * GET /me/bookmarks — server-side list for /shortlist page rendering.
 */
export async function listBookmarks(
    params: ListBookmarksParams = {},
): Promise<PaginatedEnvelope<BookmarkListItem[]>> {
    const qs = buildQueryString(params);
    return fetchAPI<PaginatedEnvelope<BookmarkListItem[]>>(
        `/me/bookmarks${qs}`,
    );
}