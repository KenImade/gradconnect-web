"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default function OpportunitiesError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Opportunities page error:", error);
    }, [error]);

    return (
        <div className="container mx-auto px-4 py-12 lg:py-16">
            <PageHeader
                eyebrow="Opportunities"
                title="Graduate opportunities in Nigeria"
            />
            <EmptyState
                className="mt-12"
                icon={AlertCircle}
                title="Couldn't load opportunities"
                description="Something went wrong on our side. Try refreshing — we've been notified."
                action={
                    <button
                        onClick={reset}
                        className="rounded-md bg-primary px-5 py-2.5 text-body-sm text-primary-foreground hover:bg-primary-hover transition-colors"
                    >
                        Try again
                    </button>
                }
            />
        </div>
    );
}