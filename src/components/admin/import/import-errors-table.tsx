"use client";

import { Download } from "lucide-react";
import { downloadCSV } from "@/lib/utils/csv";
import type { ImportRowError } from "@/lib/api/endpoints/imports.types";

type Props = {
    errors: ImportRowError[];
    importType: string;
    jobId: string;
};

export function ImportErrorsTable({ errors, importType, jobId }: Props) {
    function handleDownload() {
        // Output: row_number, message, raw_data — the admin can fix the
        // raw_data column and re-upload after stripping the helper columns.
        const rows: string[][] = [
            ["row_number", "message", "raw_data"],
            ...errors.map((e) => [
                String(e.row_number),
                e.message,
                e.raw_data,
            ]),
        ];
        const filename = `import-errors-${importType}-${jobId.slice(0, 8)}.csv`;
        downloadCSV(filename, rows);
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="font-serif text-h4 text-admin-foreground">
                    Errors{" "}
                    <span className="text-admin-text-dim font-normal">
                        ({errors.length})
                    </span>
                </h2>
                <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 rounded border border-admin-border bg-admin-surface px-2.5 py-1 text-caption font-medium text-admin-text-dim hover:bg-admin-surface-subtle transition-colors"
                >
                    <Download className="size-3" />
                    Download CSV
                </button>
            </div>
            <p className="mt-1 text-caption text-admin-text-faint">
                Fix these rows in your source CSV and re-upload. The download
                contains row number, error message, and the raw row data.
            </p>

            <div className="mt-3 overflow-hidden rounded-lg border border-admin-border bg-admin-surface">
                <table className="w-full text-body-sm">
                    <thead className="border-b border-admin-border bg-admin-surface-subtle">
                        <tr className="text-left text-caption font-medium text-admin-text-dim uppercase tracking-wide">
                            <th className="px-4 py-2 w-16">Row</th>
                            <th className="px-4 py-2">Error</th>
                            <th className="px-4 py-2">Raw data</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {errors.map((err, i) => (
                            <tr key={i} className="align-top">
                                <td className="px-4 py-2.5 tabular-nums text-admin-text-dim">
                                    {err.row_number}
                                </td>
                                <td className="px-4 py-2.5 text-destructive">
                                    {err.message}
                                </td>
                                <td className="px-4 py-2.5 font-mono text-caption text-admin-text-dim break-all">
                                    {err.raw_data}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}