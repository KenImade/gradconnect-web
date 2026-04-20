"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Tab = {
    label: string;
    href: (slug: string) => string;
    pattern: (pathname: string, slug: string) => boolean;
};

const TABS: Tab[] = [
    {
        label: "Overview",
        href: (slug) => `/employers/${slug}`,
        pattern: (pathname, slug) => pathname === `/employers/${slug}`,
    },
    {
        label: "Process",
        href: (slug) => `/employers/${slug}/process`,
        pattern: (pathname, slug) => pathname === `/employers/${slug}/process`,
    },
    {
        label: "Reviews",
        href: (slug) => `/employers/${slug}/reviews`,
        pattern: (pathname, slug) =>
            pathname === `/employers/${slug}/reviews` ||
            pathname.startsWith(`/employers/${slug}/reviews/`),
    },
];

export function EmployerHubTabs({ slug }: { slug: string }) {
    const pathname = usePathname();

    return (
        <div className="sticky top-16 z-30 border-b border-border bg-background/80 backdrop-blur">
            <div className="container mx-auto px-4">
                <nav
                    className="flex gap-1 overflow-x-auto"
                    aria-label="Employer sections"
                >
                    {TABS.map((tab) => {
                        const isActive = tab.pattern(pathname, slug);
                        return (
                            <Link
                                key={tab.label}
                                href={tab.href(slug)}
                                className={cn(
                                    "relative px-4 py-3 text-body-sm whitespace-nowrap transition-colors",
                                    isActive
                                        ? "text-foreground font-medium"
                                        : "text-text-dim hover:text-foreground",
                                )}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {tab.label}
                                {isActive && (
                                    <span
                                        className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                                        aria-hidden="true"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}