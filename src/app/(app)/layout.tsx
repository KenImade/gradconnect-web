import Link from "next/link";

// TODO (Phase 3): implement real session guard.
// export default async function AppLayout({ children }) {
//   const user = await getSession();
//   if (!user) redirect("/login");
//   ...
// }

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 border-b border-border bg-background">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link
                        href="/dashboard"
                        className="font-display text-heading-md text-foreground"
                    >
                        GradConnect
                    </Link>
                    <div className="flex items-center gap-4 text-body-sm">
                        <Link href="/employers" className="text-text-dim hover:text-foreground transition-colors">
                            Browse
                        </Link>
                        <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                            Dashboard
                        </Link>
                        <span className="text-text-faint">|</span>
                        <span className="text-text-dim">
                            [Auth stub — real user menu in Phase 3]
                        </span>
                    </div>
                </div>
            </header>

            <div className="flex-1 bg-surface-subtle">
                <div className="container mx-auto px-4 py-8">{children}</div>
            </div>
        </div>
    );
}