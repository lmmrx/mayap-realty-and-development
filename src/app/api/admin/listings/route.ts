import { NextRequest, NextResponse } from "next/server";
import { createListing } from "@/data/listings";
import { parseListingInput } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const input = parseListingInput(body);

  if (!input) {
    return NextResponse.json({ error: "Invalid listing data" }, { status: 400 });
  }

  const listing = createListing(input);
  return NextResponse.json({ listing }, { status: 201 });
}
