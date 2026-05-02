import Link from "next/link";
import type { TopEmployer } from "@/lib/api/endpoints/admin-analytics.types";

type Props = {
    employers: TopEmployer[];
};

export function TopEmployersTable({ employers }: Props) {
    return (
        <div className="rounded-lg border border-admin-border bg-admin-surface">
            <header className="border-b border-admin-border px-5 py-3">
                <h3 className="font-display text-heading-sm text-admin-foreground">
                    Top employers
                </h3>
                <p className="mt-0.5 text-caption text-admin-text-faint">
                    Ranked by bookmarks across opportunities
                </p>
            </header>

            {employers.length === 0 ? (
                <p className="px-5 py-6 text-body-sm text-admin-text-dim">
                    No employer data yet.
                </p>
            ) : (
                <table className="w-full text-body-sm">
                    <thead className="border-b border-admin-border">
                        <tr className="text-left text-caption font-medium text-admin-text-dim uppercase tracking-wide">
                            <th className="px-4 py-2 w-8">#</th>
                            <th className="px-4 py-2">Employer</th>
                            <th className="px-4 py-2 text-right">Bookmarks</th>
                            <th className="px-4 py-2 text-right">Reviews</th>
                            <th className="px-4 py-2 text-right">Opps</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {employers.map((e, i) => (
                            <tr
                                key={e.id}
                                className="hover:bg-admin-surface-subtle transition-colors"
                            >
                                <td className="px-4 py-2 tabular-nums text-admin-text-faint">
                                    {i + 1}
                                </td>
                                <td className="px-4 py-2">
                                    <Link
                                        href={`/admin/employers/${e.id}/edit`}
                                        className="text-admin-foreground hover:text-primary transition-colors"
                                    >
                                        {e.name || (
                                            <span className="text-admin-text-faint italic">
                                                (unnamed)
                                            </span>
                                        )}
                                    </Link>
                                </td>
                                <td className="px-4 py-2 text-right tabular-nums text-admin-foreground">
                                    {e.bookmark_count}
                                </td>
                                <td className="px-4 py-2 text-right tabular-nums text-admin-text-dim">
                                    {e.review_count}
                                </td>
                                <td className="px-4 py-2 text-right tabular-nums text-admin-text-dim">
                                    {e.opportunity_count}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}