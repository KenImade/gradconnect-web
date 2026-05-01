"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw, ChevronRight, AlertCircle } from "lucide-react";
import { ImportStatusBadge } from "./import-status-badge";
import { IMPORT_TYPE_LABELS } from "@/lib/utils/import";
import { formatDateTime } from "@/lib/utils/date";
import { cn } from "@/lib/utils";
import type { ImportJob } from "@/lib/api/endpoints/imports.types";

type Props = {
    jobs: ImportJob[];
};

export function ImportJobsTable({ jobs }: Props) {
    const router = useRouter();
    const [refreshing, startRefreshing] = useTransition();
    const [refreshError, setRefreshError] = useState<string | null>(null);

    function handleRefresh() {
        setRefreshError(null);
        startRefreshing(() => {
            try {
                router.refresh();
            } catch {
                setRefreshError("Refresh failed. Try again.");
            }
        });
    }

    const hasInFlight = jobs.some(
        (j) => j.status === "pending" || j.status === "processing",
    );

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="font-serif text-h4 text-admin-foreground">
                    Recent imports
                </h2>
                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center gap-1.5 rounded border border-admin-border bg-admin-surface px-2.5 py-1 text-caption font-medium text-admin-text-dim hover:bg-admin-surface-subtle transition-colors disabled:opacity-50"
                >
                    <RefreshCw
                        className={cn("size-3", refreshing && "animate-spin")}
                        aria-hidden
                    />
                    Refresh
                </button>
            </div>

            {hasInFlight && (
                <p className="mt-2 inline-flex items-center gap-1 text-caption text-admin-text-faint">
                    Some jobs are still running. Refresh to see updated status.
                </p>
            )}

            {refreshError && (
                <p className="mt-2 inline-flex items-center gap-1 text-caption text-destructive" role="alert">
                    <AlertCircle className="size-3" />
                    {refreshError}
                </p>
            )}

            <div className="mt-3 overflow-hidden rounded-lg border border-admin-border bg-admin-surface">
                {jobs.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                        <p className="text-body-sm text-admin-text-dim">
                            No imports yet.
                        </p>
                        <p className="mt-1 text-caption text-admin-text-faint">
                            Upload a CSV above to bulk-create records.
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-body-sm">
                        <thead className="border-b border-admin-border bg-admin-surface-subtle">
                            <tr className="text-left text-caption font-medium text-admin-text-dim uppercase tracking-wide">
                                <th className="px-4 py-2">Started</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2 text-right">Imported</th>
                                <th className="px-4 py-2 text-right">Failed</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-border">
                            {jobs.map((job) => (
                                <tr
                                    key={job.id}
                                    className="hover:bg-admin-surface-subtle transition-colors"
                                >
                                    <td className="px-4 py-2.5 whitespace-nowrap text-admin-foreground">
                                        {formatDateTime(job.created_at)}
                                    </td>
                                    <td className="px-4 py-2.5 text-admin-foreground">
                                        {IMPORT_TYPE_LABELS[job.import_type]}
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <ImportStatusBadge status={job.status} />
                                    </td>
                                    <td className="px-4 py-2.5 text-right tabular-nums text-admin-foreground">
                                        {job.rows_imported ?? "—"}
                                        {job.rows_total != null && (
                                            <span className="text-admin-text-faint">
                                                {" "}
                                                / {job.rows_total}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2.5 text-right tabular-nums">
                                        {job.rows_failed != null && job.rows_failed > 0 ? (
                                            <span className="text-destructive">
                                                {job.rows_failed}
                                            </span>
                                        ) : (
                                            <span className="text-admin-text-faint">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <Link
                                            href={`/admin/imports/${job.id}`}
                                            className="inline-flex items-center gap-1 text-primary hover:underline"
                                        >
                                            View
                                            <ChevronRight className="size-3.5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}