import type { ComponentType } from "react";
import { BriefcaseIcon, CompassIcon, PenNibIcon, TrackerIcon, ShareReviewIcon } from "./illustrations/icons";

type ValueItem = {
    Icon: ComponentType<{ className?: string }>;
    title: string;
    description: string;
};

const VALUE_PROPS: ValueItem[] = [
    {
        Icon: BriefcaseIcon,
        title: "Discover employers",
        description:
            "Rich profiles of Nigeria's graduate employers — culture, programme structure, application timelines, Nigerian office locations.",
    },
    {
        Icon: CompassIcon,
        title: "Understand their process",
        description:
            "For every employer, a structured breakdown of their assessment — aptitude tests, interview formats, group exercises, typical timelines from application to offer.",
    },
    {
        Icon: PenNibIcon,
        title: "Prepare with real intelligence",
        description:
            "First-hand reviews from candidates who have been through the process. What to expect, what to practice, what assessors look for.",
    },
    {
        Icon: TrackerIcon,
        title: "Track every application",
        description:
            "One place for every application you're working — past, present, and pending. No spreadsheets, no missed deadlines."
    },
    {
        Icon: ShareReviewIcon,
        title: "Share your experience",
        description:
            "Help the next graduate. Submit anonymous reviews of assessments and interviews you've been through, and pay it forward.",
    },
];

export function ValueProp() {
    const topRow = VALUE_PROPS.slice(0, 3);
    const bottomRow = VALUE_PROPS.slice(3, 5);

    return (
        <div className="grid gap-10 lg:grid-cols-6 lg:gap-x-12 lg:gap-y-14">
            {/* Top row: three full columns each */}
            {topRow.map(({ Icon, title, description }) => (
                <article
                    key={title}
                    className="lg:col-span-2"
                >
                    <Icon className="size-12 text-foreground" />
                    <h3 className="mt-5 font-display text-heading-md text-foreground">
                        {title}
                    </h3>
                    <p className="mt-3 text-body-md text-text-dim">
                        {description}
                    </p>
                </article>
            ))}

            {/* Bottom row: two items centred — first starts at column 2, second follows */}
            {bottomRow.map(({ Icon, title, description }, i) => (
                <article
                    key={title}
                    className={
                        i === 0
                            ? "lg:col-span-2 lg:col-start-2"
                            : "lg:col-span-2"
                    }
                >
                    <Icon className="size-12 text-foreground" />
                    <h3 className="mt-5 font-display text-heading-md text-foreground">
                        {title}
                    </h3>
                    <p className="mt-3 text-body-md text-text-dim">
                        {description}
                    </p>
                </article>
            ))}
        </div>
    );
}