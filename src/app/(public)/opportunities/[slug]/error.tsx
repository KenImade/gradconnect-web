"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function OpportunityError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Opportunity detail error:", error);
    }, [error]);

    return (
        <div className="container mx-auto px-4 py-16 lg:py-24">
            <EmptyState
                icon={AlertCircle}
                title="Couldn't load this opportunity"
                description="Something went wrong on our side. Try refreshing."
                action={
                    <div className="flex gap-3">
                        <button
                            onClick={reset}
                            className="rounded-md bg-primary px-5 py-2.5 text-body-sm text-primary-foreground hover:bg-primary-hover transition-colors"
                        >
                            Try again
                        </button>
                        <Link
                            href="/opportunities"
                            className="rounded-md border border-border-strong bg-transparent px-5 py-2.5 text-body-sm text-foreground hover:bg-surface-subtle transition-colors"
                        >
                            Browse all
                        </Link>
                    </div>
                }
            />
        </div>
    );
}