import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileText, Clock, ClipboardCheck, MessageSquare } from "lucide-react";
import { getEmployer } from "@/lib/api/endpoints/employers.server";
import { listEmployerAssessments } from "@/lib/api/endpoints/assessments";
import { APIError } from "@/lib/api/errors";
import { EmptyState } from "@/components/shared/empty-state";
import { StageTimeline } from "@/components/assessment/stage-timeline";
import { ProgrammeSelector } from "@/components/assessment/programme-selector";
import { PrepGuide } from "@/components/assessment/prep-guide";

type PageProps = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ programme?: string }>;
};

export async function generateMetadata({
    params,
}: Pick<PageProps, "params">): Promise<Metadata> {
    const { slug } = await params;
    try {
        const { data: employer } = await getEmployer(slug);
        return {
            title: `${employer.name} — Hiring Process & Assessment Guide`,
            description: `Step-by-step breakdown of ${employer.name}'s graduate recruitment process, assessment stages, and preparation tips.`,
            alternates: { canonical: `/employers/${employer.slug}/process` },
        };
    } catch {
        return { title: "Process not found" };
    }
}

export default async function EmployerProcessPage({
    params,
    searchParams,
}: PageProps) {
    const { slug } = await params;
    const { programme: selectedProgrammeId } = await searchParams;

    // Validate slug (uses cache(), so no extra backend hit beyond the layout)
    try {
        await getEmployer(slug);
    } catch (err) {
        if (APIError.isAPIError(err) && err.status === 404) notFound();
        throw err;
    }

    const { data: assessments } = await listEmployerAssessments(slug);

    if (assessments.length === 0) {
        return (
            <EmptyState
                icon={FileText}
                title="Process details not yet documented"
                description="We haven't documented this employer's recruitment process yet. Check the Reviews tab for first-hand candidate experiences, or check back later."
            />
        );
    }

    // Resolve which profile to show:
    //   1. The one matching ?programme=<id> if valid
    //   2. Otherwise the first one (backend returns them ordered)
    const active =
        (selectedProgrammeId &&
            assessments.find((a) => a.id === selectedProgrammeId)) ||
        assessments[0]!;

    return (
        <div className="space-y-10">
            {/* Programme selector (only renders when 2+ programmes) */}
            {assessments.length > 1 && (
                <section>
                    <h2 className="font-display text-heading-lg text-foreground">
                        Choose a programme
                    </h2>
                    <p className="mt-1 text-body-sm text-text-dim">
                        {assessments.length} programmes at this employer. Select one to see
                        its process.
                    </p>
                    <div className="mt-4">
                        <ProgrammeSelector
                            options={assessments.map((a) => ({
                                id: a.id,
                                programme_type: a.programme_type,
                            }))}
                            currentId={active.id}
                        />
                    </div>
                </section>
            )}

            {/* Metadata row */}
            <section>
                <h2 className="font-display text-heading-xl text-foreground">
                    {active.programme_type}
                </h2>
                <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {active.aptitude_test_provider && (
                        <MetaItem
                            icon={ClipboardCheck}
                            label="Aptitude test"
                            value={active.aptitude_test_provider}
                        />
                    )}
                    {active.interview_format && (
                        <MetaItem
                            icon={MessageSquare}
                            label="Interview format"
                            value={active.interview_format}
                        />
                    )}
                    {active.timeline_weeks !== null && (
                        <MetaItem
                            icon={Clock}
                            label="Typical timeline"
                            value={`${active.timeline_weeks} weeks`}
                        />
                    )}
                </dl>
            </section>

            {/* Stages */}
            <section>
                <h2 className="font-display text-heading-xl text-foreground">
                    The process
                </h2>
                <p className="mt-2 max-w-prose text-body-sm text-text-dim">
                    {active.stages.length} stages from application to offer. Based on
                    public information and community reviews — actual steps may vary.
                </p>
                <div className="mt-8">
                    <StageTimeline stages={active.stages} />
                </div>
            </section>

            {/* Prep guide */}
            {active.prep_guide && (
                <section>
                    <h2 className="font-display text-heading-xl text-foreground">
                        How to prepare
                    </h2>
                    <div className="mt-6">
                        <PrepGuide markdown={active.prep_guide} />
                    </div>
                </section>
            )}

            {/* Last updated */}
            <p className="text-caption text-text-faint">
                Last updated{" "}
                {new Date(active.updated_at).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })}
            </p>
        </div>
    );
}

function MetaItem({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof FileText;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-md border border-border bg-surface-subtle p-4">
            <dt className="flex items-center gap-2 text-caption uppercase tracking-wide text-text-faint">
                <Icon className="size-3.5" />
                {label}
            </dt>
            <dd className="mt-2 font-display text-heading-sm text-foreground capitalize">
                {value}
            </dd>
        </div>
    );
}