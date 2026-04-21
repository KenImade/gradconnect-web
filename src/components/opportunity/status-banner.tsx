import { AlertCircle, Clock, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OpportunityStatus } from "@/lib/api/endpoints/opportunities.types";

type StatusBannerProps = {
    status: OpportunityStatus;
    opensAt: string | null;
    deadline: string | null;
    employerName: string;
    className?: string;
};

function formatDate(iso: string | null): string | null {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function StatusBanner({
    status,
    opensAt,
    deadline,
    employerName,
    className,
}: StatusBannerProps) {
    if (status === "open") return null; // No banner needed for open opportunities

    const config = (() => {
        if (status === "upcoming") {
            const date = formatDate(opensAt);
            return {
                icon: Clock,
                tone: "info" as const,
                title: "Applications haven't opened yet",
                body: date
                    ? `${employerName} opens applications on ${date}.`
                    : `Applications will open soon.`,
            };
        }
        if (status === "closed") {
            const date = formatDate(deadline);
            return {
                icon: Archive,
                tone: "muted" as const,
                title: "Applications closed",
                body: date
                    ? `Applications closed on ${date}. This listing is shown for reference.`
                    : `This listing is no longer accepting applications.`,
            };
        }
        return {
            icon: AlertCircle,
            tone: "muted" as const,
            title: "Listing withdrawn",
            body: `${employerName} has withdrawn this listing.`,
        };
    })();

    const toneStyles = {
        info: "border-info/20 bg-info/5 text-info",
        muted: "border-border bg-bg-muted text-text-dim",
    };

    const Icon = config.icon;

    return (
        <div
            className={cn(
                "flex items-start gap-3 rounded-lg border p-4",
                toneStyles[config.tone],
                className,
            )}
            role="status"
        >
            <Icon className="size-5 shrink-0 mt-0.5" />
            <div>
                <p className="font-medium text-foreground">{config.title}</p>
                <p className="mt-0.5 text-body-sm text-text-dim">{config.body}</p>
            </div>
        </div>
    );
}