import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import type { Opportunity } from "@/lib/api/endpoints/opportunities.types";

type Props = {
    employerSlug: string;
    employerName: string;
    opportunities: Opportunity[];
};

const TYPE_LABELS: Record<string, string> = {
    graduate_trainee: "Graduate Trainee",
    internship: "Internship",
    nysc: "NYSC",
    industrial_attachment: "Industrial Attachment",
};

export function EmployerOpportunitiesSidebar({
    employerSlug,
    employerName,
    opportunities,
}: Props) {
    return (
        <div className="rounded-lg border border-border bg-background p-6">
            <h3 className="font-display text-heading-md text-foreground">
                Active opportunities
            </h3>

            {opportunities.length === 0 ? (
                <p className="mt-4 text-body-sm text-text-dim">
                    No open opportunities from {employerName} right now. Check
                    back, or browse{" "}
                    <Link
                        href="/opportunities"
                        className="text-foreground underline-offset-2 hover:underline hover:text-primary transition-colors"
                    >
                        all open programmes
                    </Link>
                    .
                </p>
            ) : (
                <ul className="mt-4 space-y-4 divide-y divide-border">
                    {opportunities.map((opp, i) => (
                        <li key={opp.id} className={i > 0 ? "pt-4" : undefined}>
                            <Link
                                href={`/opportunities/${opp.slug}`}
                                className="group block"
                            >
                                <h4 className="text-body-md font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                                    {opp.title}
                                </h4>
                                <dl className="mt-2 space-y-1 text-caption text-text-dim">
                                    {opp.type && (
                                        <div className="inline-flex items-center gap-1">
                                            <dt className="sr-only">Type</dt>
                                            <dd>{TYPE_LABELS[opp.type] ?? opp.type}</dd>
                                        </div>
                                    )}
                                    {opp.location && (
                                        <div className="inline-flex items-center gap-1.5">
                                            <MapPin className="size-3" aria-hidden />
                                            <dt className="sr-only">Location</dt>
                                            <dd>{opp.location}</dd>
                                        </div>
                                    )}
                                    {opp.deadline && (
                                        <div className="inline-flex items-center gap-1.5">
                                            <Calendar className="size-3" aria-hidden />
                                            <dt className="sr-only">Deadline</dt>
                                            <dd>
                                                <DeadlineLabel
                                                    deadline={opp.deadline}
                                                    daysRemaining={opp.days_remaining}
                                                />
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {opportunities.length > 0 && (
                <Link
                    href={`/opportunities?employer=${employerSlug}`}
                    className="mt-5 inline-flex items-center gap-1 text-body-sm text-foreground hover:text-primary transition-colors"
                >
                    See all opportunities
                    <ArrowRight className="size-3.5" />
                </Link>
            )}
        </div>
    );
}

function DeadlineLabel({
    deadline,
    daysRemaining,
}: {
    deadline: string;
    daysRemaining: number | null;
}) {
    if (daysRemaining === null) {
        return <>Rolling deadline</>;
    }
    if (daysRemaining < 0) {
        return <>Closed</>;
    }
    if (daysRemaining === 0) {
        return <span className="text-primary font-medium">Closes today</span>;
    }
    if (daysRemaining <= 7) {
        return (
            <span className="text-primary font-medium">
                {daysRemaining} day{daysRemaining === 1 ? "" : "s"} left
            </span>
        );
    }
    if (daysRemaining <= 30) {
        return (
            <>
                {daysRemaining} days left
            </>
        );
    }
    return <>Closes {new Date(deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</>;
}