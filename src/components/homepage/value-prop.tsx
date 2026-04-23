import type { ComponentType } from "react";
import { BriefcaseIcon, CompassIcon, PenNibIcon } from "./illustrations/icons";

type ValueItem = {
    Icon: ComponentType<{ className?: string }>;
    title: string;
    description: string;
};

const ITEMS: ValueItem[] = [
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
];

export function ValueProp() {
    return (
        <ul className="grid gap-10 md:grid-cols-3">
            {ITEMS.map(({ Icon, title, description }) => (
                <li key={title} className="border-l-2 border-primary pl-5">
                    <div className="text-primary" aria-hidden>
                        <Icon className="size-10" />
                    </div>
                    <h3 className="mt-3 font-display text-heading-md text-foreground">
                        {title}
                    </h3>
                    <p className="mt-2 text-body-md text-text-dim">{description}</p>
                </li>
            ))}
        </ul>
    );
}