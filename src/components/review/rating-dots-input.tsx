"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
    label: string;
    description?: string;
    value: number;
    onChange: (value: number) => void;
    error?: string;
};

export function RatingDotsInput({
    label,
    description,
    value,
    onChange,
    error,
}: Props) {
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const displayValue = hoverValue ?? value;

    return (
        <div>
            <div className="flex items-baseline justify-between">
                <span className="block text-body-sm font-medium text-foreground">
                    {label}
                </span>
                {value > 0 && (
                    <span className="text-caption text-text-faint tabular-nums">
                        {value} of 5
                    </span>
                )}
            </div>
            {description && (
                <p className="mt-0.5 text-caption text-text-faint italic">
                    {description}
                </p>
            )}

            <div
                className="mt-3 inline-flex items-center gap-2"
                role="radiogroup"
                aria-label={label}
            >
                {[1, 2, 3, 4, 5].map((n) => {
                    const filled = n <= displayValue;
                    return (
                        <button
                            key={n}
                            type="button"
                            role="radio"
                            aria-checked={value === n}
                            aria-label={`${n} of 5`}
                            onMouseEnter={() => setHoverValue(n)}
                            onMouseLeave={() => setHoverValue(null)}
                            onClick={() => onChange(n)}
                            className={cn(
                                "size-8 rounded-full border transition-all",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                filled
                                    ? "border-primary bg-primary"
                                    : "border-border bg-background hover:border-primary/50",
                            )}
                        />
                    );
                })}
            </div>

            {error && (
                <p className="mt-2 text-caption text-destructive" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}