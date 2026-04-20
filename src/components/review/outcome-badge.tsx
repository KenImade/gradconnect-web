import { cn } from "@/lib/utils";
import type { ReviewOutcome } from "@/lib/api/endpoints/reviews.types";

const OUTCOME_STYLES: Record<ReviewOutcome, { label: string; className: string }> = {
    offer: { label: "Offer", className: "bg-success/10 text-success" },
    waitlisted: { label: "Waitlisted", className: "bg-warning/10 text-warning" },
    rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
    withdrew: { label: "Withdrew", className: "bg-bg-muted text-text-dim" },
};

export function OutcomeBadge({ outcome }: { outcome: ReviewOutcome }) {
    const style = OUTCOME_STYLES[outcome];
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-caption font-medium",
                style.className,
            )}
        >
            {style.label}
        </span>
    );
}