import { cache } from "react";
import { fetchAPI } from "../server";
import type { PaginatedEnvelope } from "../envelope";
import type { Assessment } from "./assessments.types";

/**
 * GET /employers/:slug/assessments — list assessment profiles for an employer.
 * Wrapped in React.cache so layout and page dedupe to one backend fetch.
 */
export const listEmployerAssessments = cache(
    async (slug: string): Promise<PaginatedEnvelope<Assessment[]>> => {
        return fetchAPI<PaginatedEnvelope<Assessment[]>>(
            `/employers/${slug}/assessments`,
        );
    },
);