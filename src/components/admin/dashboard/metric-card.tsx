import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    label: string;
    value: number;
    /** Optional secondary metric — shown as a smaller line below the value. */
    sublabel?: string;
    /** Optional icon — small, rendered top-right. */
    icon?: LucideIcon;
    /** Tone hint for the value — destructive when something needs attention. */
    tone?: "default" | "destructive" | "muted";
};

export function MetricCard({ label, value, sublabel, icon: Icon, tone }: Props) {
    return (
        <div className="rounded-lg border border-admin-border bg-admin-surface p-4">
            <div className="flex items-start justify-between gap-2">
                <p className="text-caption uppercase tracking-wide text-admin-text-dim">
                    {label}
                </p>
                {Icon && (
                    <Icon
                        className="size-4 shrink-0 text-admin-text-faint"
                        aria-hidden
                    />
                )}
            </div>
            <p
                className={cn(
                    "mt-2 font-display text-h2 tabular-nums",
                    tone === "destructive" && "text-destructive",
                    tone === "muted" && "text-admin-text-dim",
                    !tone && "text-admin-foreground",
                )}
            >
                {value.toLocaleString()}
            </p>
            {sublabel && (
                <p className="mt-1 text-caption text-admin-text-faint">
                    {sublabel}
                </p>
            )}
        </div>
    );
}