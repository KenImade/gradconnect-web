import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImportStatus } from "@/lib/api/endpoints/imports.types";

const STATUS_CONFIG: Record<
    ImportStatus,
    { label: string; icon: typeof Clock; classes: string; spin?: boolean }
> = {
    pending: {
        label: "Pending",
        icon: Clock,
        classes: "bg-admin-surface-subtle text-admin-text-dim border-admin-border",
    },
    processing: {
        label: "Processing",
        icon: Loader2,
        classes: "bg-blue-50 text-blue-700 border-blue-200",
        spin: true,
    },
    completed: {
        label: "Completed",
        icon: CheckCircle2,
        classes: "bg-green-50 text-green-700 border-green-200",
    },
    failed: {
        label: "Failed",
        icon: XCircle,
        classes: "bg-red-50 text-red-700 border-red-200",
    },
};

export function ImportStatusBadge({ status }: { status: ImportStatus }) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-caption font-medium",
                config.classes,
            )}
        >
            <Icon className={cn("size-3", config.spin && "animate-spin")} aria-hidden />
            {config.label}
        </span>
    );
}