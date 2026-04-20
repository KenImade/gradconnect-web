"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO (Phase 5): Sentry.captureException(error)
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="bg-destructive/10 text-destructive inline-flex size-12 items-center justify-center rounded-full">
          <AlertCircle className="size-6" />
        </div>
        <h1 className="font-display text-heading-xl text-foreground mt-6">Something went wrong</h1>
        <p className="text-body-md text-text-dim mt-2">
          We&apos;ve been notified and we&apos;re looking into it. Try again?
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="bg-primary text-body-sm text-primary-foreground hover:bg-primary-hover rounded-md px-5 py-2.5 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border-border-strong text-body-sm text-foreground hover:bg-surface-subtle rounded-md border bg-transparent px-5 py-2.5 transition-colors"
          >
            Back to homepage
          </Link>
        </div>
        {error.digest && (
          <p className="text-caption text-text-faint mt-6 font-mono">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
