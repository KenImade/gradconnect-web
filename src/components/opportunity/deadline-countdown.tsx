import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    formatDeadlineLabel,
    deadlineSeverity,
} from "@/lib/utils/opportunity";

type DeadlineCountdownProps = {
    daysRemaining: number | null;
    className?: string;
};

const SEVERITY_STYLES = {
    neutral: "text-text-dim",
    warning: "text-warning",
    danger: "text-destructive",
    muted: "text-text-faint",
} as const;

export function DeadlineCountdown({ daysRemaining, className }: DeadlineCountdownProps) {
    const label = formatDeadlineLabel(daysRemaining);
    if (!label) return null;

    const severity = deadlineSeverity(daysRemaining);

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 text-caption font-medium",
                SEVERITY_STYLES[severity],
                className,
            )}
        >
            <Clock className="size-3" />
            {label}
        </span>
    );
}