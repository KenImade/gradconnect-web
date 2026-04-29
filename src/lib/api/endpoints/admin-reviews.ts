import { fetchAPIClient } from "../client";
import type { Envelope, PaginatedEnvelope } from "../envelope";
import type { ReviewStatus } from "./reviews.types";
import type { AdminReview } from "./admin-reviews.types";

type ListAdminReviewsParams = {
    status?: ReviewStatus | "all";
    sort?: string;
    page?: number;
    page_size?: number;
};

export async function listAdminReviewsClient(
    params?: ListAdminReviewsParams,
): Promise<PaginatedEnvelope<AdminReview[]>> {
    const qs = new URLSearchParams();
    if (params?.status && params.status !== "all") {
        qs.set("status", params.status);
    }
    if (params?.sort) qs.set("sort", params.sort);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));

    const path = qs.toString() ? `/admin/reviews?${qs}` : "/admin/reviews";
    return fetchAPIClient<PaginatedEnvelope<AdminReview[]>>(path);
}

export async function moderateReview(
    id: string,
    status: "approved" | "rejected",
): Promise<AdminReview> {
    const response = await fetchAPIClient<Envelope<AdminReview>>(
        `/admin/reviews/${id}`,
        {
            method: "PATCH",
            body: JSON.stringify({ status }),
        },
    );
    return response.data;
}