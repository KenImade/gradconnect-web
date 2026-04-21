import "server-only";
import { z } from "zod";

/**
 * Server-only environment variables.
 * NEVER import this from a Client Component — `server-only` will
 * throw at build time if you accidentally do.
 *
 * Prefer reading public vars from `./config` even from server code,
 * so the two never drift out of sync.
 */
const envSchema = z.object({
    API_BASE_URL: z.string().url(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse({
    API_BASE_URL: process.env.API_BASE_URL,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
});

if (!parsed.success) {
    console.error("❌ Invalid server environment variables:");
    console.error(z.treeifyError(parsed.error));
    throw new Error("Invalid server environment variables. See above.");
}

export const serverEnv = parsed.data;