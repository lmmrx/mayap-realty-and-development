import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllListings, getListingBySlug } from "@/data/listings";
import { getSiteConfig, propertyTypeLabels } from "@/data/site";
import { formatFullPrice } from "@/lib/format";
import { imageSource } from "@/lib/image";
import InquiryForm from "@/components/InquiryForm";
import PropertyCard from "@/components/PropertyCard";

interface ListingPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllListings().map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) return {};
  return {
    title: listing.title,
    description: listing.summary,
  };
}

const statusLabels: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  "sold-out": "Sold Out",
};

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing) notFound();

  const siteConfig = getSiteConfig();
  const related = getAllListings()
    .filter((item) => item.slug !== listing.slug && item.type === listing.type)
    .slice(0, 3);

  return (
    <div className="container-page py-10 lg:py-14">
      <nav className="text-sm text-body mb-6">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/listings" className="hover:text-brand">
          Listings
        </Link>
        <span className="mx-2">/</span>
        <span className="text-heading">{listing.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl sm:col-span-2 sm:aspect-[16/10]">
              <Image
                {...imageSource(listing.images[0])}
                alt={listing.title}
                fill
                priority
                sizes="(min-width: 640px) 66vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
              {listing.images.slice(1, 3).map((image, index) => (
                <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    {...imageSource(image)}
                    alt={`${listing.title} photo ${index + 2}`}
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded bg-ink px-3 py-1 text-xs font-semibold text-white">
              {propertyTypeLabels[listing.type]}
            </span>
            <span className="rounded bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              {statusLabels[listing.status]}
            </span>
            <span className="text-sm text-body">
              {listing.developer} &middot; {listing.location}, {listing.city}
            </span>
          </div>

          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-heading tracking-tight">
            {listing.title}
          </h1>

          {listing.type !== "other" ? (
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-black/5 bg-cream p-5 sm:grid-cols-4">
              <div>
                <p className="text-xs text-body">Bedrooms</p>
                <p className="font-bold text-heading">{listing.bedrooms}</p>
              </div>
              <div>
                <p className="text-xs text-body">Bathrooms</p>
                <p className="font-bold text-heading">{listing.bathrooms}</p>
              </div>
              <div>
                <p className="text-xs text-body">Floor Area</p>
                <p className="font-bold text-heading">{listing.floorArea} sqm</p>
              </div>
              <div>
                <p className="text-xs text-body">Lot Area</p>
                <p className="font-bold text-heading">{listing.lotArea ? `${listing.lotArea} sqm` : "N/A"}</p>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-black/5 bg-cream p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-body">Lot Area</p>
                <p className="font-bold text-heading">{listing.lotArea ? `${listing.lotArea} sqm` : "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-body">Developer</p>
                <p className="font-bold text-heading">{listing.developer}</p>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-bold text-heading">Overview</h2>
            <div className="mt-3 space-y-4 text-body leading-relaxed">
              {listing.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-heading">Features & Amenities</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {listing.features.map((feature, index) => (
                <li key={`${feature}-${index}`}className="flex items-start gap-2 text-sm text-body">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside>
          <div className="sticky top-28 rounded-xl border border-black/5 bg-white p-6 shadow-md">
            <p className="text-xs text-body">Starts at</p>
            <p className="text-3xl font-bold text-heading">{formatFullPrice(listing.priceFrom)}</p>
            <p className="mt-1 text-xs text-body">
              Total contract price, subject to unit and financing terms.
            </p>

            <div className="mt-5 border-t border-black/5 pt-5">
              <h3 className="font-bold text-heading mb-3">Inquire About This Property</h3>
              <InquiryForm propertyName={listing.title} compact />
            </div>

            <div className="mt-5 border-t border-black/5 pt-5 text-sm text-body space-y-2">
              <p>
                Or call us directly at{" "}
                <a href={`tel:${siteConfig.phone}`} className="font-semibold text-brand">
                  {siteConfig.phone}
                </a>
              </p>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-heading mb-6">Similar Properties</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <PropertyCard key={item.slug} listing={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
