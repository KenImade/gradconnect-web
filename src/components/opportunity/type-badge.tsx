import type { OpportunityType } from "@/lib/api/endpoints/opportunities.types";
import { OPPORTUNITY_TYPE_LABELS } from "@/lib/utils/opportunity";

export function TypeBadge({ type }: { type: OpportunityType }) {
    return (
        <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-caption font-medium text-text-dim">
            {OPPORTUNITY_TYPE_LABELS[type]}
        </span>
    );
}