import { Skeleton } from "@/components/ui/skeleton";

export default function ProcessLoading() {
    return (
        <div className="space-y-10">
            <div className="space-y-3">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Skeleton className="h-20 rounded-md" />
                    <Skeleton className="h-20 rounded-md" />
                    <Skeleton className="h-20 rounded-md" />
                </div>
            </div>
            <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-4 pb-8">
                        <Skeleton className="size-10 rounded-full shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-5 w-2/3" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}