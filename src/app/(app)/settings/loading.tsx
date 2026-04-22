import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-10 lg:py-14">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-12 w-64" />
            <Skeleton className="mt-3 h-4 w-full max-w-prose" />

            <div className="mt-12 space-y-12">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-11 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}