import { getSiteConfig } from "@/data/site";
import { getPublicEmailSettings } from "@/data/email-settings";
import SettingsForm from "@/components/admin/SettingsForm";
import EmailSettingsForm from "@/components/admin/EmailSettingsForm";
import SecuritySettings from "@/components/admin/SecuritySettings";

export default function AdminSettingsPage() {
  const siteConfig = getSiteConfig();
  const emailSettings = getPublicEmailSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading">Site Settings</h1>
      <p className="mt-1 text-sm text-body">
        Updates here apply site-wide, including the header, footer, and contact page.
      </p>

      <div className="mt-6 max-w-2xl space-y-8">
        <SettingsForm initialConfig={siteConfig} />
        <EmailSettingsForm initialSettings={emailSettings} />
        <SecuritySettings />
      </div>
    </div>
  );
}
