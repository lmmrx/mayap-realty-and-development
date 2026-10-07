import { NextRequest, NextResponse } from "next/server";
import { updateSiteConfig } from "@/data/site";
import { SiteConfig } from "@/lib/types";

function isValidSiteConfig(body: unknown): body is SiteConfig {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  const social = b.social as Record<string, unknown> | undefined;
  return (
    typeof b.name === "string" &&
    typeof b.shortName === "string" &&
    typeof b.tagline === "string" &&
    typeof b.description === "string" &&
    typeof b.phone === "string" &&
    typeof b.email === "string" &&
    typeof b.address === "string" &&
    typeof b.officeHours === "string" &&
    !!social &&
    typeof social.facebook === "string" &&
    typeof social.instagram === "string" &&
    typeof social.youtube === "string"
  );
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!isValidSiteConfig(body)) {
    return NextResponse.json({ error: "Invalid site settings" }, { status: 400 });
  }

  const config = updateSiteConfig(body);
  return NextResponse.json({ config });
}
