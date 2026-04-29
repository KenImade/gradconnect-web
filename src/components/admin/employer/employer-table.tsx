import Link from "next/link";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { EmployerLogo } from "@/components/employer/employer-logo";
import type { EmployerSummary } from "@/lib/api/endpoints/employers.types";

export function AdminEmployerTable({
    employers,
}: {
    employers: EmployerSummary[];
}) {
    if (employers.length === 0) {
        return (
            <div className="border-t border-admin-border py-16 text-center">
                <p className="text-admin-text-dim">No employers match your filters.</p>
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
                            Industry
                        </th>
                        <th className="text-left px-4 py-2 text-caption uppercase tracking-wide text-admin-text-faint font-medium">
                            Reviews
                        </th>
                        <th className="text-left px-4 py-2 text-caption uppercase tracking-wide text-admin-text-faint font-medium">
                            Verified
                        </th>
                        <th className="text-right px-4 py-2 text-caption uppercase tracking-wide text-admin-text-faint font-medium">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {employers.map((employer) => (
                        <tr
                            key={employer.id}
                            className="border-b border-admin-border last:border-b-0 hover:bg-admin-surface-subtle/50 transition-colors"
                        >
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                    <EmployerLogo
                                        name={employer.name}
                                        logoUrl={employer.logo_url}
                                        size="sm"
                                    />
                                    <div>
                                        <p className="font-medium text-admin-foreground">
                                            {employer.name}
                                        </p>
                                        <p className="text-caption font-mono text-admin-text-faint">
                                            {employer.slug}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-admin-text-dim">
                                {employer.industry}
                            </td>
                            <td className="px-4 py-3 text-admin-text-dim tabular-nums">
                                {employer.review_count ?? 0}
                            </td>
                            <td className="px-4 py-3">
                                {employer.is_verified ? (
                                    <span className="inline-flex items-center gap-1 text-success">
                                        <CheckCircle2 className="size-3.5" />
                                        Yes
                                    </span>
                                ) : (
                                    <span className="text-admin-text-faint">—</span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="inline-flex items-center gap-3">
                                    <a
                                        href={`/employers/${employer.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-admin-text-dim hover:text-admin-foreground transition-colors"
                                    >
                                        View
                                        <ExternalLink className="size-3" />
                                    </a>
                                    <Link
                                        href={`/admin/employers/${employer.id}/edit`}
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