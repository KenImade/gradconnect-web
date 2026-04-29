import { Skeleton } from "@/components/ui/skeleton";

export default function ModerationLoading() {
    return (
        <div className="px-8 py-8 max-w-5xl">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-1 h-10 w-72" />
            <Skeleton className="mt-2 h-4 w-full max-w-prose" />

            <div className="mt-8 flex gap-1 border-b border-admin-border">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-20" />
                ))}
            </div>

            <div className="mt-2 border-t border-admin-border">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="border-b border-admin-border px-5 py-4">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="mt-2 h-3 w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}