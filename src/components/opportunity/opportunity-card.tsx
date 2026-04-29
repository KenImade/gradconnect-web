import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/lib/api/endpoints/opportunities.types";
import { EmployerLogo } from "@/components/employer/employer-logo";
import { StatusBadge } from "./status-badge";
import { TypeBadge } from "./type-badge";
import { DeadlineCountdown } from "./deadline-countdown";
import { BookmarkButton } from "./bookmark-button";
import { TrackButton } from "./track-button";

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
                "group block border-b border-border py-6 transition-colors",
                "hover:bg-surface-subtle/50",
                "focus-visible:outline-none focus-visible:bg-surface-subtle/70",
                className,
            )}
        >
            <div className="flex items-start gap-5">
                <EmployerLogo
                    name={employer.name}
                    logoUrl={employer.logo_url}
                    size="md"
                />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                        <p className="font-display text-heading-sm text-text-dim">
                            {employer.name}
                            <span className="ml-2 text-caption text-text-faint italic font-sans">
                                — {employer.industry}
                            </span>
                        </p>

                        <div className="flex items-center gap-1">
                            <StatusBadge status={opportunity.status} />
                            <BookmarkButton
                                opportunityId={opportunity.id}
                                opportunityTitle={opportunity.title}
                            />
                            <TrackButton
                                opportunityId={opportunity.id}
                                opportunityTitle={opportunity.title}
                            />
                        </div>
                    </div>

                    <h3 className="mt-1 font-display text-heading-md text-foreground group-hover:text-primary transition-colors line-clamp-2 max-w-[52ch]">
                        {opportunity.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-caption">
                        <TypeBadge type={opportunity.type} />
                        <span className="inline-flex items-center gap-1 text-text-dim">
                            <MapPin className="size-3" />
                            {opportunity.location}
                        </span>
                        {opportunity.status === "open" && (
                            <DeadlineCountdown daysRemaining={opportunity.days_remaining} />
                        )}
                    </div>

                    {opportunity.discipline_tags?.length > 0 && (
                        <p className="mt-3 text-caption text-text-faint max-w-prose">
                            {opportunity.discipline_tags.slice(0, 4).join(" · ")}
                            {opportunity.discipline_tags.length > 4 &&
                                ` · +${opportunity.discipline_tags.length - 4} more`}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}