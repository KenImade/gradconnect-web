import type { Metadata } from "next";
import { requireSession } from "@/lib/auth/session";
import { SettingsForm } from "@/components/settings/settings-form";
import { AccountInfo } from "@/components/settings/account-info";
import { ChangePasswordSection } from "@/components/settings/change-password-section";
import { DeleteAccountSection } from "@/components/settings/delete-account-section";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = await requireSession();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <p className="text-caption text-text-faint tracking-wider uppercase">Settings</p>
      <h1 className="font-display text-display-lg text-foreground mt-2">Your profile</h1>
      <p className="text-body-md text-text-dim mt-3 max-w-prose">
        Control how GradConnect personalises your home, the opportunities we surface, and the
        information shown on your profile.
      </p>

      <div className="mt-12">
        <SettingsForm user={user} />
      </div>

      <div className="border-border mt-16 border-t pt-16">
        <ChangePasswordSection user={user} />
      </div>

      <div className="border-border mt-16 border-t pt-16">
        <AccountInfo user={user} />
      </div>

      <div className="border-border mt-16 border-t pt-16">
        <DeleteAccountSection user={user} />
      </div>
    </div>
  );
}
