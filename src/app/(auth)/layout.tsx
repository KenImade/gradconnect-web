import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-surface-subtle flex flex-col">
            <div className="container mx-auto px-4 py-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-body-sm text-text-dim hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    Back to home
                </Link>
            </div>

            <main className="flex-1 flex items-center justify-center px-4 pb-12">
                <div className="w-full max-w-md">
                    <Link href="/" className="block text-center mb-8">
                        <span className="font-display text-heading-xl text-foreground">GradConnect</span>
                    </Link>
                    <div className="rounded-lg border border-border bg-background p-8 shadow-sm">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}