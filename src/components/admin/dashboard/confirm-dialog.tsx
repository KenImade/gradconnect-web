"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

type Props = {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    confirmTone?: "default" | "destructive";
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
};

export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel,
    confirmTone = "default",
    onConfirm,
    onCancel,
    loading,
}: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    // Close on Esc, but only if not loading (don't let user dismiss
    // while the action is in flight).
    function handleCancelEvent(e: React.SyntheticEvent<HTMLDialogElement>) {
        e.preventDefault();
        if (!loading) onCancel();
    }

    return (
        <dialog
            ref={dialogRef}
            onCancel={handleCancelEvent}
            className="rounded-lg bg-admin-surface p-0 backdrop:bg-black/40 backdrop:backdrop-blur-sm max-w-md w-full"
        >
            <div className="border-b border-admin-border px-5 py-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    {confirmTone === "destructive" && (
                        <AlertTriangle
                            className="size-5 text-destructive shrink-0 mt-0.5"
                            aria-hidden
                        />
                    )}
                    <div>
                        <h2 className="font-display text-heading-sm text-admin-foreground">
                            {title}
                        </h2>
                        <p className="mt-1 text-body-sm text-admin-text-dim">
                            {description}
                        </p>
                    </div>
                </div>
                {!loading && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-admin-text-faint hover:text-admin-foreground transition-colors"
                        aria-label="Close"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>

            <div className="flex justify-end gap-2 px-5 py-3 bg-admin-surface-subtle">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded border border-admin-border bg-admin-surface px-3 py-1.5 text-body-sm font-medium text-admin-foreground hover:bg-admin-surface-subtle transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={loading}
                    className={
                        "rounded px-4 py-1.5 text-body-sm font-medium text-primary-foreground transition-colors disabled:opacity-50 " +
                        (confirmTone === "destructive"
                            ? "bg-destructive hover:bg-destructive/90"
                            : "bg-primary hover:bg-primary/90")
                    }
                >
                    {loading ? "Working…" : confirmLabel}
                </button>
            </div>
        </dialog>
    );
}