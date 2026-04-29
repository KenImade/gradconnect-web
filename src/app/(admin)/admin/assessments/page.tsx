import type { Metadata } from "next";

export const metadata: Metadata = { title: "Moderation" };

export default function AssessmentsPage() {
    return (
        <div className="px-8 py-8 max-w-5xl">
            <p className="text-caption uppercase tracking-wider text-admin-text-faint">
                Assessments
            </p>
            <h1 className="mt-1 font-display text-display-md text-admin-foreground">
                Assessments to add
            </h1>
            <p className="mt-3 text-body-md text-admin-text-dim">
                Coming in slice 22b — pending reviews list with approve/reject controls.
            </p>
        </div>
    );
}