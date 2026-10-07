"use client";

import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { isValidImageUrl } from "@/lib/image";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
}

export default function ImageUploader({ images, onChange, label = "Photos" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Upload failed");
        }
        const data = await res.json();
        uploaded.push(data.url);
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function addUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!isValidImageUrl(trimmed)) {
      setError("Enter a full image URL starting with https://");
      return;
    }
    setError(null);
    onChange([...images, trimmed]);
    setUrlInput("");
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-heading">{label}</label>

      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((src, index) => (
            <div key={`${src}-${index}`} className="group relative aspect-square overflow-hidden rounded-md border border-black/10">
              <Image src={src} alt={`Photo ${index + 1}`} fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove photo"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-black/10 bg-cream px-4 py-2 text-sm font-semibold text-heading hover:bg-black/5">
          {uploading ? "Uploading..." : "Upload Image(s)"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            disabled={uploading}
            className="hidden"
          />
        </label>

        <div className="flex flex-1 gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Or paste an image URL"
            className="w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
          <button
            type="button"
            onClick={addUrl}
            className="shrink-0 rounded-md border border-black/10 px-3 py-2 text-sm font-semibold text-heading hover:bg-cream"
          >
            Add
          </button>
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
