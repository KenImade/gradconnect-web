import { listEmployers } from "@/lib/api/endpoints/employers";
import { APIError } from "@/lib/api/errors";

export default async function Home() {
  try {
    const { data: employers, pagination } = await listEmployers({
      page: 1,
      page_size: 20,
    });

    return (
      <main className="container mx-auto py-16 px-4">
        <p className="text-caption uppercase tracking-wider text-text-dim">
          Slice 1 — Live data from Go API
        </p>
        <h1 className="mt-2 font-display text-display-xl text-foreground">
          {pagination.total_records} employers
        </h1>
        <p className="mt-2 text-body-sm text-text-dim">
          Page {pagination.current_page} of {pagination.last_page} ·{" "}
          {pagination.page_size} per page
        </p>

        <ul className="mt-12 space-y-6">
          {employers.map((employer) => (
            <li
              key={employer.id}
              className="rounded-lg border border-border bg-background p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-heading-lg text-foreground">
                    {employer.name}
                    {employer.is_verified && (
                      <span className="ml-2 text-caption text-success">
                        ✓ Verified
                      </span>
                    )}
                  </h2>
                  <p className="mt-1 text-body-sm text-text-dim">
                    {employer.industry}
                    {employer.hq_location && ` · ${employer.hq_location}`}
                  </p>
                </div>
                <span className="rounded-full bg-surface-subtle px-3 py-1 text-caption text-text-dim">
                  {employer.opportunity_count} opportunities
                </span>
              </div>
              {employer.overview && (
                <p className="mt-3 text-body-sm text-text-dim line-clamp-2">
                  {employer.overview}
                </p>
              )}
              <p className="mt-3 text-caption text-text-faint font-mono">
                /{employer.slug}
              </p>
            </li>
          ))}
        </ul>
      </main>
    );
  } catch (err) {
    const message = APIError.isAPIError(err)
      ? `${err.status} ${err.code}: ${err.message}`
      : String(err);
    return (
      <main className="container mx-auto py-16 px-4">
        <h1 className="font-display text-heading-xl text-destructive">
          Failed to load employers
        </h1>
        <pre className="mt-4 rounded-md bg-destructive/10 p-4 font-mono text-body-sm text-destructive whitespace-pre-wrap">
          {message}
        </pre>
      </main>
    );
  }
}