import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { getImportJob } from "@/lib/api/endpoints/imports.server";
import { APIError } from "@/lib/api/errors";
import { ImportStatusBadge } from "@/components/admin/import/import-status-badge";
import { ImportErrorsTable } from "@/components/admin/import/import-errors-table";
import { ImportRefreshButton } from "@/components/admin/import/import-refresh-button";
import { IMPORT_TYPE_LABELS } from "@/lib/utils/import";
import { formatDateTime } from "@/lib/utils/date";

export const metadata: Metadata = {
    title: "Import job",
    robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function ImportJobPage({ params }: PageProps) {
    const { id } = await params;

    let job;
    try {
        job = await getImportJob(id);
    } catch (err) {
        if (APIError.isAPIError(err) && err.status === 404) {
            notFound();
        }
        throw err;
    }

    const isInFlight = job.status === "pending" || job.status === "processing";

    return (
        <div className="mx-auto max-w-5xl px-6 py-8">
            <Link
                href="/admin/imports"
                className="inline-flex items-center gap-1 text-body-sm text-admin-text-dim hover:text-admin-foreground transition-colors"
            >
                <ChevronLeft className="size-3.5" />
                All imports
            </Link>

            <header className="mt-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="font-serif text-h2 text-admin-foreground">
                        {IMPORT_TYPE_LABELS[job.import_type]} import
                    </h1>
                    <p className="mt-1 text-body-sm text-admin-text-dim">
                        Started {formatDateTime(job.created_at)}
                        {job.completed_at && (
                            <> · Completed {formatDateTime(job.completed_at)}</>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <ImportStatusBadge status={job.status} />
                    {isInFlight && <ImportRefreshButton />}
                </div>
            </header>

            {/* Summary panel */}
            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-admin-border bg-admin-border sm:grid-cols-4">
                <SummaryStat label="Total rows" value={job.rows_total} />
                <SummaryStat
                    label="Imported"
                    value={job.rows_imported}
                    tone={
                        job.rows_imported != null && job.rows_imported > 0
                            ? "success"
                            : undefined
                    }
                />
                <SummaryStat
                    label="Failed"
                    value={job.rows_failed}
                    tone={
                        job.rows_failed != null && job.rows_failed > 0
                            ? "destructive"
                            : undefined
                    }
                />
                <SummaryStat
                    label="Job ID"
                    value={job.id.slice(0, 8)}
                    mono
                />
            </dl>

            {/* Whole-job error (failed before per-row processing started) */}
            {job.error_message && (
                <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <h2 className="inline-flex items-center gap-1.5 text-body-sm font-medium text-destructive">
                        <AlertCircle className="size-4" />
                        Job failed
                    </h2>
                    <p className="mt-1 text-body-sm text-admin-foreground">
                        {job.error_message}
                    </p>
                    <p className="mt-2 text-caption text-admin-text-faint">
                        The import did not run any rows. Fix the issue and
                        re-upload.
                    </p>
                </div>
            )}

            {/* In-flight status */}
            {isInFlight && (
                <div className="mt-6 rounded-lg border border-admin-border bg-admin-surface-subtle p-4">
                    <p className="text-body-sm text-admin-text-dim">
                        Job is{" "}
                        <span className="font-medium text-admin-foreground">
                            {job.status}
                        </span>
                        . Click refresh to check progress.
                    </p>
                </div>
            )}

            {/* Per-row errors */}
            {job.row_errors && job.row_errors.length > 0 && (
                <div className="mt-8">
                    <ImportErrorsTable
                        errors={job.row_errors}
                        importType={job.import_type}
                        jobId={job.id}
                    />
                </div>
            )}

            {/* Clean-success state */}
            {job.status === "completed" &&
                (!job.row_errors || job.row_errors.length === 0) && (
                    <div className="mt-6 rounded-lg border border-admin-border bg-admin-surface p-4">
                        <p className="text-body-sm text-admin-foreground">
                            All {job.rows_imported} rows imported successfully.
                        </p>
                    </div>
                )}
        </div>
    );
}

function SummaryStat({
    label,
    value,
    tone,
    mono,
}: {
    label: string;
    value: number | string | null;
    tone?: "success" | "destructive";
    mono?: boolean;
}) {
    return (
        <div className="bg-admin-surface px-4 py-3">
            <dt className="text-caption font-medium text-admin-text-dim uppercase tracking-wide">
                {label}
            </dt>
            <dd
                className={
                    "mt-1 text-h4 tabular-nums " +
                    (mono ? "font-mono text-h5 " : "") +
                    (tone === "success"
                        ? "text-green-700"
                        : tone === "destructive"
                            ? "text-destructive"
                            : "text-admin-foreground")
                }
            >
                {value ?? "—"}
            </dd>
        </div>
    );
}