import { env } from "@/lib/config";
import { fetchAPIClient } from "../client";
import type { Envelope } from "../envelope";
import type { Opportunity, OpportunityType } from "./opportunities.types";

export type CreateOpportunityInput = {
  employer_id: string;
  title: string;
  slug: string;
  type: OpportunityType;
  intake_year: number;
  description: string;
  requirements?: string | null;
  location: string;
  discipline_tags?: string[] | null;
  opens_at?: string | null;
  deadline?: string | null;
  application_url: string;
  source_url?: string | null;
};

export type OpportunityImageFormat =
  | "twitter"
  | "instagram_square"
  | "instagram_portrait"
  | "story";

export interface DownloadOpportunityImageParams {
  id: string;
  format: OpportunityImageFormat;
}

export type UpdateOpportunityInput = Partial<CreateOpportunityInput> & {
  is_active?: boolean;
};

export async function createOpportunity(input: CreateOpportunityInput): Promise<Opportunity> {
  const response = await fetchAPIClient<Envelope<Opportunity>>("/admin/opportunities", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function updateOpportunity(
  id: string,
  input: UpdateOpportunityInput,
): Promise<Opportunity> {
  const response = await fetchAPIClient<Envelope<Opportunity>>(`/admin/opportunities/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return response.data;
}

export function getOpportunityImageUrl({ id, format }: DownloadOpportunityImageParams): string {
  return `${env.NEXT_PUBLIC_API_BASE_URL}/admin/opportunities/${id}/image?format=${format}`;
}

export async function downloadOpportunityImage({
  id,
  format,
}: DownloadOpportunityImageParams): Promise<void> {
  const url = getOpportunityImageUrl({ id, format });

  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error(`Failed to generate image (${res.status})`);
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = `opportunity-${id}-${format}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(objectUrl);
}