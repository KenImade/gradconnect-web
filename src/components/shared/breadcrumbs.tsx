import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

type Crumb = {
    label: string;
    href?: string;
};

export function Breadcrumbs({
    crumbs,
    className,
}: {
    crumbs: Crumb[];
    className?: string;
}) {
    return (
        <nav aria-label="Breadcrumb" className={cn("text-caption", className)}>
            <ol className="flex flex-wrap items-center gap-1 text-text-dim">
                <li>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                        aria-label="Home"
                    >
                        <Home className="size-3.5" />
                    </Link>
                </li>
                {crumbs.map((crumb, idx) => {
                    const isLast = idx === crumbs.length - 1;
                    return (
                        <li key={idx} className="flex items-center gap-1">
                            <ChevronRight className="size-3 text-text-faint" aria-hidden="true" />
                            {isLast || !crumb.href ? (
                                <span
                                    className="text-foreground truncate max-w-60"
                                    aria-current={isLast ? "page" : undefined}
                                >
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    href={crumb.href}
                                    className="hover:text-foreground transition-colors truncate max-w-60"
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}