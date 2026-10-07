import { revalidatePath } from "next/cache";
import { readJsonFile, writeJsonFile } from "@/lib/json-store";
import { EmailSettings } from "@/lib/types";

const DATA_PATH = "email-settings.json";

export function getEmailSettings(): EmailSettings {
  return readJsonFile<EmailSettings>(DATA_PATH, {
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    smtpFrom: "",
    contactEmail: "",
  });
}

export type PublicEmailSettings = Omit<EmailSettings, "smtpPass"> & { hasPassword: boolean };

/** Settings safe to send to the browser - the SMTP password never leaves the server. */
export function getPublicEmailSettings(): PublicEmailSettings {
  const { smtpPass, ...rest } = getEmailSettings();
  return { ...rest, hasPassword: Boolean(smtpPass) };
}

/**
 * The admin form submits a blank password to mean "keep the saved one",
 * since the saved password is never sent to the browser.
 */
export function withStoredPassword(settings: EmailSettings): EmailSettings {
  if (settings.smtpPass) return settings;
  return { ...settings, smtpPass: getEmailSettings().smtpPass };
}

export function updateEmailSettings(settings: EmailSettings): PublicEmailSettings {
  writeJsonFile(DATA_PATH, withStoredPassword(settings));
  revalidatePath("/admin/settings");
  return getPublicEmailSettings();
}

export function isEmailConfigured(settings: EmailSettings): boolean {
  return Boolean(settings.smtpHost && settings.smtpUser && settings.smtpPass && settings.contactEmail);
}
