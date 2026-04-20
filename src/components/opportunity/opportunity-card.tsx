import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/lib/api/endpoints/opportunities.types";
import { EmployerLogo } from "@/components/employer/employer-logo";
import { StatusBadge } from "./status-badge";
import { TypeBadge } from "./type-badge";
import { DeadlineCountdown } from "./deadline-countdown";

type OpportunityCardProps = {
    opportunity: Opportunity;
    className?: string;
};

export function OpportunityCard({ opportunity, className }: OpportunityCardProps) {
    const { employer } = opportunity;

    return (
        <Link
            href={`/opportunities/${opportunity.slug}`}
            className={cn(
                "group block rounded-lg border border-border bg-background p-5 transition-all",
                "hover:border-border-strong hover:shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className,
            )}
        >
            {/* Top row: employer stub + status badge */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <EmployerLogo
                        name={employer.name}
                        logoUrl={employer.logo_url}
                        size="sm"
                    />
                    <div className="min-w-0">
                        <p className="text-body-sm font-medium text-foreground line-clamp-1">
                            {employer.name}
                        </p>
                        <p className="text-caption text-text-faint line-clamp-1">
                            {employer.industry}
                        </p>
                    </div>
                </div>
                <StatusBadge status={opportunity.status} />
            </div>

            {/* Title */}
            <h3 className="mt-4 font-display text-heading-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {opportunity.title}
            </h3>

            {/* Meta row */}
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <TypeBadge type={opportunity.type} />
                <span className="inline-flex items-center gap-1 text-caption text-text-dim">
                    <MapPin className="size-3" />
                    {opportunity.location}
                </span>
                {opportunity.status === "open" && (
                    <DeadlineCountdown daysRemaining={opportunity.days_remaining} />
                )}
            </div>

            {/* Discipline tags */}
            {opportunity.discipline_tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                    {opportunity.discipline_tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center rounded-md bg-surface-subtle px-2 py-0.5 text-caption text-text-dim"
                        >
                            {tag}
                        </span>
                    ))}
                    {opportunity.discipline_tags.length > 3 && (
                        <span className="inline-flex items-center text-caption text-text-faint">
                            +{opportunity.discipline_tags.length - 3} more
                        </span>
                    )}
                </div>
            )}
        </Link>
    );
}