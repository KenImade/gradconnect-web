"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, ListPlus, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTracker } from "@/lib/hooks/use-tracker";
import { APIError } from "@/lib/api/errors";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type TrackButtonProps = {
    opportunityId: string;
    opportunityTitle: string;
    variant?: "icon" | "inline";
    className?: string;
};

export function TrackButton({
    opportunityId,
    opportunityTitle,
    variant = "icon",
    className,
}: TrackButtonProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isTracked, toggle, isVerified } = useTracker();
    const [isBusy, setIsBusy] = useState(false);

    const tracked = isTracked(opportunityId);

    async function handleClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.info("Sign in to track your applications.", {
                description: "Watch your pipeline from 'Interested' through to 'Offer.'",
                action: {
                    label: "Sign in",
                    onClick: () =>
                        router.push(`/login?redirect=${encodeURIComponent(pathname)}`),
                },
            });
            return;
        }

        if (!isVerified) {
            toast.warning("Verify your email to track applications.", {
                description: "Check your dashboard for the verification link.",
                action: {
                    label: "Go to dashboard",
                    onClick: () => router.push("/dashboard"),
                },
            });
            return;
        }

        if (isBusy) return;
        setIsBusy(true);

        try {
            const nowTracked = await toggle(opportunityId);
            if (nowTracked) {
                toast.success(`Added "${truncate(opportunityTitle, 50)}" to tracker`, {
                    description: "Drag it through columns as your application progresses.",
                    action: {
                        label: "Open tracker",
                        onClick: () => router.push("/tracker"),
                    },
                });
            } else {
                toast.success("Removed from tracker");
            }
        } catch (err) {
            if (APIError.isAPIError(err) && err.status === 403) {
                toast.error("Verify your email to track applications.");
            } else {
                toast.error("Couldn't update tracker. Try again.");
            }
        } finally {
            setIsBusy(false);
        }
    }

    const label = tracked ? "Remove from tracker" : "Add to tracker";
    const Icon = tracked ? ListChecks : ListPlus;

    if (variant === "icon") {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={handleClick}
                        disabled={isBusy}
                        aria-label={label}
                        aria-pressed={tracked}
                        className={cn(
                            "inline-flex items-center justify-center size-9 rounded-md transition-colors",
                            "hover:bg-surface-subtle",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                            "disabled:opacity-60 disabled:cursor-not-allowed",
                            tracked && "text-primary",
                            className,
                        )}
                    >
                        {isBusy ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Icon className="size-4" />
                        )}
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={4}>
                    {label}
                </TooltipContent>
            </Tooltip>
        );
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isBusy}
            aria-pressed={tracked}
            className={cn(
                "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-body-sm font-medium transition-colors",
                tracked
                    ? "border-primary bg-primary/5 text-primary hover:bg-primary/10"
                    : "border-border-strong bg-transparent text-foreground hover:bg-surface-subtle",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                className,
            )}
        >
            {isBusy ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                <Icon className="size-4" />
            )}
            {tracked ? "Tracking" : "Track"}
        </button>
    );
}

function truncate(s: string, max: number): string {
    if (s.length <= max) return s;
    return s.slice(0, max - 1).trimEnd() + "…";
}