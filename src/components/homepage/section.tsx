import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type HomeSectionProps = {
    eyebrow: string;
    title: string;
    description?: string;
    ctaHref?: string;
    ctaLabel?: string;
    children: ReactNode;
};

/**
 * Standard homepage section with editorial header + optional "see all" CTA.
 * Sections are separated by border-t at the page level, not inside the section.
 */
export function HomeSection({
    eyebrow,
    title,
    description,
    ctaHref,
    ctaLabel,
    children,
}: HomeSectionProps) {
    return (
        <section className="border-t border-border">
            <div className="container mx-auto px-4 py-16 lg:py-24">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8 lg:mb-12">
                    <div>
                        <p className="text-caption uppercase tracking-wider text-text-faint">
                            {eyebrow}
                        </p>
                        <h2 className="mt-2 font-display text-display-md text-foreground">
                            {title}
                        </h2>
                        {description && (
                            <p className="mt-3 text-body-md text-text-dim max-w-prose">
                                {description}
                            </p>
                        )}
                    </div>

                    {ctaHref && ctaLabel && (
                        <Link
                            href={ctaHref}
                            className="inline-flex items-center gap-1.5 text-body-sm text-foreground hover:text-primary transition-colors"
                        >
                            {ctaLabel}
                            <ArrowRight className="size-4" />
                        </Link>
                    )}
                </div>

                {children}
            </div>
        </section>
    );
}