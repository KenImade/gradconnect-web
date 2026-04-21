import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, ExternalLink, FileText } from "lucide-react";
import { getOpportunity } from "@/lib/api/endpoints/opportunities";
import { getRelatedOpportunities } from "@/lib/api/endpoints/opportunities.helpers";
import { APIError } from "@/lib/api/errors";
import { env } from "@/lib/config";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { EmployerLogo } from "@/components/employer/employer-logo";
import { StatusBadge } from "@/components/opportunity/status-badge";
import { TypeBadge } from "@/components/opportunity/type-badge";
import { DeadlineCountdown } from "@/components/opportunity/deadline-countdown";
import { StatusBanner } from "@/components/opportunity/status-banner";
import { ApplyCTA } from "@/components/opportunity/apply-cta";
import { OpportunityCard } from "@/components/opportunity/opportunity-card";
import { jobPostingSchema } from "@/lib/seo/job-posting-schema";
import { BookmarkButton } from "@/components/opportunity/bookmark-button";

type PageProps = {
    params: Promise<{ slug: string }>;
};

function truncate(s: string, max: number): string {
    if (s.length <= max) return s;
    return s.slice(0, max - 1).trimEnd() + "…";
}

function formatDate(iso: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const { data: o } = await getOpportunity(slug);
        return {
            title: `${o.title} at ${o.employer.name}`,
            description: truncate(o.description, 160),
            alternates: { canonical: `/opportunities/${o.slug}` },
            openGraph: {
                title: `${o.title} — ${o.employer.name}`,
                description: truncate(o.description, 160),
                type: "article",
                url: `/opportunities/${o.slug}`,
            },
            twitter: { card: "summary_large_image" },
        };
    } catch {
        return { title: "Opportunity not found" };
    }
}

export default async function OpportunityDetailPage({ params }: PageProps) {
    const { slug } = await params;

    let opportunity;
    try {
        const result = await getOpportunity(slug);
        opportunity = result.data;
    } catch (err) {
        if (APIError.isAPIError(err) && err.status === 404) notFound();
        throw err;
    }

    const related = await getRelatedOpportunities(opportunity);
    const jsonLd = jobPostingSchema(opportunity, env.NEXT_PUBLIC_SITE_URL);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container mx-auto px-4 py-8 lg:py-12">
                <Breadcrumbs
                    crumbs={[
                        { label: "Opportunities", href: "/opportunities" },
                        {
                            label: opportunity.employer.name,
                            href: `/employers/${opportunity.employer.slug}`,
                        },
                        { label: opportunity.title },
                    ]}
                />
                {/* Header */}
                <header className="mt-6">
                    <Link
                        href={`/employers/${opportunity.employer.slug}`}
                        className="group inline-flex items-center gap-3"
                    >
                        <EmployerLogo
                            name={opportunity.employer.name}
                            logoUrl={opportunity.employer.logo_url}
                            size="md"
                        />
                        <div>
                            <p className="text-body-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                {opportunity.employer.name}
                            </p>
                            <p className="text-caption text-text-faint">
                                {opportunity.employer.industry}
                            </p>
                        </div>
                    </Link>

                    <h1 className="mt-6 font-display text-display-lg text-foreground">
                        {opportunity.title}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <StatusBadge status={opportunity.status} />
                        <TypeBadge type={opportunity.type} />
                        <span className="inline-flex items-center gap-1 text-caption text-text-dim">
                            <MapPin className="size-3.5" />
                            {opportunity.location}
                        </span>
                        <span className="inline-flex items-center gap-1 text-caption text-text-dim">
                            <Calendar className="size-3.5" />
                            Intake {opportunity.intake_year}
                        </span>
                        {opportunity.status === "open" && (
                            <DeadlineCountdown daysRemaining={opportunity.days_remaining} />
                        )}
                    </div>
                </header>

                {/* Status banner */}
                <div className="mt-6">
                    <StatusBanner
                        status={opportunity.status}
                        opensAt={opportunity.opens_at}
                        deadline={opportunity.deadline}
                        employerName={opportunity.employer.name}
                    />
                </div>

                {/* Apply CTA bar */}
                <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background p-5">
                    <ApplyCTA
                        applicationUrl={opportunity.application_url}
                        status={opportunity.status}
                        opensAt={opportunity.opens_at}
                        deadline={opportunity.deadline}
                    />
                    <div className="flex-1" />
                    <BookmarkButton
                        opportunityId={opportunity.id}
                        opportunityTitle={opportunity.title}
                        variant="inline"
                    />
                </div>

                {/* Two-column content */}
                <div className="mt-10 grid gap-10 lg:grid-cols-3">
                    {/* Main column */}
                    <div className="space-y-10 lg:col-span-2">
                        <section>
                            <h2 className="font-display text-heading-xl text-foreground">
                                About this opportunity
                            </h2>
                            <p className="mt-4 whitespace-pre-line text-body-md text-text-dim max-w-prose">
                                {opportunity.description}
                            </p>
                        </section>

                        {opportunity.requirements && (
                            <section>
                                <h2 className="font-display text-heading-xl text-foreground">
                                    Requirements
                                </h2>
                                <p className="mt-4 whitespace-pre-line text-body-md text-text-dim max-w-prose">
                                    {opportunity.requirements}
                                </p>
                            </section>
                        )}

                        {opportunity.discipline_tags.length > 0 && (
                            <section>
                                <h2 className="font-display text-heading-xl text-foreground">
                                    Disciplines
                                </h2>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {opportunity.discipline_tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center rounded-md bg-surface-subtle px-3 py-1 text-body-sm text-text-dim"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        <div className="rounded-lg border border-border bg-background p-6">
                            <h3 className="font-display text-heading-md text-foreground">
                                Key dates
                            </h3>
                            <dl className="mt-4 space-y-3 text-body-sm">
                                <div>
                                    <dt className="text-caption uppercase tracking-wide text-text-faint">
                                        Applications open
                                    </dt>
                                    <dd className="mt-0.5 text-foreground">
                                        {formatDate(opportunity.opens_at)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-caption uppercase tracking-wide text-text-faint">
                                        Deadline
                                    </dt>
                                    <dd className="mt-0.5 text-foreground">
                                        {formatDate(opportunity.deadline)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-caption uppercase tracking-wide text-text-faint">
                                        Intake year
                                    </dt>
                                    <dd className="mt-0.5 text-foreground">
                                        {opportunity.intake_year}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="rounded-lg border border-border bg-background p-6">
                            <h3 className="font-display text-heading-md text-foreground">
                                Prepare for this employer
                            </h3>
                            <p className="mt-2 text-body-sm text-text-dim">
                                Read about {opportunity.employer.name}&apos;s assessment process
                                and see reviews from past candidates.
                            </p>
                            <div className="mt-4 flex flex-col gap-2">
                                <Link
                                    href={`/employers/${opportunity.employer.slug}/process`}
                                    className="inline-flex items-center justify-between rounded-md border border-border-strong bg-transparent px-4 py-2 text-body-sm text-foreground hover:bg-surface-subtle transition-colors"
                                >
                                    View process
                                    <FileText className="size-4 text-text-faint" />
                                </Link>
                                <Link
                                    href={`/employers/${opportunity.employer.slug}/reviews`}
                                    className="inline-flex items-center justify-between rounded-md border border-border-strong bg-transparent px-4 py-2 text-body-sm text-foreground hover:bg-surface-subtle transition-colors"
                                >
                                    Read reviews
                                    <FileText className="size-4 text-text-faint" />
                                </Link>
                            </div>
                        </div>

                        {opportunity.source_url && (
                            <div className="rounded-lg border border-border bg-surface-subtle p-5 text-caption text-text-faint">
                                <p>

                                    Listed from{" "}
                                    <a
                                        href={opportunity.source_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                                    >
                                        original source
                                        <ExternalLink className="size-3" />
                                    </a>
                                    .
                                </p>
                            </div>
                        )}
                    </aside>
                </div >

                {/* Related */}
                {related.length > 0 && (
                    <section className="mt-16">
                        <h2 className="font-display text-heading-xl text-foreground">
                            Related opportunities
                        </h2>
                        <p className="mt-2 text-body-sm text-text-dim">
                            More openings at {opportunity.employer.name} or in{" "}
                            {opportunity.employer.industry}.
                        </p>
                        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {related.map((o) => (
                                <OpportunityCard key={o.id} opportunity={o} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}

