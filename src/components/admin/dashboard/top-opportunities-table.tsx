import Link from "next/link";
import type { TopOpportunity } from "@/lib/api/endpoints/admin-analytics.types";

type Props = {
    opportunities: TopOpportunity[];
};

export function TopOpportunitiesTable({ opportunities }: Props) {
    return (
        <div className="rounded-lg border border-admin-border bg-admin-surface">
            <header className="border-b border-admin-border px-5 py-3">
                <h3 className="font-display text-heading-sm text-admin-foreground">
                    Top opportunities
                </h3>
                <p className="mt-0.5 text-caption text-admin-text-faint">
                    Ranked by bookmarks
                </p>
            </header>

            {opportunities.length === 0 ? (
                <p className="px-5 py-6 text-body-sm text-admin-text-dim">
                    No opportunity data yet.
                </p>
            ) : (
                <table className="w-full text-body-sm">
                    <thead className="border-b border-admin-border">
                        <tr className="text-left text-caption font-medium text-admin-text-dim uppercase tracking-wide">
                            <th className="px-4 py-2 w-8">#</th>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Employer</th>
                            <th className="px-4 py-2 text-right">Bookmarks</th>
                            <th className="px-4 py-2 text-right">Deadline</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {opportunities.map((o, i) => (
                            <tr
                                key={o.id}
                                className="hover:bg-admin-surface-subtle transition-colors"
                            >
                                <td className="px-4 py-2 tabular-nums text-admin-text-faint">
                                    {i + 1}
                                </td>
                                <td className="px-4 py-2 max-w-xs">
                                    <Link
                                        href={`/opportunities/${o.slug}`}
                                        className="text-admin-foreground hover:text-primary transition-colors line-clamp-1"
                                    >
                                        {o.title}
                                    </Link>
                                </td>
                                <td className="px-4 py-2 text-admin-text-dim">
                                    {o.employer_name}
                                </td>
                                <td className="px-4 py-2 text-right tabular-nums text-admin-foreground">
                                    {o.bookmark_count}
                                </td>
                                <td className="px-4 py-2 text-right tabular-nums text-admin-text-dim">
                                    {o.deadline ? formatDate(o.deadline) : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}