import type { Metadata } from "next";
import { listImports } from "@/lib/api/endpoints/imports.server";
import { ImportUploadForm } from "@/components/admin/import/import-upload-form";
import { ImportJobsTable } from "@/components/admin/import/import-jobs-table";

export const metadata: Metadata = {
    title: "Imports",
    robots: { index: false, follow: false },
};

// Don't cache — admins want to see fresh job state when they navigate here.
export const dynamic = "force-dynamic";

export default async function AdminImportsPage() {
    const jobs = await listImports();

    return (
        <div className="mx-auto max-w-5xl px-6 py-8">
            <header>
                <h1 className="font-serif text-h2 text-admin-foreground">
                    Imports
                </h1>
                <p className="mt-1 text-body-sm text-admin-text-dim">
                    Bulk-create employers, opportunities, and assessments by
                    uploading a CSV. Existing records are updated by slug.
                </p>
            </header>

            <div className="mt-8 space-y-8">
                <ImportUploadForm />
                <ImportJobsTable jobs={jobs} />
            </div>
        </div>
    );
}