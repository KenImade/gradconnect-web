import "server-only";
import { fetchAPI } from "../server";
import type { PaginatedEnvelope } from "../envelope";
import type { Review } from "./reviews.types";

type ListReviewsParams = {
    sort?: string;
    order?: "asc" | "desc";
    page?: number;
    page_size?: number;
};

export async function listEmployerReviews(
    employerSlug: string,
    params?: ListReviewsParams,
): Promise<PaginatedEnvelope<Review[]>> {
    const qs = new URLSearchParams();
    if (params?.sort) qs.set("sort", params.sort);
    if (params?.order) qs.set("order", params.order);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));

    const path = qs.toString()
        ? `/employers/${employerSlug}/reviews?${qs}`
        : `/employers/${employerSlug}/reviews`;
    return fetchAPI<PaginatedEnvelope<Review[]>>(path);
}