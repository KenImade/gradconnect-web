import Link from "next/link";
import { UserMenu } from "./user-menu";
import type { User } from "@/lib/api/endpoints/users.types";

export function PublicHeader({ user }: { user: User | null }) {
    return (
        <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/90 backdrop-blur">
            <div className="container mx-auto flex h-full items-center justify-between px-4">
                <Link
                    href="/"
                    className="font-display text-heading-md text-foreground hover:text-primary transition-colors"
                >
                    GradConnect
                </Link>

                <nav className="flex items-center gap-6">
                    <Link
                        href="/employers"
                        className="hidden text-body-sm text-text-dim hover:text-foreground transition-colors sm:inline"
                    >
                        Employers
                    </Link>
                    <Link
                        href="/opportunities"
                        className="hidden text-body-sm text-text-dim hover:text-foreground transition-colors sm:inline"
                    >
                        Opportunities
                    </Link>

                    {user ? (
                        <UserMenu user={user} />
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-body-sm text-text-dim hover:text-foreground transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}