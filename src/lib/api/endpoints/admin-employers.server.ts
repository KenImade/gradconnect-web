import "server-only";
import { fetchAPI } from "../server";
import type { Envelope } from "../envelope";
import type { Employer } from "./employers.types";

/**
 * Admin-only fetch by UUID. Use this in admin edit pages where the
 * URL is ID-based, not slug-based.
 */
export async function getAdminEmployerById(
    id: string,
): Promise<Employer> {
    const response = await fetchAPI<Envelope<Employer>>(
        `/admin/employers/${id}`,
    );
    return response.data;
}