import Link from "next/link";

export function PublicFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-border">
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="font-display text-heading-md text-foreground">
                            GradConnect
                        </p>
                        <p className="mt-2 text-body-sm text-text-dim italic max-w-prose">
                            Nigeria&apos;s graduate career intelligence platform.
                        </p>
                    </div>

                    <nav className="flex flex-wrap gap-x-8 gap-y-3 text-body-sm">
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
                        <Link
                            href="/about"
                            className="text-text-dim hover:text-foreground transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-text-dim hover:text-foreground transition-colors"
                        >
                            Privacy
                        </Link>
                    </nav>
                </div>

                <p className="mt-10 text-caption text-text-faint">
                    © {year} GradConnect · Made in Lagos
                </p>
            </div>
        </footer>
    );
}