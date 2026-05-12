"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { OPPORTUNITY_TYPE_LABELS } from "@/lib/utils/opportunity";
import { updateOpportunity } from "@/lib/api/endpoints/admin-opportunities";
import { APIError } from "@/lib/api/errors";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Opportunity } from "@/lib/api/endpoints/opportunities.types";
import {OpportunityImageDialog} from "@/components/admin/opportunity/opportunity-image-dialog";

const STATUS_TONE: Record<string, string> = {
    open: "border-success/40 bg-success/5 text-success",
    upcoming: "border-warning/40 bg-warning/5 text-warning",
    closed: "border-admin-border bg-admin-surface-subtle text-admin-text-faint",
    withdrawn: "border-destructive/40 bg-destructive/5 text-destructive",
};

function formatDate(iso: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function AdminOpportunityTable({
    opportunities,
}: {
    opportunities: Opportunity[];
}) {
    const router = useRouter();
  const [actionTarget, setActionTarget] = useState<{
    opportunity: Opportunity;
    action: "withdraw" | "reactivate";
  } | null>(null);
  const [imageDialogOpp, setImageDialogOpp] = useState<Opportunity | null>(null);
  const [actionInFlight, setActionInFlight] = useState(false);

    async function confirmAction() {
        if (!actionTarget) return;
        setActionInFlight(true);

        try {
            await updateOpportunity(actionTarget.opportunity.id, {
                is_active: actionTarget.action === "reactivate",
            });
            toast.success(
                actionTarget.action === "withdraw"
                    ? `Withdrew ${actionTarget.opportunity.title}`
                    : `Reactivated ${actionTarget.opportunity.title}`,
            );
            setActionTarget(null);
            router.refresh();
        } catch (err) {
            const message =
                APIError.isAPIError(err) && err.message
                    ? err.message
                    : "Couldn't update. Try again.";
            toast.error(message);
        } finally {
            setActionInFlight(false);
        }
    }

    if (opportunities.length === 0) {
        return (
            <div className="border-t border-admin-border py-16 text-center">
                <p className="text-admin-text-dim">No opportunities match your filters.</p>
            </div>
        );
    }

    return (
      <>
        <div className="border-admin-border bg-admin-surface overflow-x-auto border">
          <table className="text-body-sm w-full">
            <thead className="border-admin-border bg-admin-surface-subtle border-b">
              <tr>
                <th className="text-caption text-admin-text-faint px-4 py-2 text-left font-medium tracking-wide uppercase">
                  Opportunity
                </th>
                <th className="text-caption text-admin-text-faint px-4 py-2 text-left font-medium tracking-wide uppercase">
                  Type
                </th>
                <th className="text-caption text-admin-text-faint px-4 py-2 text-left font-medium tracking-wide uppercase">
                  Status
                </th>
                <th className="text-caption text-admin-text-faint px-4 py-2 text-left font-medium tracking-wide uppercase">
                  Deadline
                </th>
                <th className="text-caption text-admin-text-faint px-4 py-2 text-right font-medium tracking-wide uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp) => {
                const isWithdrawn = !opp.is_active;
                return (
                  <tr
                    key={opp.id}
                    className="border-admin-border hover:bg-admin-surface-subtle/50 border-b transition-colors last:border-b-0"
                  >
                    <td className="px-4 py-3">
                      <p className="text-admin-foreground font-medium">{opp.title}</p>
                      <p className="text-caption text-admin-text-dim italic">{opp.employer.name}</p>
                    </td>
                    <td className="text-admin-text-dim px-4 py-3">
                      {OPPORTUNITY_TYPE_LABELS[opp.type]}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-caption inline-flex items-center rounded border px-1.5 py-0.5",
                          STATUS_TONE[opp.status] ?? STATUS_TONE.closed,
                        )}
                      >
                        {opp.status}
                      </span>
                    </td>
                    <td className="text-admin-text-dim px-4 py-3 tabular-nums">
                      {formatDate(opp.deadline)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-3">
                        <a
                          href={`/opportunities/${opp.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-admin-text-dim hover:text-admin-foreground inline-flex items-center gap-1 transition-colors"
                        >
                          View
                          <ExternalLink className="size-3" />
                        </a>
                        <Link
                          href={`/admin/opportunities/${opp.id}/edit`}
                          className="text-primary hover:text-primary-hover font-medium transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setImageDialogOpp(opp)}
                          className="text-admin-text-dim hover:text-admin-foreground font-medium transition-colors"
                        >
                          Image
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setActionTarget({
                              opportunity: opp,
                              action: isWithdrawn ? "reactivate" : "withdraw",
                            })
                          }
                          className={cn(
                            "font-medium transition-colors",
                            isWithdrawn
                              ? "text-success hover:text-success/80"
                              : "text-destructive hover:text-destructive/80",
                          )}
                        >
                          {isWithdrawn ? "Reactivate" : "Withdraw"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <AlertDialog
          open={Boolean(actionTarget)}
          onOpenChange={(open) => !open && !actionInFlight && setActionTarget(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display">
                {actionTarget?.action === "withdraw"
                  ? "Withdraw this listing?"
                  : "Reactivate this listing?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionTarget?.action === "withdraw"
                  ? `"${actionTarget.opportunity.title}" will be hidden from the public site immediately. Existing bookmarks and tracker entries are preserved but flagged as inactive.`
                  : `"${actionTarget?.opportunity.title}" will reappear on the public site (subject to its dates and deadline).`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={actionInFlight}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={actionInFlight}
                onClick={confirmAction}
                className={cn(
                  actionTarget?.action === "withdraw"
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : "",
                )}
              >
                {actionInFlight ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : actionTarget?.action === "withdraw" ? (
                  "Withdraw"
                ) : (
                  "Reactivate"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <OpportunityImageDialog
          opportunity={imageDialogOpp}
          open={imageDialogOpp !== null}
          onOpenChange={(open) => !open && setImageDialogOpp(null)}
        />
      </>
    );
}