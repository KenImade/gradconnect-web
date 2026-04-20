import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
};

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-subtle px-6 py-16 text-center",
                className,
            )}
        >
            {Icon && (
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-background text-text-dim">
                    <Icon className="size-6" />
                </div>
            )}
            <h2 className="font-display text-heading-lg text-foreground">{title}</h2>
            {description && (
                <p className="mt-2 max-w-md text-body-sm text-text-dim">{description}</p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}