import type { Metadata } from "next";
import { getAdminAnalytics } from "@/lib/api/endpoints/admin-analytics.server";
import { CountsGrid } from "@/components/admin/dashboard/counts-grid";
import { ChartsPanel } from "@/components/admin/dashboard/charts-panel";
import { TopEmployersTable } from "@/components/admin/dashboard/top-employers-table";
import { TopOpportunitiesTable } from "@/components/admin/dashboard/top-opportunities-table";
import { OperationsPanel } from "@/components/admin/dashboard/operations-panel";

export const metadata: Metadata = {
    title: "Dashboard",
    robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const analytics = await getAdminAnalytics();

    return (
        <div className="mx-auto max-w-7xl px-6 py-8 space-y-10">
            <header>
                <p className="text-caption uppercase tracking-wider text-admin-text-faint">
                    Admin
                </p>
                <h1 className="mt-1 font-display text-display-md text-admin-foreground">
                    Dashboard
                </h1>
                <p className="mt-2 text-body-sm text-admin-text-dim">
                    Operational view of GradConnect — counts, trends, recent
                    activity, and manual job triggers.
                </p>
            </header>

            <section>
                <h2 className="sr-only">Top metrics</h2>
                <CountsGrid counts={analytics.counts} />
            </section>

            <section>
                <h2 className="sr-only">30-day trends</h2>
                <ChartsPanel timeSeries={analytics.time_series} />
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <h2 className="sr-only">Top content</h2>
                <TopEmployersTable employers={analytics.top_employers} />
                <TopOpportunitiesTable
                    opportunities={analytics.top_opportunities}
                />
            </section>

            <section>
                <h2 className="sr-only">Operations</h2>
                <OperationsPanel recentJobs={analytics.recent_jobs} />
            </section>
        </div>
    );
}