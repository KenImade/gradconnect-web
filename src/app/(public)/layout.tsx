import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { getSession } from "@/lib/auth/session";
import { BookmarksProvider } from "@/lib/hooks/use-bookmarks";
import { TrackerProvider } from "@/lib/hooks/use-tracker";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { SITE, absoluteUrl } from "@/lib/seo/config";

export const metadata: Metadata = {
  title: {
    absolute: "GradConnect — Nigeria's Graduate Career Platform",
  },
  description: SITE.description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: "GradConnect — Nigeria's Graduate Career Platform",
    description: SITE.description,
    siteName: SITE.name,
    locale: SITE.locale,
    images: [
      {
        url: absoluteUrl("/og/default.png"),
        width: 1200,
        height: 630,
        alt: "GradConnect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GradConnect — Nigeria's Graduate Career Platform",
    description: SITE.description,
    site: SITE.twitter,
    images: [absoluteUrl("/og/default.png")],
  },
};

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  return (
    <TooltipProvider delayDuration={200}>
      <BookmarksProvider key={`bm-${user?.id ?? "anon"}`} user={user}>
        <TrackerProvider key={`tr-${user?.id ?? "anon"}`} user={user}>
          <div className="flex min-h-screen flex-col">
            <PublicHeader user={user} />
            <main className="flex-1">{children}</main>
            <PublicFooter />
          </div>
        </TrackerProvider>
      </BookmarksProvider>
    </TooltipProvider>
  );
}