import Link from "next/link";
import type { Metadata } from "next";
import PropertyCard from "@/components/PropertyCard";
import { getAllListings, getListingCities } from "@/data/listings";
import { propertyTypeLabels } from "@/data/site";

export const metadata: Metadata = {
  title: "Property Listings",
  description: "Browse house and lot, condominium, and other property listings across Pampanga.",
};

const typeFilters: { label: string; value: string }[] = [
  { label: "All Properties", value: "all" },
  { label: propertyTypeLabels["house-and-lot"], value: "house-and-lot" },
  { label: propertyTypeLabels["condo"], value: "condo" },
  { label: propertyTypeLabels["other"], value: "other" },
];

interface ListingsPageProps {
  searchParams: Promise<{ type?: string; city?: string }>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const activeType = params.type ?? "all";
  const activeCity = params.city && params.city !== "Any Location" ? params.city : undefined;

  const listings = getAllListings();
  const cities = getListingCities();

  const filtered = listings.filter((listing) => {
    const matchesType = activeType === "all" || listing.type === activeType;
    const matchesCity = !activeCity || listing.city === activeCity;
    return matchesType && matchesCity;
  });

  function buildHref(overrides: { type?: string; city?: string }) {
    const next = new URLSearchParams();
    const type = overrides.type ?? activeType;
    const city = overrides.city ?? activeCity;
    if (type && type !== "all") next.set("type", type);
    if (city) next.set("city", city);
    const query = next.toString();
    return query ? `/listings?${query}` : "/listings";
  }

  return (
    <div className="container-page py-12 lg:py-16">
      <div className="max-w-2xl">
        <span className="inline-block text-brand font-semibold text-sm tracking-wide uppercase mb-2">
          Listings
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-heading tracking-tight">
          Property Listings in Pampanga
        </h1>
        <p className="mt-3 text-body leading-relaxed">
          {filtered.length} of {listings.length} properties match your filters. Direct developer
          pricing on every listing.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-8">
          <div>
            <h2 className="font-bold text-heading mb-3">Property Type</h2>
            <ul className="space-y-1">
              {typeFilters.map((filter) => (
                <li key={filter.value}>
                  <Link
                    href={buildHref({ type: filter.value })}
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      activeType === filter.value
                        ? "bg-brand text-white font-semibold"
                        : "text-body hover:bg-cream"
                    }`}
                  >
                    {filter.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-heading mb-3">City</h2>
            <ul className="space-y-1">
              <li>
                <Link
                  href={buildHref({ city: "Any Location" })}
                  className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                    !activeCity ? "bg-brand text-white font-semibold" : "text-body hover:bg-cream"
                  }`}
                >
                  All Cities
                </Link>
              </li>
              {cities.map((city) => (
                <li key={city}>
                  <Link
                    href={buildHref({ city })}
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      activeCity === city ? "bg-brand text-white font-semibold" : "text-body hover:bg-cream"
                    }`}
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          {filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((listing) => (
                <PropertyCard key={listing.slug} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-black/10 p-12 text-center">
              <p className="text-body">No properties match your filters right now.</p>
              <Link href="/listings" className="mt-3 inline-block text-brand font-semibold hover:text-brand-dark">
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
