import { cn } from "@/lib/utils";

type RatingDotsProps = {
    /** Current filled value, 0-5 */
    value: number;
    /** Size preset */
    size?: "sm" | "md";
    /** Accessibility label — required */
    label: string;
    className?: string;
};

const sizeClasses = {
    sm: "size-2",
    md: "size-2.5",
} as const;

export function RatingDots({ value, size = "md", label, className }: RatingDotsProps) {
    const filled = Math.max(0, Math.min(5, Math.round(value)));

    return (
        <div
            className={cn("inline-flex items-center gap-1", className)}
            role="img"
            aria-label={`${label}: ${filled} out of 5`}
        >
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    className={cn(
                        "rounded-full transition-colors",
                        sizeClasses[size],
                        i < filled ? "bg-primary" : "bg-bg-muted",
                    )}
                    aria-hidden="true"
                />
            ))}
        </div>
    );
}