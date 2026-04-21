/**
 * Raw bookmark returned by POST /me/bookmarks — minimal.
 */
export type BookmarkStub = {
    id: string;
    opportunity_id: string;
    created_at: string;
};

/**
 * Bookmark item in the list response — partial embedded opportunity.
 * Reflects the actual backend shape, not the full Opportunity type.
 */
export type BookmarkListItem = {
    id: string;
    created_at: string;
    opportunity: {
        id: string;
        title: string;
        slug: string;
        type: "graduate_trainee" | "internship" | "nysc" | "industrial_attachment";
        deadline: string | null;
        days_remaining: number | null;
        is_active: boolean;
        employer: {
            id: string;
            name: string;
            slug: string;
            logo_url: string | null;
            industry: string;
        };
    };
};

export type ListBookmarksParams = {
    sort?: "created_at" | "deadline";
    order?: "asc" | "desc";
    page?: number;
    page_size?: number;
};