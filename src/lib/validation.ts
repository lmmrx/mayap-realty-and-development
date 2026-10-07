import { isValidImageUrl } from "@/lib/image";
import { EmailSettings, Listing, ListingStatus, NewsPost, PropertyType } from "@/lib/types";

const PROPERTY_TYPES: PropertyType[] = ["house-and-lot", "condo", "other"];
const LISTING_STATUSES: ListingStatus[] = ["available", "reserved", "sold-out"];

type Input<T> = Omit<T, "slug"> & { slug?: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function optionalSlug(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/**
 * Validates a listing payload and returns only the known fields, so stray
 * keys in the request body are never written to listings.json.
 */
export function parseListingInput(body: unknown): Input<Listing> | null {
  if (!isRecord(body)) return null;
  const b = body;

  const valid =
    typeof b.title === "string" &&
    b.title.trim().length > 0 &&
    PROPERTY_TYPES.includes(b.type as PropertyType) &&
    typeof b.location === "string" &&
    typeof b.city === "string" &&
    typeof b.developer === "string" &&
    isNonNegativeNumber(b.priceFrom) &&
    isNonNegativeNumber(b.bedrooms) &&
    isNonNegativeNumber(b.bathrooms) &&
    isNonNegativeNumber(b.floorArea) &&
    (b.lotArea === null || isNonNegativeNumber(b.lotArea)) &&
    LISTING_STATUSES.includes(b.status as ListingStatus) &&
    typeof b.featured === "boolean" &&
    typeof b.summary === "string" &&
    isStringArray(b.description) &&
    isStringArray(b.features) &&
    Array.isArray(b.images) &&
    b.images.every(isValidImageUrl);

  if (!valid) return null;

  return {
    slug: optionalSlug(b.slug),
    title: (b.title as string).trim(),
    type: b.type as PropertyType,
    location: b.location as string,
    city: b.city as string,
    developer: b.developer as string,
    priceFrom: b.priceFrom as number,
    bedrooms: b.bedrooms as number,
    bathrooms: b.bathrooms as number,
    floorArea: b.floorArea as number,
    lotArea: b.lotArea as number | null,
    status: b.status as ListingStatus,
    featured: b.featured as boolean,
    summary: b.summary as string,
    description: b.description as string[],
    features: b.features as string[],
    images: b.images as string[],
  };
}

export function parseNewsInput(body: unknown): Input<NewsPost> | null {
  if (!isRecord(body)) return null;
  const b = body;

  const valid =
    typeof b.title === "string" &&
    b.title.trim().length > 0 &&
    typeof b.date === "string" &&
    !Number.isNaN(Date.parse(b.date)) &&
    typeof b.category === "string" &&
    typeof b.excerpt === "string" &&
    (b.image === "" || isValidImageUrl(b.image)) &&
    isStringArray(b.content);

  if (!valid) return null;

  return {
    slug: optionalSlug(b.slug),
    title: (b.title as string).trim(),
    date: b.date as string,
    category: b.category as string,
    excerpt: b.excerpt as string,
    image: b.image as string,
    content: b.content as string[],
  };
}

export function parseEmailSettings(body: unknown): EmailSettings | null {
  if (!isRecord(body)) return null;
  const b = body;

  const valid =
    typeof b.smtpHost === "string" &&
    typeof b.smtpPort === "number" &&
    Number.isInteger(b.smtpPort) &&
    b.smtpPort > 0 &&
    b.smtpPort <= 65535 &&
    typeof b.smtpUser === "string" &&
    typeof b.smtpPass === "string" &&
    typeof b.smtpFrom === "string" &&
    typeof b.contactEmail === "string";

  if (!valid) return null;

  return {
    smtpHost: b.smtpHost as string,
    smtpPort: b.smtpPort as number,
    smtpUser: b.smtpUser as string,
    smtpPass: b.smtpPass as string,
    smtpFrom: b.smtpFrom as string,
    contactEmail: b.contactEmail as string,
  };
}
