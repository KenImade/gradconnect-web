import { listEmployers } from "@/lib/api/endpoints/employers";
import { EmployerCard } from "@/components/employer/employer-card";
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
          Slice 2 — EmployerCard component
        </p>
        <h1 className="mt-2 font-display text-display-xl text-foreground">
          {pagination.total_records}{" "}
          {pagination.total_records === 1 ? "employer" : "employers"}
        </h1>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {employers.map((employer) => (
            <EmployerCard key={employer.id} employer={employer} />
          ))}
        </div>
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