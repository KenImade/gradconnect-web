import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmployerSummary } from "@/lib/api/endpoints/employers.types";
import { EmployerLogo } from "./employer-logo";

type EmployerCardProps = {
    employer: EmployerSummary;
    className?: string;
};

export function EmployerCard({ employer, className }: EmployerCardProps) {
    return (
        <Link
            href={`/employers/${employer.slug}`}
            className={cn(
                "group block border-b border-border py-6 transition-colors",
                "hover:bg-surface-subtle/50",
                "focus-visible:outline-none focus-visible:bg-surface-subtle/70",
                className,
            )}
        >
            <div className="flex items-start gap-5">
                <EmployerLogo name={employer.name} logoUrl={employer.logo_url} size="md" />

                <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                        <h3 className="font-display text-heading-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {employer.name}
                        </h3>
                        {employer.is_verified && (
                            <BadgeCheck
                                className="size-4 shrink-0 text-success"
                                aria-label="Verified employer"
                            />
                        )}
                    </div>

                    <p className="mt-1 text-body-sm text-text-dim line-clamp-1">
                        <span className="italic">{employer.industry}</span>
                        {employer.hq_location && ` — ${employer.hq_location}`}
                    </p>

                    {employer.overview && (
                        <p className="mt-3 text-body-sm text-text-dim line-clamp-2 max-w-prose">
                            {employer.overview}
                        </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-caption text-text-faint">
                        <span>
                            <span className="font-medium text-foreground">
                                {employer.opportunity_count}
                            </span>{" "}
                            {employer.opportunity_count === 1 ? "opportunity" : "opportunities"}
                        </span>
                        {employer.review_count > 0 && (
                            <span>
                                <span className="font-medium text-foreground">
                                    {employer.review_count}
                                </span>{" "}
                                {employer.review_count === 1 ? "review" : "reviews"}
                            </span>
                        )}
                        {employer.avg_experience_rating !== null && (
                            <span>
                                <span className="font-medium text-foreground">
                                    {employer.avg_experience_rating.toFixed(1)}
                                </span>
                                /5 experience
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}