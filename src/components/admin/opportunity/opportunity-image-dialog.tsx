"use client";

import { useEffect, useState } from "react";
import { Download, ImageOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  downloadOpportunityImage,
  getOpportunityImageUrl,
  type OpportunityImageFormat,
} from "@/lib/api/endpoints/admin-opportunities";
import { APIError } from "@/lib/api/errors";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Opportunity } from "@/lib/api/endpoints/opportunities.types";

type FormatOption = {
  value: OpportunityImageFormat;
  label: string;
  dimensions: string;
  aspectClass: string;
};

const FORMATS: FormatOption[] = [
  {
    value: "twitter",
    label: "Twitter / LinkedIn",
    dimensions: "1200 × 630",
    aspectClass: "aspect-[1200/630]",
  },
  {
    value: "instagram_square",
    label: "Instagram square",
    dimensions: "1080 × 1080",
    aspectClass: "aspect-square",
  },
  {
    value: "instagram_portrait",
    label: "Instagram portrait",
    dimensions: "1080 × 1350",
    aspectClass: "aspect-[4/5]",
  },
  {
    value: "story",
    label: "Story / Reels",
    dimensions: "1080 × 1920",
    aspectClass: "aspect-[9/16]",
  },
];

function usePreviewBlob(opportunityId: string, format: OpportunityImageFormat, enabled: boolean) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let objectUrlToRevoke: string | null = null;

    setIsLoading(true);
    setHasError(false);
    setPreviewUrl(null);

    const url = getOpportunityImageUrl({ id: opportunityId, format });

    fetch(url, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        const objectUrl = URL.createObjectURL(blob);
        objectUrlToRevoke = objectUrl;
        setPreviewUrl(objectUrl);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setHasError(true);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
      if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
    };
  }, [opportunityId, format, enabled]);

  return { previewUrl, isLoading, hasError };
}

export function OpportunityImageDialog({
  opportunity,
  open,
  onOpenChange,
}: {
  opportunity: Opportunity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [format, setFormat] = useState<OpportunityImageFormat>("twitter");
  const [isDownloading, setIsDownloading] = useState(false);

  const selected = FORMATS.find((f) => f.value === format)!;
  const { previewUrl, isLoading, hasError } = usePreviewBlob(
    opportunity?.id ?? "",
    format,
    open && opportunity !== null,
  );

  async function handleDownload() {
    if (!opportunity) return;
    setIsDownloading(true);
    try {
      await downloadOpportunityImage({ id: opportunity.id, format });
      toast.success("Image downloaded");
    } catch (err) {
      const message =
        APIError.isAPIError(err) && err.message ? err.message : "Couldn't download. Try again.";
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display">Social media image</DialogTitle>
          <DialogDescription>
            {opportunity ? `Generate a shareable card for "${opportunity.title}".` : null}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[200px_1fr]">
          {/* Format picker */}
          <div className="space-y-2">
            <p className="text-caption text-admin-text-faint font-medium tracking-wide uppercase">
              Format
            </p>
            <div className="space-y-1">
              {FORMATS.map((f) => {
                const isSelected = format === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFormat(f.value)}
                    className={cn(
                      "w-full rounded border px-3 py-2 text-left transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5 text-admin-foreground"
                        : "border-admin-border text-admin-text-dim hover:border-admin-foreground/30 hover:text-admin-foreground",
                    )}
                  >
                    <div className="text-body-sm font-medium">{f.label}</div>
                    <div className="text-caption text-admin-text-faint tabular-nums">
                      {f.dimensions}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <p className="text-caption text-admin-text-faint font-medium tracking-wide uppercase">
              Preview
            </p>
            <div
              className={cn(
                "border-admin-border bg-admin-surface-subtle relative w-full overflow-hidden border",
                selected.aspectClass,
              )}
            >
              {isLoading && <Skeleton className="absolute inset-0 h-full w-full" />}
              {hasError && (
                <div className="text-admin-text-dim absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <ImageOff className="size-6" />
                  <p className="text-body-sm">Couldn't load preview</p>
                </div>
              )}
              {!isLoading && !hasError && previewUrl && (
                <img
                  src={previewUrl}
                  alt={`${selected.label} preview`}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isDownloading}
            className="text-admin-text-dim hover:text-admin-foreground font-medium transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading || isLoading || hasError}
            className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex items-center gap-2 rounded px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDownloading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Download PNG
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
