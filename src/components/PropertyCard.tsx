import Image from "next/image";
import Link from "next/link";
import { Listing } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { imageSource } from "@/lib/image";
import { propertyTypeLabels } from "@/data/site";

const statusStyles: Record<Listing["status"], string> = {
  available: "bg-emerald-600",
  reserved: "bg-amber-500",
  "sold-out": "bg-gray-500",
};

const statusLabels: Record<Listing["status"], string> = {
  available: "Available",
  reserved: "Reserved",
  "sold-out": "Sold Out",
};

export default function PropertyCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group block overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          {...imageSource(listing.images[0])}
          alt={listing.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded bg-ink/90 px-2.5 py-1 text-xs font-semibold text-white">
          {propertyTypeLabels[listing.type]}
        </span>
        <span
          className={`absolute top-3 right-3 rounded px-2.5 py-1 text-xs font-semibold text-white ${statusStyles[listing.status]}`}
        >
          {statusLabels[listing.status]}
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          {listing.location}, {listing.city}
        </p>
        <h3 className="mt-1 text-lg font-bold text-heading group-hover:text-brand transition-colors">
          {listing.title}
        </h3>
        <p className="mt-2 text-sm text-body line-clamp-2">{listing.summary}</p>

        <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
          {listing.type !== "other" ? (
            <div className="flex items-center gap-3 text-xs text-body">
              <span>{listing.bedrooms} Bed</span>
              <span className="h-1 w-1 rounded-full bg-body/40" />
              <span>{listing.bathrooms} Bath</span>
              <span className="h-1 w-1 rounded-full bg-body/40" />
              <span>{listing.floorArea} sqm</span>
            </div>
          ) : (
            <div className="text-xs text-body">
              {listing.lotArea ? `${listing.lotArea} sqm lot` : listing.developer}
            </div>
          )}
          <div className="text-right">
            <p className="text-[11px] text-body">Starts at</p>
            <p className="font-bold text-heading">{formatPrice(listing.priceFrom)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
