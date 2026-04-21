import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { requireSession } from "@/lib/auth/session";
import { BookmarksProvider } from "@/lib/hooks/use-bookmarks";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSession();

  return (
    <BookmarksProvider key={user?.id ?? "anon"} user={user}>
      <div className="flex min-h-screen flex-col">
        <PublicHeader user={user} />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>
    </BookmarksProvider>
  );
}