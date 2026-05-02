import {
    Users,
    UserCheck,
    UserPlus,
    Building2,
    Briefcase,
    BriefcaseBusiness,
    MessageSquare,
    AlertCircle,
    Bookmark,
    ListChecks,
    Activity,
} from "lucide-react";
import { MetricCard } from "./metric-card";
import type { AnalyticsCounts } from "@/lib/api/endpoints/admin-analytics.types";

type Props = {
    counts: AnalyticsCounts;
};

export function CountsGrid({ counts }: Props) {
    // Verified rate as a percent — useful context next to the verified count.
    const verifiedRate =
        counts.users_total > 0
            ? Math.round((counts.users_verified / counts.users_total) * 100)
            : 0;

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Row 1 — users */}
            <MetricCard
                label="Users total"
                value={counts.users_total}
                icon={Users}
            />
            <MetricCard
                label="Verified"
                value={counts.users_verified}
                sublabel={`${verifiedRate}% of total`}
                icon={UserCheck}
            />
            <MetricCard
                label="New (7d)"
                value={counts.users_registered_last_7_days}
                icon={UserPlus}
            />
            <MetricCard
                label="Active sessions"
                value={counts.sessions_active}
                icon={Activity}
                tone="muted"
            />

            {/* Row 2 — content */}
            <MetricCard
                label="Employers"
                value={counts.employers_total}
                sublabel={`${counts.employers_verified} verified`}
                icon={Building2}
            />
            <MetricCard
                label="Opportunities total"
                value={counts.opportunities_total}
                icon={Briefcase}
            />
            <MetricCard
                label="Open right now"
                value={counts.opportunities_open}
                icon={BriefcaseBusiness}
            />
            <MetricCard
                label="Reviews"
                value={counts.reviews_total}
                icon={MessageSquare}
            />

            {/* Row 3 — engagement + queue */}
            <MetricCard
                label="In moderation"
                value={counts.reviews_pending_moderation}
                icon={AlertCircle}
                tone={
                    counts.reviews_pending_moderation > 0
                        ? "destructive"
                        : undefined
                }
            />
            <MetricCard
                label="Bookmarks"
                value={counts.bookmarks_total}
                icon={Bookmark}
            />
            <MetricCard
                label="Applications tracked"
                value={counts.applications_total}
                icon={ListChecks}
            />
            <MetricCard
                label="Verified rate"
                value={verifiedRate}
                sublabel={
                    counts.users_total > 0
                        ? `${counts.users_verified} of ${counts.users_total}`
                        : "no users yet"
                }
                tone="muted"
            />
        </div>
    );
}