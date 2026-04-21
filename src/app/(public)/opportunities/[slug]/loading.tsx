import { Skeleton } from "@/components/ui/skeleton";

export default function OpportunityDetailLoading() {
    return (
        <div className="container mx-auto px-4 py-8 lg:py-12">
            <Skeleton className="h-4 w-64" />
            <div className="mt-6 flex items-center gap-3">
                <Skeleton className="size-14 rounded-md" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <Skeleton className="mt-6 h-10 w-2/3" />
            <div className="mt-4 flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="mt-6 h-16 rounded-lg" />
            <div className="mt-10 grid gap-10 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-36" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-48 rounded-lg" />
                    <Skeleton className="h-40 rounded-lg" />
                </div>
            </div>
        </div>
    );
}