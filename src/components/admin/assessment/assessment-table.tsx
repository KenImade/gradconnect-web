import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { EmployerLogo } from "@/components/employer/employer-logo";
import type { Assessment } from "@/lib/api/endpoints/assessments.types";

export function AdminAssessmentTable({
    assessments,
}: {
    assessments: Assessment[];
}) {
    if (assessments.length === 0) {
        return (
            <div className="border-t border-admin-border py-16 text-center">
                <p className="text-admin-text-dim">No assessments match your filters.</p>
            </div>
        );
    }

    return (
        <div className="border border-admin-border bg-admin-surface overflow-x-auto">
            <table className="w-full text-body-sm">
                <thead className="border-b border-admin-border bg-admin-surface-subtle">
                    <tr>
                        <th className="text-left px-4 py-2 text-caption uppercase tracking-wide text-admin-text-faint font-medium">
                            Employer
                        </th>
                        <th className="text-left px-4 py-2 text-caption uppercase tracking-wide text-admin-text-faint font-medium">
                            Programme
                        </th>
                        <th className="text-left px-4 py-2 text-caption uppercase tracking-wide text-admin-text-faint font-medium">
                            Stages
                        </th>
                        <th className="text-left px-4 py-2 text-caption uppercase tracking-wide text-admin-text-faint font-medium">
                            Timeline
                        </th>
                        <th className="text-right px-4 py-2 text-caption uppercase tracking-wide text-admin-text-faint font-medium">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {assessments.map((a) => (
                        <tr
                            key={a.id}
                            className="border-b border-admin-border last:border-b-0 hover:bg-admin-surface-subtle/50 transition-colors"
                        >
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                    <EmployerLogo
                                        name={a.employer.name}
                                        logoUrl={a.employer.logo_url}
                                        size="sm"
                                    />
                                    <div>
                                        <p className="font-medium text-admin-foreground">
                                            {a.employer.name}
                                        </p>
                                        <p className="text-caption text-admin-text-faint italic">
                                            {a.employer.industry}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-admin-foreground">
                                {a.programme_type}
                            </td>
                            <td className="px-4 py-3 text-admin-text-dim tabular-nums">
                                {a.stages.length}
                            </td>
                            <td className="px-4 py-3 text-admin-text-dim tabular-nums">
                                {a.timeline_weeks ? `${a.timeline_weeks} weeks` : "—"}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="inline-flex items-center gap-3">
                                    <a
                                        href={`/employers/${a.employer.slug}/process`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-admin-text-dim hover:text-admin-foreground transition-colors"
                                    >
                                        View
                                        <ExternalLink className="size-3" />
                                    </a>
                                    <Link
                                        href={`/admin/assessments/${a.id}/edit`}
                                        className="text-primary hover:text-primary-hover font-medium transition-colors"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
}