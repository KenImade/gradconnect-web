import { redirect } from "next/navigation";

export default function AdminIndexPage() {
    // Default to moderation — that's the most-trafficked admin task.
    redirect("/admin/moderation");
}