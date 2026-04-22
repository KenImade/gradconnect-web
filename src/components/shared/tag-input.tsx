"use client";

import { useState, useRef } from "react";
import type { KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type TagInputProps = {
    value: string[];
    onChange: (next: string[]) => void;
    suggestions?: string[];
    placeholder?: string;
    maxTags?: number;
    id?: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
};

export function TagInput({
    value,
    onChange,
    suggestions = [],
    placeholder = "Type and press Enter",
    maxTags = 10,
    id,
    ...aria
}: TagInputProps) {
    const [draft, setDraft] = useState("");
    const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredSuggestions =
        draft.length > 0
            ? suggestions.filter(
                (s) =>
                    !value.includes(s) &&
                    s.toLowerCase().includes(draft.toLowerCase()),
            )
            : [];

    function addTag(tag: string) {
        const trimmed = tag.trim();
        if (!trimmed) return;
        if (value.includes(trimmed)) return;
        if (value.length >= maxTags) return;
        onChange([...value, trimmed]);
        setDraft("");
        setFocusedSuggestion(-1);
    }

    function removeTag(tag: string) {
        onChange(value.filter((t) => t !== tag));
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            if (focusedSuggestion >= 0 && filteredSuggestions[focusedSuggestion]) {
                addTag(filteredSuggestions[focusedSuggestion]);
            } else {
                addTag(draft);
            }
        } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
            // Remove last tag on backspace when input is empty.
            onChange(value.slice(0, -1));
        } else if (e.key === "ArrowDown" && filteredSuggestions.length > 0) {
            e.preventDefault();
            setFocusedSuggestion((prev) =>
                Math.min(prev + 1, filteredSuggestions.length - 1),
            );
        } else if (e.key === "ArrowUp" && filteredSuggestions.length > 0) {
            e.preventDefault();
            setFocusedSuggestion((prev) => Math.max(prev - 1, -1));
        } else if (e.key === "Escape") {
            setFocusedSuggestion(-1);
            setDraft("");
        }
    }

    return (
        <div className="relative">
            <div
                className={cn(
                    "flex flex-wrap gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 min-h-11",
                    "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 transition-colors",
                    aria["aria-invalid"] && "border-destructive",
                )}
                onClick={() => inputRef.current?.focus()}
            >
                {value.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-md bg-surface-subtle px-2 py-1 text-caption text-foreground"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeTag(tag);
                            }}
                            className="text-text-faint hover:text-foreground transition-colors"
                            aria-label={`Remove ${tag}`}
                        >
                            <X className="size-3" />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    id={id}
                    type="text"
                    value={draft}
                    onChange={(e) => {
                        setDraft(e.target.value);
                        setFocusedSuggestion(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={value.length === 0 ? placeholder : ""}
                    disabled={value.length >= maxTags}
                    className="flex-1 min-w-30 bg-transparent px-1 py-0.5 text-body-md outline-none placeholder:text-text-faint disabled:cursor-not-allowed"
                    aria-invalid={aria["aria-invalid"]}
                    aria-describedby={aria["aria-describedby"]}
                    autoComplete="off"
                />
            </div>

            {filteredSuggestions.length > 0 && (
                <ul
                    className="absolute left-0 right-0 top-full mt-1 z-20 max-h-48 overflow-auto rounded-md border border-border bg-background shadow-md"
                    role="listbox"
                >
                    {filteredSuggestions.slice(0, 8).map((suggestion, idx) => (
                        <li key={suggestion} role="option" aria-selected={idx === focusedSuggestion}>
                            <button
                                type="button"
                                onClick={() => addTag(suggestion)}
                                onMouseEnter={() => setFocusedSuggestion(idx)}
                                className={cn(
                                    "block w-full px-3 py-2 text-left text-body-sm transition-colors",
                                    idx === focusedSuggestion
                                        ? "bg-surface-subtle text-foreground"
                                        : "text-text-dim hover:bg-surface-subtle hover:text-foreground",
                                )}
                            >
                                {suggestion}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {value.length >= maxTags && (
                <p className="mt-1.5 text-caption text-text-faint italic">
                    Maximum of {maxTags} reached.
                </p>
            )}
        </div>
    );
}