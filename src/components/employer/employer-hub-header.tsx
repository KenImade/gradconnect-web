import Link from "next/link";
import { BadgeCheck, Globe, MapPin } from "lucide-react";
import type { Employer } from "@/lib/api/endpoints/employers.types";
import { EmployerLogo } from "./employer-logo";

export function EmployerHubHeader({ employer }: { employer: Employer }) {
    return (
        <div className="border-b border-border bg-background">
            <div className="container mx-auto px-4 py-10 lg:py-12">
                <div className="flex items-start gap-6">
                    <EmployerLogo
                        name={employer.name}
                        logoUrl={employer.logo_url}
                        size="lg"
                        className="hidden sm:block"
                    />

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                            <h1 className="font-display text-display-xl text-foreground">
                                {employer.name}
                            </h1>
                            {employer.is_verified && (
                                <span
                                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-caption font-medium text-primary"
                                    aria-label="Verified employer"
                                >
                                    <BadgeCheck className="size-3.5" />
                                    Verified
                                </span>
                            )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-text-dim">
                            <span>{employer.industry}</span>
                            {employer.hq_location && (
                                <span className="inline-flex items-center gap-1">
                                    <MapPin className="size-3.5" />
                                    {employer.hq_location}
                                </span>
                            )}
                            {employer.size && <span>{employer.size} employees</span>}
                            {employer.website && (
                                <Link
                                    href={employer.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-primary hover:text-primary-hover transition-colors"
                                >
                                    <Globe className="size-3.5" />
                                    Website
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats strip */}
                <div className="mt-8 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-3">
                    <StatItem label="Reviews" value={String(employer.review_count)} />
                    <StatItem
                        label="Difficulty"
                        value={
                            employer.avg_difficulty_rating !== null
                                ? `${employer.avg_difficulty_rating.toFixed(1)}/5`
                                : "—"
                        }
                    />
                    <StatItem
                        label="Experience"
                        value={
                            employer.avg_experience_rating !== null
                                ? `${employer.avg_experience_rating.toFixed(1)}/5`
                                : "—"
                        }
                    />
                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-overline uppercase text-text-faint">{label}</p>
            <p className="mt-1 font-display text-heading-lg text-foreground">
                {value}
            </p>
        </div>
    );
}