"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Listing } from "@/lib/types";
import ImageUploader from "@/components/admin/ImageUploader";
import DeleteButton from "@/components/admin/DeleteButton";

interface ListingFormProps {
  initialListing?: Listing;
}

const typeOptions = [
  { value: "house-and-lot", label: "House and Lot" },
  { value: "condo", label: "Condominium" },
  { value: "other", label: "Other" },
];

const statusOptions = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "sold-out", label: "Sold Out" },
];

export default function ListingForm({ initialListing }: ListingFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialListing);

  const [title, setTitle] = useState(initialListing?.title ?? "");
  const [slug, setSlug] = useState(initialListing?.slug ?? "");
  const [type, setType] = useState(initialListing?.type ?? "house-and-lot");
  const [location, setLocation] = useState(initialListing?.location ?? "");
  const [city, setCity] = useState(initialListing?.city ?? "");
  const [developer, setDeveloper] = useState(initialListing?.developer ?? "");
  const [priceFrom, setPriceFrom] = useState(String(initialListing?.priceFrom ?? ""));
  const [bedrooms, setBedrooms] = useState(String(initialListing?.bedrooms ?? "0"));
  const [bathrooms, setBathrooms] = useState(String(initialListing?.bathrooms ?? "0"));
  const [floorArea, setFloorArea] = useState(String(initialListing?.floorArea ?? "0"));
  const [lotArea, setLotArea] = useState(
    initialListing?.lotArea !== null && initialListing?.lotArea !== undefined
      ? String(initialListing.lotArea)
      : ""
  );
  const [status, setStatus] = useState(initialListing?.status ?? "available");
  const [featured, setFeatured] = useState(initialListing?.featured ?? false);
  const [summary, setSummary] = useState(initialListing?.summary ?? "");
  const [description, setDescription] = useState(initialListing?.description.join("\n\n") ?? "");
  const [features, setFeatures] = useState(initialListing?.features.join("\n") ?? "");
  const [images, setImages] = useState<string[]>(initialListing?.images ?? []);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      slug: slug.trim() || undefined,
      title: title.trim(),
      type,
      location: location.trim(),
      city: city.trim(),
      developer: developer.trim(),
      priceFrom: Number(priceFrom) || 0,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      floorArea: Number(floorArea) || 0,
      lotArea: lotArea.trim() === "" ? null : Number(lotArea),
      status,
      featured,
      summary: summary.trim(),
      description: description
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      features: features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      images,
    };

    try {
      const endpoint = isEdit ? `/api/admin/listings/${initialListing!.slug}` : "/api/admin/listings";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save listing");
      }

      router.push("/admin/listings");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save listing");
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
              Slug <span className="font-normal text-body">(used in the URL, leave blank to auto-generate)</span>
            </label>
            <input
              value={slug}
              name="slug" onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated-from-title"
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Property Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Listing["type"])}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Listing["status"])}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end pb-2.5">
            <label className="inline-flex items-center gap-2 text-sm text-heading">
              <input
                type="checkbox"
                checked={featured}
                name="featured" onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-black/20"
              />
              Featured on homepage
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Location / Subdivision</label>
            <input
              required
              value={location}
              name="location" onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">City</label>
            <input
              required
              value={city}
              name="city" onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Developer</label>
            <input
              required
              value={developer}
              name="developer" onChange={(e) => setDeveloper(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Price From (₱)</label>
            <input
              required
              type="number"
              min="0"
              value={priceFrom}
              name="priceFrom" onChange={(e) => setPriceFrom(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Bedrooms</label>
            <input
              type="number"
              min="0"
              value={bedrooms}
              name="bedrooms" onChange={(e) => setBedrooms(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Bathrooms</label>
            <input
              type="number"
              min="0"
              value={bathrooms}
              name="bathrooms" onChange={(e) => setBathrooms(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Floor Area (sqm)</label>
            <input
              type="number"
              min="0"
              value={floorArea}
              name="floorArea" onChange={(e) => setFloorArea(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-heading">Lot Area (sqm)</label>
            <input
              type="number"
              min="0"
              value={lotArea}
              name="lotArea" onChange={(e) => setLotArea(e.target.value)}
              placeholder="N/A"
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-heading">Short Summary</label>
          <textarea
            required
            rows={2}
            value={summary}
            name="summary" onChange={(e) => setSummary(e.target.value)}
            className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-heading">
            Overview <span className="font-normal text-body">(separate paragraphs with a blank line)</span>
          </label>
          <textarea
            rows={6}
            value={description}
            name="description" onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-heading">
            Features & Amenities <span className="font-normal text-body">(one per line)</span>
          </label>
          <textarea
            rows={5}
            value={features}
            name="features" onChange={(e) => setFeatures(e.target.value)}
            className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <ImageUploader images={images} onChange={setImages} label="Property Photos" />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark transition-colors disabled:opacity-60"
          >
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Listing"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/listings")}
            className="rounded-md border border-black/10 px-6 py-3 text-sm font-semibold text-heading hover:bg-cream"
          >
            Cancel
          </button>
        </div>

        {isEdit && initialListing && (
          <DeleteButton
            endpoint={`/api/admin/listings/${initialListing.slug}`}
            confirmMessage={`Delete "${initialListing.title}"? This cannot be undone.`}
            onDeleted={() => router.push("/admin/listings")}
            label="Delete Listing"
          />
        )}
      </div>
    </form>
  );
}
