import { cn } from "@/lib/utils";
import { OPPORTUNITY_STATUS_LABELS } from "@/lib/utils/opportunity";
import type { OpportunityStoredStatus } from "@/lib/api/endpoints/opportunities.types";

const STATUS_STYLES: Record<OpportunityStoredStatus, string> = {
    upcoming: "Upcoming",
    open: "Open",
    closed: "Closed",
    withdrawn: "Withdrawn",
};

export function StatusBadge({ status }: { status: OpportunityStoredStatus }) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-medium",
                STATUS_STYLES[status],
            )}
        >
            {OPPORTUNITY_STATUS_LABELS[status]}
        </span>
    );
}