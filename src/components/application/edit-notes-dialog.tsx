"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { updateApplication } from "@/lib/api/endpoints/applications";
import type { ApplicationTrack } from "@/lib/api/endpoints/applications.types";
import { APIError } from "@/lib/api/errors";

type EditNotesDialogProps = {
    application: ApplicationTrack;
    open: boolean;
    onClose: () => void;
    onSaved: (updated: ApplicationTrack) => void;
};

export function EditNotesDialog({
    application,
    open,
    onClose,
    onSaved,
}: EditNotesDialogProps) {
    const [notes, setNotes] = useState(application.notes);
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        setIsSaving(true);
        try {
            const updated = await updateApplication(application.id, { notes });
            // The PATCH response only has the stub — reconstruct the full entry
            // from the original + updated notes.
            onSaved({
                ...application,
                notes: updated.notes,
                updated_at: updated.updated_at,
            });
            toast.success("Notes saved");
        } catch (err) {
            if (APIError.isAPIError(err) && err.status === 403) {
                toast.error("Verify your email to update your tracker.");
            } else {
                toast.error("Couldn't save notes. Try again.");
            }
            setIsSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="font-display">
                        {application.opportunity.title}
                    </DialogTitle>
                    <DialogDescription className="italic">
                        {application.opportunity.employer.name}
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <label
                        htmlFor="tracker-notes"
                        className="block text-body-sm font-medium text-foreground"
                    >
                        Notes
                    </label>
                    <textarea
                        id="tracker-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={5}
                        placeholder="Submitted the application on X. Next step: complete the SHL test by Friday."
                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-body-md placeholder:text-text-faint focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors resize-y min-h-[120px]"
                        maxLength={2000}
                    />
                    <p className="mt-1 text-caption text-text-faint">
                        Private to you. Keep anything useful for your next step here.
                    </p>
                </div>

                <DialogFooter className="mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="rounded-md border border-border-strong bg-transparent px-4 py-2 text-body-sm text-foreground hover:bg-surface-subtle transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSaving && <Loader2 className="size-4 animate-spin" />}
                        {isSaving ? "Saving" : "Save notes"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}