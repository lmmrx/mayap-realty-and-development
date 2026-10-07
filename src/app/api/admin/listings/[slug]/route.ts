import { NextRequest, NextResponse } from "next/server";
import { deleteListing, getListingBySlug, updateListing } from "@/data/listings";
import { parseListingInput } from "@/lib/validation";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const existing = getListingBySlug(slug);
  if (!existing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const input = parseListingInput(body);
  if (!input) {
    return NextResponse.json({ error: "Invalid listing data" }, { status: 400 });
  }

  const listing = updateListing(slug, input);
  return NextResponse.json({ listing });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const existing = getListingBySlug(slug);
  if (!existing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  deleteListing(slug);
  return NextResponse.json({ ok: true });
}
