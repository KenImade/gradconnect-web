import { redirect } from "next/navigation";

export default function AdminIndexPage() {
    // Default to dashboard — that's the most-trafficked admin task.
    redirect("/admin/dashboard");
}