import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { EmployerLogo } from "@/components/employer/employer-logo";
import { TypeBadge } from "@/components/opportunity/type-badge";
import { DeadlineCountdown } from "@/components/opportunity/deadline-countdown";
import type { Opportunity } from "@/lib/api/endpoints/opportunities.types";

type ClosingSoonProps = {
    opportunities: Opportunity[];
};

export function ClosingSoon({ opportunities }: ClosingSoonProps) {
    if (opportunities.length === 0) {
        return (
            <p className="text-body-md text-text-dim italic">
                No open opportunities right now. Check back soon.
            </p>
        );
    }

    return (
        <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
            <div
                className="hidden text-primary lg:flex items-start justify-center"
                aria-hidden
            >
                <Image
                    src="/images/digital-calendar.webp"
                    alt="Digital Calendar"
                    width={799}
                    height={618}
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="w-full h-auto"
                />
                {/* <CalendarPage className="w-full max-w-[220px]" /> */}
            </div>

            <ul className="grid gap-6 md:grid-cols-3">
                {opportunities.map((opportunity) => (
                    <li key={opportunity.id}>
                        <Link
                            href={`/opportunities/${opportunity.slug}`}
                            className="group flex h-full flex-col rounded-md border border-border bg-background p-5 transition-colors hover:border-border-strong"
                        >
                            <div className="flex items-center gap-3">
                                <EmployerLogo
                                    name={opportunity.employer.name}
                                    logoUrl={opportunity.employer.logo_url}
                                    size="sm"
                                />
                                <div className="min-w-0">
                                    <p className="truncate text-caption text-text-faint italic">
                                        {opportunity.employer.name}
                                    </p>
                                    <TypeBadge type={opportunity.type} />
                                </div>
                            </div>

                            <h3 className="mt-4 font-display text-heading-md text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {opportunity.title}
                            </h3>

                            <div className="mt-auto pt-4 space-y-2 text-caption text-text-dim">
                                <p className="inline-flex items-center gap-1.5">
                                    <MapPin className="size-3.5 text-text-faint" />
                                    {opportunity.location}
                                </p>
                                {opportunity.deadline && (
                                    <p className="inline-flex items-center gap-1.5">
                                        <Calendar className="size-3.5 text-text-faint" />
                                        <DeadlineCountdown
                                            daysRemaining={opportunity.days_remaining}
                                        />
                                    </p>
                                )}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}