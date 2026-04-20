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
                "group block rounded-lg border border-border bg-background p-6 transition-all",
                "hover:border-border-strong hover:shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className,
            )}
        >
            <div className="flex items-start gap-4">
                <EmployerLogo name={employer.name} logoUrl={employer.logo_url} size="md" />

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-heading-md text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {employer.name}
                        </h3>
                        {employer.is_verified && (
                            <BadgeCheck
                                className="size-5 shrink-0 text-primary"
                                aria-label="Verified employer"
                            />
                        )}
                    </div>

                    <p className="mt-1 text-body-sm text-text-dim line-clamp-1">
                        {employer.industry}
                        {employer.hq_location && ` · ${employer.hq_location}`}
                    </p>

                    {employer.overview && (
                        <p className="mt-3 text-body-sm text-text-dim line-clamp-2">
                            {employer.overview}
                        </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-text-faint">
                        <span>
                            {employer.opportunity_count}{" "}
                            {employer.opportunity_count === 1 ? "opportunity" : "opportunities"}
                        </span>
                        {employer.review_count > 0 && (
                            <span>
                                {employer.review_count}{" "}
                                {employer.review_count === 1 ? "review" : "reviews"}
                            </span>
                        )}
                        {employer.avg_experience_rating !== null && (
                            <span>
                                {employer.avg_experience_rating.toFixed(1)}/5 experience
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}