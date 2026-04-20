import { getHealth } from "@/lib/api/endpoints/health";
import { APIError } from "@/lib/api/errors";

export default async function HealthPage() {
    try {
        const data = await getHealth();
        return (
            <main className="container mx-auto py-16 px-4">
                <h1 className="font-display text-heading-xl text-foreground">
                    Backend connection ✓
                </h1>
                <pre className="mt-6 rounded-md bg-surface-subtle p-4 font-mono text-body-sm">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </main>
        );
    } catch (err) {
        const message = APIError.isAPIError(err)
            ? `${err.status} ${err.code}: ${err.message}`
            : String(err);
        return (
            <main className="container mx-auto py-16 px-4">
                <h1 className="font-display text-heading-xl text-destructive">
                    Backend unreachable
                </h1>
                <pre className="mt-6 rounded-md bg-destructive/10 p-4 font-mono text-body-sm text-destructive">
                    {message}
                </pre>
                <p className="mt-4 text-body-sm text-text-dim">
                    Make sure your Go API is running on <code>localhost:4000</code>.
                </p>
            </main>
        );
    }
}