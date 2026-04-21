import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
    OpportunityStatus,
} from "@/lib/api/endpoints/opportunities.types";

type ApplyCTAProps = {
    applicationUrl: string;
    status: OpportunityStatus;
    opensAt: string | null;
    deadline: string | null;
    className?: string;
};

export function ApplyCTA({
    applicationUrl,
    status,
    opensAt,
    deadline,
    className,
}: ApplyCTAProps) {
    if (status === "open") {
        return (
            <a
                href={applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={
                    cn(
                        "inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-body-md font-medium text-primary-foreground hover:bg-primary-hover transition-colors",
                        className,
                    )
                }
            >
                Apply on employer &apos;s site
                < ExternalLink className="size-4" />
            </a >
        );
    }

    if (status === "upcoming") {
        const opensDate = opensAt
            ? new Date(opensAt).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })
            : "soon";
        return (
            <div
                className={cn(
                    "inline-flex items-center gap-2 rounded-md border border-border-strong bg-surface-subtle px-6 py-3 text-body-md text-text-dim",
                    className,
                )}
            >
                Opens {opensDate}
            </div>
        );
    }

    if (status === "closed") {
        const closedDate = deadline
            ? new Date(deadline).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })
            : "";
        return (
            <div
                className={cn(
                    "inline-flex items-center gap-2 rounded-md border border-border bg-bg-muted px-6 py-3 text-body-md text-text-dim",
                    className,
                )}
            >
                Applications closed{closedDate ? ` on ${closedDate}` : ""}
            </div>
        );
    }

    // withdrawn
    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 rounded-md border border-border bg-bg-muted px-6 py-3 text-body-md text-text-faint line-through",
                className,
            )}
        >
            Listing withdrawn
        </div>
    );
}