import { revalidatePath } from "next/cache";
import { readJsonFile, writeJsonFile } from "@/lib/json-store";
import { uniqueSlug } from "@/lib/slug";
import { Listing } from "@/lib/types";

const DATA_PATH = "listings.json";

function readListings(): Listing[] {
  return readJsonFile<Listing[]>(DATA_PATH);
}

function writeListings(listings: Listing[]): void {
  writeJsonFile(DATA_PATH, listings);
}

function revalidateListingPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath("/admin");
  revalidatePath("/admin/listings");
  if (slug) revalidatePath(`/listings/${slug}`);
}

export function getAllListings(): Listing[] {
  return readListings();
}

export function getListingBySlug(slug: string): Listing | undefined {
  return readListings().find((listing) => listing.slug === slug);
}

export function getFeaturedListings(): Listing[] {
  return readListings().filter((listing) => listing.featured);
}

export function getListingsByType(type: string): Listing[] {
  const all = readListings();
  if (type === "all") return all;
  return all.filter((listing) => listing.type === type);
}

export function getListingCities(): string[] {
  const cities = new Set(readListings().map((listing) => listing.city));
  return Array.from(cities).sort();
}

export function createListing(input: Omit<Listing, "slug"> & { slug?: string }): Listing {
  const listings = readListings();
  const existingSlugs = listings.map((listing) => listing.slug);
  const slug = input.slug ? uniqueSlug(input.slug, existingSlugs) : uniqueSlug(input.title, existingSlugs);

  const listing: Listing = { ...input, slug };
  writeListings([...listings, listing]);
  revalidateListingPaths(slug);
  return listing;
}

export function updateListing(currentSlug: string, input: Omit<Listing, "slug"> & { slug?: string }): Listing {
  const listings = readListings();
  const index = listings.findIndex((listing) => listing.slug === currentSlug);
  if (index === -1) {
    throw new Error(`Listing not found: ${currentSlug}`);
  }

  const otherSlugs = listings.filter((_, i) => i !== index).map((listing) => listing.slug);
  const desiredSlug = input.slug || currentSlug;
  const nextSlug = desiredSlug === currentSlug ? currentSlug : uniqueSlug(desiredSlug, otherSlugs);

  const updated: Listing = { ...input, slug: nextSlug };
  const nextListings = [...listings];
  nextListings[index] = updated;
  writeListings(nextListings);

  revalidateListingPaths(currentSlug);
  if (nextSlug !== currentSlug) revalidateListingPaths(nextSlug);

  return updated;
}

export function deleteListing(slug: string): void {
  const listings = readListings();
  const next = listings.filter((listing) => listing.slug !== slug);
  writeListings(next);
  revalidateListingPaths(slug);
}
