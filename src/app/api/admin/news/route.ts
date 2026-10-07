import { NextRequest, NextResponse } from "next/server";
import { createNewsPost } from "@/data/news";
import { parseNewsInput } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const input = parseNewsInput(body);

  if (!input) {
    return NextResponse.json({ error: "Invalid news post data" }, { status: 400 });
  }

  const post = createNewsPost(input);
  return NextResponse.json({ post }, { status: 201 });
}
