import { cn } from "@/lib/utils";
import type { OpportunityStatus } from "@/lib/api/endpoints/opportunities.types";
import { OPPORTUNITY_STATUS_LABELS } from "@/lib/utils/opportunity";

const STATUS_STYLES: Record<OpportunityStatus, string> = {
    upcoming: "bg-info/10 text-info",
    open: "bg-success/10 text-success",
    closed: "bg-bg-muted text-text-dim",
    withdrawn: "bg-bg-muted text-text-faint line-through",
};

export function StatusBadge({ status }: { status: OpportunityStatus }) {
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