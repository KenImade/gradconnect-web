import { fetchAPI } from "../server";

export type HealthStatus = {
    status: string;
    environment: string;
};

export async function getHealth() {
    return fetchAPI<HealthStatus>("/healthcheck", {
        next: { revalidate: 0 } // Don't cache the healthcheck
    })
}