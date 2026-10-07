"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SecuritySettings() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleRevokeAll() {
    if (
      !window.confirm(
        "This will log out every active admin session, including this one. You'll need to sign in again. Continue?"
      )
    ) {
      return;
    }

    setBusy(true);
    try {
      await fetch("/api/admin/session/revoke-all", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
      <h2 className="font-bold text-heading">Security</h2>
      <p className="mt-1 text-sm text-body">
        If you think your admin session or login link may have been shared or compromised, use this
        to immediately sign out every device that&apos;s currently logged in.
      </p>
      <button
        type="button"
        onClick={handleRevokeAll}
        disabled={busy}
        className="mt-4 rounded-md border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
      >
        {busy ? "Signing out everywhere..." : "Log Out of All Sessions"}
      </button>
    </div>
  );
}
