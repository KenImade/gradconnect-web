import Image from "next/image";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils/text";

type EmployerLogoProps = {
    name: string;
    logoUrl: string | null;
    size?: "sm" | "md" | "lg";
    className?: string;
};

const sizeClasses = {
    sm: "size-10 text-caption",
    md: "size-14 text-body-sm",
    lg: "size-20 text-body-lg",
} as const;

const pixelSize = {
    sm: 40,
    md: 56,
    lg: 80,
} as const;

export function EmployerLogo({
    name,
    logoUrl,
    size = "md",
    className,
}: EmployerLogoProps) {
    if (logoUrl) {
        return (
            <div
                className={cn(
                    "relative overflow-hidden rounded-md bg-surface-subtle border border-border shrink-0",
                    sizeClasses[size],
                    className,
                )}
            >
                <Image
                    src={logoUrl}
                    alt={`${name} logo`}
                    width={pixelSize[size]}
                    height={pixelSize[size]}
                    className="object-contain p-1"
                />
            </div>
        );
    }

    return (
        <div
            className={cn(
                "flex items-center justify-center rounded-md bg-surface-subtle border border-border shrink-0 font-display font-semibold text-text-dim",
                sizeClasses[size],
                className,
            )}
            aria-label={`${name} logo placeholder`}
        >
            {getInitials(name)}
        </div>
    );
}