import { Skeleton } from "@/components/ui/skeleton";

export default function TrackerLoading() {
    return (
        <div className="container mx-auto px-4 py-10 lg:py-14">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="mt-2 h-12 w-72" />
            <Skeleton className="mt-3 h-4 w-40" />
            <Skeleton className="mt-6 h-10 w-44" />

            <div className="mt-8 grid gap-4 [grid-template-columns:repeat(6,minmax(280px,1fr))]">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2 border-t-2 border-border px-3 py-3">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-3 w-full" />
                        <div className="space-y-2 pt-2">
                            {i === 0 || i === 1 ? (
                                <>
                                    <Skeleton className="h-20 rounded-md" />
                                    <Skeleton className="h-20 rounded-md" />
                                </>
                            ) : (
                                <Skeleton className="h-12 rounded-md border border-dashed" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}