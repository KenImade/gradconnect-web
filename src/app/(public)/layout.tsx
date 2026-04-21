import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { getSession } from "@/lib/auth/session";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader user={user} />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}