"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { startImport } from "@/lib/api/endpoints/imports";
import { APIError } from "@/lib/api/errors";
import { IMPORT_TYPE_COLUMNS, IMPORT_TYPE_LABELS } from "@/lib/utils/import";
import { cn } from "@/lib/utils";
import type { ImportType } from "@/lib/api/endpoints/imports.types";

const TYPES: ImportType[] = ["employers", "opportunities", "assessments"];
const MAX_SIZE_MB = 5;

export function ImportUploadForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [type, setType] = useState<ImportType>("employers");
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setError(null);
        const f = e.target.files?.[0] ?? null;
        if (f && f.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`File is too large. Max ${MAX_SIZE_MB}MB.`);
            setFile(null);
            return;
        }
        setFile(f);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!file) return;

        setError(null);
        setSubmitting(true);
        try {
            const job = await startImport(file, type);
            toast.success("Import started");
            // Navigate to the detail page so the admin can watch it
            router.push(`/admin/imports/${job.id}`);
            router.refresh();
        } catch (err) {
            if (APIError.isAPIError(err)) {
                setError(err.message || "Upload failed");
            } else {
                setError("Upload failed. Check your connection.");
            }
            setSubmitting(false);
        }
    }

    const expectedColumns = IMPORT_TYPE_COLUMNS[type];

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-admin-border bg-admin-surface p-5"
        >
            <h2 className="font-serif text-h4 text-admin-foreground">
                New import
            </h2>
            <p className="mt-1 text-body-sm text-admin-text-dim">
                Upload a CSV to bulk-create or update records. Existing rows
                (matched by slug) are updated; new rows are inserted.
            </p>

            <div className="mt-5 space-y-4">
                {/* Type selector */}
                <div>
                    <label className="block text-body-sm font-medium text-admin-foreground">
                        Record type
                    </label>
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                        {TYPES.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                disabled={submitting}
                                className={cn(
                                    "rounded border px-3 py-2 text-body-sm font-medium transition-colors",
                                    type === t
                                        ? "border-primary bg-primary/5 text-admin-foreground"
                                        : "border-admin-border bg-admin-surface text-admin-text-dim hover:bg-admin-surface-subtle",
                                    submitting && "opacity-50 cursor-not-allowed",
                                )}
                            >
                                {IMPORT_TYPE_LABELS[t]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Expected columns hint */}
                <div className="rounded border border-admin-border bg-admin-surface-subtle px-3 py-2.5">
                    <p className="text-caption font-medium text-admin-text-dim uppercase tracking-wide">
                        Expected columns
                    </p>
                    <p className="mt-1 font-mono text-body-sm text-admin-foreground wrap-break-word">
                        {expectedColumns.join(", ")}
                    </p>
                </div>

                {/* File picker */}
                <div>
                    <label className="block text-body-sm font-medium text-admin-foreground">
                        CSV file
                    </label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleFileChange}
                        disabled={submitting}
                        className="sr-only"
                        id="csv-file-input"
                    />
                    <div className="mt-1.5 flex items-center gap-3">
                        <label
                            htmlFor="csv-file-input"
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded border border-admin-border bg-admin-surface px-3 py-1.5 text-body-sm font-medium text-admin-foreground hover:bg-admin-surface-subtle transition-colors cursor-pointer",
                                submitting && "opacity-50 cursor-not-allowed",
                            )}
                        >
                            <Upload className="size-3.5" />
                            Choose file
                        </label>
                        {file && (
                            <span className="inline-flex items-center gap-1.5 text-body-sm text-admin-text-dim">
                                <FileText className="size-3.5" />
                                {file.name}{" "}
                                <span className="text-admin-text-faint">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                            </span>
                        )}
                    </div>
                    <p className="mt-1.5 text-caption text-admin-text-faint">
                        Max {MAX_SIZE_MB}MB. UTF-8 encoded. First row must be
                        the header.
                    </p>
                </div>

                {error && (
                    <p className="inline-flex items-center gap-1 text-caption text-destructive" role="alert">
                        <AlertCircle className="size-3" />
                        {error}
                    </p>
                )}

                <div className="flex items-center gap-3 pt-1">
                    <button
                        type="submit"
                        disabled={!file || submitting}
                        className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-body-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="size-3.5 animate-spin" />
                                Starting import
                            </>
                        ) : (
                            "Start import"
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}