import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="font-display text-heading-md text-foreground hover:text-primary transition-colors"
          >
            GradConnect
          </Link>

          <nav className="text-body-sm hidden items-center gap-8 md:flex">
            <Link
              href="/employers"
              className="text-foreground hover:text-primary transition-colors"
            >
              Employers
            </Link>
            <Link
              href="/opportunities"
              className="text-foreground hover:text-primary transition-colors"
            >
              Opportunities
            </Link>
            <Link href="/prepare" className="text-foreground hover:text-primary transition-colors">
              Prepare
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-body-sm text-foreground hover:text-primary transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-primary text-body-sm text-primary-foreground hover:bg-primary-hover rounded-md px-4 py-2 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-border bg-surface-subtle border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div>
              <p className="font-display text-heading-md text-foreground">GradConnect</p>
              <p className="text-body-sm text-text-dim mt-2 max-w-xs">
                Nigeria&apos;s graduate career intelligence platform.
              </p>
            </div>
            <div className="text-body-sm flex gap-12">
              <div>
                <p className="text-caption text-text-faint tracking-wide uppercase">Product</p>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link href="/employers" className="hover:text-primary transition-colors">
                      Employers
                    </Link>
                  </li>
                  <li>
                    <Link href="/opportunities" className="hover:text-primary transition-colors">
                      Opportunities
                    </Link>
                  </li>
                  <li>
                    <Link href="/prepare" className="hover:text-primary transition-colors">
                      Prepare
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-caption text-text-faint tracking-wide uppercase">Legal</p>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link href="/privacy" className="hover:text-primary transition-colors">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-primary transition-colors">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/ndpr" className="hover:text-primary transition-colors">
                      NDPR
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p className="border-border text-caption text-text-faint mt-12 border-t pt-8">
            © 2026 GradConnect · Made in Lagos
          </p>
        </div>
      </footer>
    </div>
  );
}
