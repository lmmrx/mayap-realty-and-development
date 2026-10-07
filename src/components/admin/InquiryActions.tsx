"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InquiryActions({ id, read }: { id: string; read: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function markRead() {
    setBusy(true);
    try {
      await fetch(`/api/admin/inquiries/${id}`, { method: "PUT" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this inquiry? This cannot be undone.")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      {!read && (
        <button
          type="button"
          onClick={markRead}
          disabled={busy}
          className="text-sm font-medium text-brand hover:text-brand-dark disabled:opacity-60"
        >
          Mark Read
        </button>
      )}
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
      >
        Delete
      </button>
    </div>
  );
}
