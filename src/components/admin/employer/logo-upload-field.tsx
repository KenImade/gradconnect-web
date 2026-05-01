"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon, Link2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { uploadLogo } from "@/lib/api/endpoints/uploads";
import { APIError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

type Props = {
    value: string;
    onChange: (url: string) => void;
    error?: string;
    disabled?: boolean;
};

const ACCEPTED = "image/png,image/jpeg,image/webp,image/svg+xml";
const MAX_SIZE_MB = 2;

export function LogoUploadField({ value, onChange, error, disabled }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    async function handleFile(file: File) {
        setUploadError(null);

        // Pre-flight client-side checks. The backend re-validates, but
        // failing fast saves a request and gives clearer messaging.
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setUploadError(`File is too large. Max ${MAX_SIZE_MB}MB.`);
            return;
        }

        const isAccepted = ACCEPTED.split(",").some((t) => file.type === t);
        if (!isAccepted) {
            setUploadError("Use a PNG, JPEG, WebP, or SVG image.");
            return;
        }

        setUploading(true);
        try {
            const result = await uploadLogo(file);
            onChange(result.url);
            toast.success("Logo uploaded");
        } catch (err) {
            if (APIError.isAPIError(err)) {
                setUploadError(err.message || "Upload failed");
            } else {
                setUploadError("Upload failed. Check your connection and try again.");
            }
        } finally {
            setUploading(false);
            // Reset the input so the same file can be re-selected if needed
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }

    function handleRemove() {
        onChange("");
        setUploadError(null);
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <label className="block text-body-sm font-medium text-admin-foreground">
                    Logo
                    <span className="ml-2 text-caption text-admin-text-faint font-normal italic">
                        optional
                    </span>
                </label>
                <button
                    type="button"
                    onClick={() => setShowUrlInput((s) => !s)}
                    className="text-caption text-admin-text-dim hover:text-admin-foreground transition-colors inline-flex items-center gap-1"
                >
                    <Link2 className="size-3" />
                    {showUrlInput ? "Use file picker" : "Paste URL instead"}
                </button>
            </div>

            <div className="mt-1.5 flex items-start gap-3">
                {/* Preview */}
                <div
                    className={cn(
                        "flex shrink-0 size-20 items-center justify-center rounded border bg-admin-surface-subtle overflow-hidden",
                        error ? "border-destructive/50" : "border-admin-border",
                    )}
                >
                    {value ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={value}
                            alt="Logo preview"
                            className="size-full object-contain"
                            onError={(e) => {
                                // Broken URL: hide the img so the placeholder shows
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                    ) : (
                        <ImageIcon
                            className="size-6 text-admin-text-faint"
                            aria-hidden
                        />
                    )}
                </div>

                {/* Controls */}
                <div className="flex-1 min-w-0 space-y-2">
                    {showUrlInput ? (
                        <input
                            type="url"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="https://cdn.example.com/logo.png"
                            disabled={disabled}
                            className="w-full rounded border border-admin-border bg-admin-surface px-3 py-2 text-body-md focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/30 disabled:opacity-50"
                        />
                    ) : (
                        <>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={ACCEPTED}
                                onChange={handleInputChange}
                                disabled={disabled || uploading}
                                className="sr-only"
                                id="logo-file-input"
                            />
                            <div className="flex items-center gap-2">
                                <label
                                    htmlFor="logo-file-input"
                                    className={cn(
                                        "inline-flex items-center gap-1.5 rounded border border-admin-border bg-admin-surface px-3 py-1.5 text-body-sm font-medium text-admin-foreground hover:bg-admin-surface-subtle transition-colors cursor-pointer",
                                        (disabled || uploading) && "opacity-50 cursor-not-allowed",
                                    )}
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="size-3.5 animate-spin" />
                                            Uploading
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="size-3.5" />
                                            {value ? "Replace" : "Upload"}
                                        </>
                                    )}
                                </label>

                                {value && !uploading && (
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        disabled={disabled}
                                        className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-body-sm text-admin-text-dim hover:text-destructive transition-colors disabled:opacity-50"
                                    >
                                        <X className="size-3.5" />
                                        Remove
                                    </button>
                                )}
                            </div>

                            {value && (
                                <p
                                    className="text-caption text-admin-text-faint truncate"
                                    title={value}
                                >
                                    {value}
                                </p>
                            )}
                        </>
                    )}

                    <p className="text-caption text-admin-text-faint">
                        PNG, JPEG, WebP, or SVG. Max {MAX_SIZE_MB}MB.
                    </p>
                </div>
            </div>

            {(uploadError || error) && (
                <p className="mt-1.5 inline-flex items-center gap-1 text-caption text-destructive" role="alert">
                    <AlertCircle className="size-3" />
                    {uploadError || error}
                </p>
            )}
        </div>
    );
}