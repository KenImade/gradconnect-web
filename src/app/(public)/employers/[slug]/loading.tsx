import { Skeleton } from "@/components/ui/skeleton";

export default function EmployerLoading() {
    return (
        <div>
            {/* Header skeleton */}
            <div className="border-b border-border bg-background">
                <div className="container mx-auto px-4 py-10 lg:py-12">
                    <div className="flex items-start gap-6">
                        <Skeleton className="hidden size-20 rounded-md sm:block" />
                        <div className="flex-1 space-y-3">
                            <Skeleton className="h-10 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-7 w-16" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs skeleton */}
            <div className="border-b border-border bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex gap-6 py-3">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                </div>
            </div>

            {/* Body skeleton */}
            <div className="container mx-auto grid gap-10 px-4 py-10 lg:grid-cols-3 lg:py-12">
                <div className="space-y-8 lg:col-span-2">
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
}