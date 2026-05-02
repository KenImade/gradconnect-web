"use client";

import { fetchAPIClient } from "../client";
import type { Envelope } from "../envelope";
import type {
    AdminJobName,
    JobTriggerResponse,
} from "./admin-analytics.types";

const ENDPOINT_BY_JOB: Record<AdminJobName, string> = {
    deadline_reminders: "/admin/jobs/deadline-reminders",
    recalculate_ratings: "/admin/jobs/recalculate-ratings",
    cleanup_sessions: "/admin/jobs/cleanup-sessions",
};

/**
 * Triggers a manual run of one of the admin background jobs.
 * The backend enforces idempotency (deadline_reminders, recalculate_ratings)
 * via cron_run; cleanup_sessions has no daily idempotency.
 */
export async function triggerAdminJob(
    job: AdminJobName,
): Promise<JobTriggerResponse> {
    const response = await fetchAPIClient<Envelope<JobTriggerResponse>>(
        ENDPOINT_BY_JOB[job],
        { method: "POST" },
    );
    return response.data;
}