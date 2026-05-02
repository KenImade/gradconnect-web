import "server-only";
import { fetchAPI } from "../server";
import type { Envelope } from "../envelope";
import type { AnalyticsResponse } from "./admin-analytics.types";

export async function getAdminAnalytics(): Promise<AnalyticsResponse> {
    const response = await fetchAPI<Envelope<AnalyticsResponse>>("/admin/analytics");
    return response.data;
}