"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { NewsPost } from "@/lib/types";
import ImageUploader from "@/components/admin/ImageUploader";
import DeleteButton from "@/components/admin/DeleteButton";

interface NewsFormProps {
  initialPost?: NewsPost;
}

export default function NewsForm({ initialPost }: NewsFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialPost);

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [category, setCategory] = useState(initialPost?.category ?? "");
  const [date, setDate] = useState(initialPost?.date ?? new Date().toISOString().slice(0, 10));
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [content, setContent] = useState(initialPost?.content.join("\n\n") ?? "");
  const [images, setImages] = useState<string[]>(initialPost?.image ? [initialPost.image] : []);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      slug: slug.trim() || undefined,
      title: title.trim(),
      category: category.trim(),
      date,
      excerpt: excerpt.trim(),
      image: images[0] ?? "",
      content: content
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
    };

    try {
      const endpoint = isEdit ? `/api/admin/news/${initialPost!.slug}` : "/api/admin/news";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save post");
      }

      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Title</label>
            <input
              required
              value={title}
              name="title" onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">
              Slug <span className="font-normal text-body">(leave blank to auto-generate)</span>
            </label>
            <input
              value={slug}
              name="slug" onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Category</label>
            <input
              required
              value={category}
              name="category" onChange={(e) => setCategory(e.target.value)}
              placeholder="Market Trends, Buyer's Guide, ..."
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Date</label>
            <input
              required
              type="date"
              value={date}
              name="date" onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-heading">Excerpt</label>
          <textarea
            required
            rows={2}
            value={excerpt}
            name="excerpt" onChange={(e) => setExcerpt(e.target.value)}
            className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-heading">
            Article Content <span className="font-normal text-body">(separate paragraphs with a blank line)</span>
          </label>
          <textarea
            rows={8}
            value={content}
            name="content" onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <ImageUploader
          images={images}
          onChange={(next) => setImages(next.slice(-1))}
          label="Cover Photo"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark transition-colors disabled:opacity-60"
          >
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Publish Post"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/news")}
            className="rounded-md border border-black/10 px-6 py-3 text-sm font-semibold text-heading hover:bg-cream"
          >
            Cancel
          </button>
        </div>

        {isEdit && initialPost && (
          <DeleteButton
            endpoint={`/api/admin/news/${initialPost.slug}`}
            confirmMessage={`Delete "${initialPost.title}"? This cannot be undone.`}
            onDeleted={() => router.push("/admin/news")}
            label="Delete Post"
          />
        )}
      </div>
    </form>
  );
}
