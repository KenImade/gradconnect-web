"use client";

import { useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ReviewFormInput } from "@/lib/validation/review";

/**
 * Keeps the review form in sync with localStorage so a user can
 * navigate away and resume. Drafts are keyed by employer_id to
 * support multiple in-flight reviews across different employers.
 *
 * Usage:
 *   const form = useForm<ReviewFormInput>(...);
 *   const { clearDraft, hasDraft, restoreDraft } = useReviewDraft({ form, employerId });
 */

const DRAFT_PREFIX = "gc:review-draft:";

type Params = {
    form: UseFormReturn<ReviewFormInput>;
    employerId: string | null;
};

function draftKey(employerId: string): string {
    return `${DRAFT_PREFIX}${employerId}`;
}

export function useReviewDraft({ form, employerId }: Params) {
    const hydratedRef = useRef(false);

    // Hydrate once on mount from localStorage.
    useEffect(() => {
        if (!employerId || hydratedRef.current) return;
        hydratedRef.current = true;

        try {
            const raw = localStorage.getItem(draftKey(employerId));
            if (!raw) return;
            const parsed = JSON.parse(raw) as Partial<ReviewFormInput>;
            form.reset({
                ...form.getValues(),
                ...parsed,
                // employer_id always wins from the page's URL, not the draft.
                employer_id: employerId,
            });
        } catch {
            // Corrupt draft — ignore and start fresh.
        }
    }, [employerId, form]);

    // Autosave debounced on every change.
    useEffect(() => {
        if (!employerId) return;

        const subscription = form.watch((value) => {
            try {
                localStorage.setItem(draftKey(employerId), JSON.stringify(value));
            } catch {
                // Full localStorage or disabled — silent failure is fine.
            }
        });

        return () => subscription.unsubscribe();
    }, [employerId, form]);

    function clearDraft() {
        if (!employerId) return;
        try {
            localStorage.removeItem(draftKey(employerId));
        } catch {
            // ignore
        }
    }

    function hasDraft(): boolean {
        if (!employerId) return false;
        try {
            return localStorage.getItem(draftKey(employerId)) !== null;
        } catch {
            return false;
        }
    }

    function saveDraftNow() {
        if (!employerId) return;
        try {
            localStorage.setItem(
                draftKey(employerId),
                JSON.stringify(form.getValues()),
            );
        } catch {
            // ignore
        }
    }

    return { clearDraft, hasDraft, saveDraftNow };
}