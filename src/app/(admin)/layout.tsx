import "./admin.css";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { AdminNav } from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: { template: "%s · Admin · GradConnect", default: "Admin · GradConnect" },
    robots: { index: false, follow: false }, // keep admin out of search engines
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireSession();

    if (!user.permissions.includes("admin:full")) {
        // Non-admins shouldn't even know /admin exists. Send them home.
        redirect("/");
    }

    return (
        <div data-admin className="admin-root min-h-screen bg-admin-background text-admin-foreground">
            <div className="flex min-h-screen">
                <AdminNav user={user} />
                <main className="flex-1 min-w-0">{children}</main>
            </div>
        </div>
    );
}