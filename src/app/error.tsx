"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // Log to console in dev; eventually send to Sentry
    console.error("Public error boundary caught:", error);
  }, [error]);

  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <p className="text-caption uppercase tracking-wider text-text-faint">
          500
        </p>
        <h1 className="mt-2 font-display text-display-lg text-foreground">
          Something went wrong on our end.
        </h1>
        <p className="mt-4 text-body-md text-text-dim max-w-prose">
          We&apos;ve been notified. You can try again, or come back in a
          moment.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded bg-primary px-5 py-2.5 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>

          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-body-sm text-text-dim hover:text-foreground transition-colors"
          >
            <span className="border-b border-border-strong group-hover:border-foreground transition-colors">
              Back to homepage
            </span>
            <ArrowRight className="size-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Link>
        </div>

        {isDev && (
          <details className="mt-12 border-l-2 border-destructive pl-4 max-w-prose">
            <summary className="text-caption uppercase tracking-wider text-destructive cursor-pointer hover:text-destructive/80">
              Dev: error details
            </summary>
            <pre className="mt-3 text-caption text-text-dim font-mono whitespace-pre-wrap wrap-break-word">
              {error.message}
              {error.digest && `\n\nDigest: ${error.digest}`}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}