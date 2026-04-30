import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-subtle flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="text-body-sm text-text-dim hover:text-foreground inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </div>

      <main className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 block text-center">
            <span className="font-display text-heading-xl text-foreground">GradConnect</span>
          </Link>
          <div className="border-border bg-background rounded-lg border p-8 shadow-sm">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
