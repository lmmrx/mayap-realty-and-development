"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteButtonProps {
  endpoint: string;
  confirmMessage: string;
  onDeleted?: () => void;
  label?: string;
}

export default function DeleteButton({
  endpoint,
  confirmMessage,
  onDeleted,
  label = "Delete",
}: DeleteButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleClick() {
    if (!window.confirm(confirmMessage)) return;

    setDeleting(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      if (onDeleted) {
        onDeleted();
      } else {
        router.refresh();
      }
    } catch {
      window.alert("Something went wrong. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={deleting}
      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
    >
      {deleting ? "Deleting..." : label}
    </button>
  );
}
