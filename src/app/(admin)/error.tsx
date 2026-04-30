"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { ArrowLeft, RefreshCw } from "lucide-react";

type Props = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function AdminError({ error, reset }: Props) {
    useEffect(() => {
        Sentry.captureException(error, {
            extra: { digest: error.digest },
            tags: { boundary: "admin" },
        });
    }, [error]);

    const isDev = process.env.NODE_ENV !== "production";

    return (
        <div className="px-8 py-16 max-w-2xl">
            <p className="text-caption uppercase tracking-wider text-destructive">
                Error
            </p>
            <h1 className="mt-1 font-display text-display-md text-admin-foreground">
                Something broke.
            </h1>
            <p className="mt-2 text-body-sm text-admin-text-dim">
                Try again, or go back to the dashboard. If this keeps happening,
                something on the server may need attention.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                >
                    <RefreshCw className="size-3.5" />
                    Try again
                </button>

                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-body-sm text-admin-text-dim hover:text-admin-foreground transition-colors"
                >
                    <ArrowLeft className="size-3.5" />
                    Back to admin
                </Link>
            </div>

            {isDev && (
                <details className="mt-12 border-l-2 border-destructive pl-4 max-w-prose">
                    <summary className="text-caption uppercase tracking-wider text-destructive cursor-pointer hover:text-destructive/80">
                        Dev: error details
                    </summary>
                    <pre className="mt-3 text-caption text-admin-text-dim font-mono whitespace-pre-wrap wrap-break-word">
                        {error.message}
                        {error.digest && `\n\nDigest: ${error.digest}`}
                        {error.stack && `\n\n${error.stack}`}
                    </pre>
                </details>
            )}
        </div>
    );
}