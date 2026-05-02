"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Play, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { triggerAdminJob } from "@/lib/api/endpoints/admin-jobs";
import { APIError } from "@/lib/api/errors";
import { ConfirmDialog } from "./confirm-dialog";
import { cn } from "@/lib/utils";
import type {
    AdminJobName,
    RecentJob,
} from "@/lib/api/endpoints/admin-analytics.types";

type Props = {
    recentJobs: RecentJob[];
};

type JobConfig = {
    name: AdminJobName;
    label: string;
    description: string;
    runDescription: string;
    confirmTone: "default" | "destructive";
};

const JOBS: JobConfig[] = [
    {
        name: "deadline_reminders",
        label: "Deadline reminders",
        description:
            "Daily digest emails for users with bookmarks closing soon.",
        runDescription:
            "Send deadline reminder emails to all users whose bookmarked opportunities close in the next 3 days. Runs automatically at 18:00 Lagos.",
        confirmTone: "destructive",
    },
    {
        name: "recalculate_ratings",
        label: "Recalculate ratings",
        description:
            "Refreshes cached employer rating averages from approved reviews.",
        runDescription:
            "Recompute average difficulty and experience ratings for every employer. Runs automatically at 03:00 Lagos.",
        confirmTone: "default",
    },
    {
        name: "cleanup_sessions",
        label: "Cleanup sessions",
        description:
            "Deletes expired session rows from the database.",
        runDescription:
            "Delete all expired session records. Runs automatically every 6 hours. Safe to run any time.",
        confirmTone: "default",
    },
];

export function OperationsPanel({ recentJobs }: Props) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [activeJob, setActiveJob] = useState<JobConfig | null>(null);
    const [running, setRunning] = useState<AdminJobName | null>(null);

    const jobsByName = Object.fromEntries(
        recentJobs.map((j) => [j.job_name, j]),
    );

    async function handleConfirm() {
        if (!activeJob) return;
        const jobName = activeJob.name;

        setRunning(jobName);
        try {
            const result = await triggerAdminJob(jobName);
            const count =
                result.enqueued ?? result.recalculated ?? result.deleted ?? 0;
            toast.success(`${activeJob.label} complete`, {
                description: `${count.toLocaleString()} item${count === 1 ? "" : "s"} processed`,
            });
            setActiveJob(null);
            // Trigger a server-side refresh so recent_jobs updates
            startTransition(() => router.refresh());
        } catch (err) {
            const message = APIError.isAPIError(err)
                ? err.status === 409
                    ? "This job has already run today."
                    : err.message
                : "Job failed. Check server logs.";
            toast.error(`${activeJob.label} failed`, { description: message });
        } finally {
            setRunning(null);
        }
    }

    return (
        <>
            <div className="rounded-lg border border-admin-border bg-admin-surface">
                <header className="flex items-center justify-between border-b border-admin-border px-5 py-3">
                    <div>
                        <h3 className="font-display text-heading-sm text-admin-foreground">
                            Background jobs
                        </h3>
                        <p className="mt-0.5 text-caption text-admin-text-faint">
                            Last run, status, and manual triggers
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => startTransition(() => router.refresh())}
                        disabled={pending}
                        className="inline-flex items-center gap-1.5 rounded border border-admin-border bg-admin-surface px-2.5 py-1 text-caption font-medium text-admin-text-dim hover:bg-admin-surface-subtle transition-colors disabled:opacity-50"
                    >
                        <RefreshCw
                            className={cn(
                                "size-3",
                                pending && "animate-spin",
                            )}
                            aria-hidden
                        />
                        Refresh
                    </button>
                </header>

                <ul className="divide-y divide-admin-border">
                    {JOBS.map((job) => {
                        const lastRun = jobsByName[job.name];
                        const isRunning = running === job.name;
                        return (
                            <li
                                key={job.name}
                                className="px-5 py-4 flex items-center justify-between gap-4"
                            >
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-body-md font-medium text-admin-foreground">
                                        {job.label}
                                    </h4>
                                    <p className="mt-0.5 text-caption text-admin-text-dim">
                                        {job.description}
                                    </p>
                                    {lastRun ? (
                                        <p className="mt-1.5 text-caption text-admin-text-faint">
                                            Last run{" "}
                                            {formatRelative(lastRun.last_run_at)}
                                            {lastRun.last_run_enqueued > 0 && (
                                                <>
                                                    {" · "}
                                                    {lastRun.last_run_enqueued}{" "}
                                                    items
                                                </>
                                            )}
                                            {lastRun.last_run_status === "running" && (
                                                <>
                                                    {" · "}
                                                    <span className="text-admin-foreground">
                                                        in progress
                                                    </span>
                                                </>
                                            )}
                                        </p>
                                    ) : (
                                        <p className="mt-1.5 text-caption text-admin-text-faint italic">
                                            Never run
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setActiveJob(job)}
                                    disabled={isRunning}
                                    className="inline-flex shrink-0 items-center gap-1.5 rounded border border-admin-border bg-admin-surface px-3 py-1.5 text-body-sm font-medium text-admin-foreground hover:bg-admin-surface-subtle transition-colors disabled:opacity-50"
                                >
                                    <Play className="size-3.5" />
                                    {isRunning ? "Running…" : "Run now"}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <ConfirmDialog
                open={Boolean(activeJob)}
                title={activeJob ? `Run ${activeJob.label}?` : ""}
                description={activeJob?.runDescription ?? ""}
                confirmLabel="Run now"
                confirmTone={activeJob?.confirmTone}
                onConfirm={handleConfirm}
                onCancel={() => setActiveJob(null)}
                loading={running !== null}
            />
        </>
    );
}

function formatRelative(iso: string): string {
    const then = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - then.getTime();
    const diffMin = Math.round(diffMs / 60000);
    const diffHr = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHr / 24);

    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
    return then.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}