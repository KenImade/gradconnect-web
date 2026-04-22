import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { getSession } from "@/lib/auth/session";
import { BookmarksProvider } from "@/lib/hooks/use-bookmarks";
import { TrackerProvider } from "@/lib/hooks/use-tracker";
import { TooltipProvider } from "@/components/ui/tooltip";

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