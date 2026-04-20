"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type ProgrammeOption = {
    id: string;
    programme_type: string;
};

export function ProgrammeSelector({
    options,
    currentId,
}: {
    options: ProgrammeOption[];
    currentId: string;
}) {
    const pathname = usePathname();

    if (options.length <= 1) return null;

    return (
        <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Assessment programme"
        >
            {options.map((option) => {
                const isActive = option.id === currentId;
                return (
                    <Link
                        key={option.id}
                        href={`${pathname}?programme=${option.id}`}
                        role="tab"
                        aria-selected={isActive}
                        className={cn(
                            "rounded-full border px-4 py-2 text-body-sm transition-colors",
                            isActive
                                ? "border-primary bg-primary/10 text-primary font-medium"
                                : "border-border text-text-dim hover:border-border-strong hover:text-foreground",
                        )}
                    >
                        {option.programme_type}
                    </Link>
                );
            })}
        </div>
    );
}