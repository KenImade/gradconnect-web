import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main>
      <section className="container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-3xl">
          <p className="text-overline uppercase text-text-faint">
            Nigeria&apos;s graduate career platform
          </p>
          <h1 className="mt-4 font-display text-display-2xl text-foreground leading-none">
            Every Nigerian graduate deserves equal access to the information to launch their career.
          </h1>
          <p className="mt-6 text-body-lg text-text-dim max-w-2xl">
            Discover verified employers, understand their assessment processes,
            and prepare to apply — all in one place.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/employers"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-body-md text-primary-foreground hover:bg-primary-hover transition-colors"
            >
              Browse employers
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-transparent px-6 py-3 text-body-md text-foreground hover:bg-surface-subtle transition-colors"
            >
              Browse opportunities
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface-subtle">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-body-md text-text-dim">
            Full homepage with featured employers, deadlines, and reviews coming in Phase 5.
          </p>
        </div>
      </section>
    </main>
  );
}