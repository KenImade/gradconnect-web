import {
    FileText,
    ClipboardCheck,
    Video,
    Users,
    CircleDot,
    type LucideIcon,
} from "lucide-react";
import type { AssessmentStage } from "@/lib/api/endpoints/assessments.types";

const STAGE_ICONS: Record<AssessmentStage["stage_type"], LucideIcon> = {
    form: FileText,
    test: ClipboardCheck,
    interview: Video,
    assessment: Users,
    other: CircleDot,
};

const STAGE_LABELS: Record<AssessmentStage["stage_type"], string> = {
    form: "Application",
    test: "Assessment test",
    interview: "Interview",
    assessment: "Assessment centre",
    other: "Stage",
};

export function StageTimeline({ stages }: { stages: AssessmentStage[] }) {
    const sorted = [...stages].sort((a, b) => a.order - b.order);

    return (
        <ol className="relative">
            {sorted.map((stage, idx) => {
                const Icon = STAGE_ICONS[stage.stage_type] ?? CircleDot;
                const typeLabel = STAGE_LABELS[stage.stage_type] ?? "Stage";
                const isLast = idx === sorted.length - 1;

                return (
                    <li key={`${stage.order}-${stage.stage_name}`} className="relative">
                        {/* Vertical connector line */}
                        {!isLast && (
                            <span
                                className="absolute left-5 top-10 bottom-0 w-px bg-border"
                                aria-hidden="true"
                            />
                        )}

                        <div className="flex gap-4 pb-8">
                            {/* Icon circle */}
                            <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-text-dim">
                                <Icon className="size-5" />
                            </div>

                            {/* Content */}
                            <div className="min-w-0 flex-1 pt-1.5">
                                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                    <span className="text-caption uppercase tracking-wide text-text-faint">
                                        Stage {stage.order} · {typeLabel}
                                    </span>
                                </div>
                                <h3 className="mt-1 font-display text-heading-sm text-foreground">
                                    {stage.stage_name}
                                </h3>
                                <p className="mt-2 text-body-sm text-text-dim">
                                    {stage.description}
                                </p>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}