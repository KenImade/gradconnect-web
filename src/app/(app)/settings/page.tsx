import type { Metadata } from "next";
import { requireSession } from "@/lib/auth/session";
import { SettingsForm } from "@/components/settings/settings-form";
import { AccountInfo } from "@/components/settings/account-info";

export const metadata: Metadata = {
    title: "Settings",
};

export default async function SettingsPage() {
    const user = await requireSession();

    return (
        <div className="container mx-auto max-w-3xl px-4 py-10 lg:py-14">
            <p className="text-caption uppercase tracking-wider text-text-faint">
                Settings
            </p>
            <h1 className="mt-2 font-display text-display-lg text-foreground">
                Your profile
            </h1>
            <p className="mt-3 text-body-md text-text-dim max-w-prose">
                Control how GradConnect personalises your home, the opportunities we
                surface, and the information shown on your profile.
            </p>

            <div className="mt-12">
                <SettingsForm user={user} />
            </div>

            <div className="mt-16">
                <AccountInfo user={user} />
            </div>
        </div>
    );
}