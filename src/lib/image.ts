// Shown whenever a listing or post has no usable image, so an empty or
// malformed URL never makes next/image throw and take the whole page down.
export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

// Hosts allowed through the Next.js image optimizer - keep in sync with
// images.remotePatterns in next.config.ts.
const OPTIMIZED_HOSTS = new Set(["picsum.photos", "fastly.picsum.photos"]);

export function isValidImageUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Props for next/image. Local files and allow-listed hosts go through the
 * optimizer; any other pasted URL is rendered as-is, because next/image
 * throws for hosts missing from remotePatterns.
 */
export function imageSource(src: string | undefined): { src: string; unoptimized: boolean } {
  if (!src || !isValidImageUrl(src)) return { src: PLACEHOLDER_IMAGE, unoptimized: true };
  if (src.endsWith(".svg")) return { src, unoptimized: true };
  if (src.startsWith("/")) return { src, unoptimized: false };
  const url = new URL(src);
  return { src, unoptimized: !(url.protocol === "https:" && OPTIMIZED_HOSTS.has(url.hostname)) };
}
