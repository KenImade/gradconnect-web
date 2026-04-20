import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="bg-surface-muted text-text-dim inline-flex size-12 items-center justify-center rounded-full">
          <Compass className="size-6" />
        </div>
        <h1 className="font-display text-display-lg text-foreground mt-6">Page not found</h1>
        <p className="text-body-md text-text-dim mt-2">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-primary text-body-sm text-primary-foreground hover:bg-primary-hover rounded-md px-5 py-2.5 transition-colors"
          >
            Back to homepage
          </Link>
          <Link
            href="/employers"
            className="border-border-strong text-body-sm text-foreground hover:bg-surface-subtle rounded-md border bg-transparent px-5 py-2.5 transition-colors"
          >
            Browse employers
          </Link>
          <Link
            href="/opportunities"
            className="border-border-strong text-body-sm text-foreground hover:bg-surface-subtle rounded-md border bg-transparent px-5 py-2.5 transition-colors"
          >
            Browse opportunities
          </Link>
        </div>
      </div>
    </div>
  );
}
