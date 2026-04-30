import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { requireSession } from "@/lib/auth/session";
import { BookmarksProvider } from "@/lib/hooks/use-bookmarks";
import { TrackerProvider } from "@/lib/hooks/use-tracker";
import { TooltipProvider } from "@/components/ui/tooltip";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSession();

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