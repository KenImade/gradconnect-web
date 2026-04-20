import { cache } from "react";
import { fetchAPI } from "../server";
import type { PaginatedEnvelope } from "../envelope";
import type { AssessmentProfile } from "./assessments.types";

/**
 * GET /employers/:slug/assessments — list assessment profiles for an employer.
 * Wrapped in React.cache so layout and page dedupe to one backend fetch.
 */
export const listEmployerAssessments = cache(
    async (slug: string): Promise<PaginatedEnvelope<AssessmentProfile[]>> => {
        return fetchAPI<PaginatedEnvelope<AssessmentProfile[]>>(
            `/employers/${slug}/assessments`,
        );
    },
);