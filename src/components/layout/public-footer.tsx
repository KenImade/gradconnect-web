import Link from "next/link";

export function PublicFooter() {
    const year = new Date().getFullYear();

    return (
      <footer className="border-border border-t">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-display text-heading-md text-foreground">GradConnect</p>
              <p className="text-body-sm text-text-dim mt-2 max-w-prose italic">
                Nigeria&apos;s graduate career intelligence platform.
              </p>
            </div>

            <nav className="text-body-sm flex flex-wrap gap-x-8 gap-y-3">
              <Link
                href="/employers"
                className="text-text-dim hover:text-foreground transition-colors"
              >
                Employers
              </Link>
              <Link
                href="/opportunities"
                className="text-text-dim hover:text-foreground transition-colors"
              >
                Opportunities
              </Link>
              <Link href="/about" className="text-text-dim hover:text-foreground transition-colors">
                About
              </Link>
              <Link
                href="/privacy"
                className="text-text-dim hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-text-dim hover:text-foreground transition-colors"
              >
                Terms of Use
              </Link>
            </nav>
          </div>

          <p className="text-caption text-text-faint mt-10">© {year} GradConnect · Made in Lagos</p>
        </div>
      </footer>
    );
}