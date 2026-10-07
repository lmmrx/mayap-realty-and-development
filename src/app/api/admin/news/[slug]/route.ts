import { NextRequest, NextResponse } from "next/server";
import { deleteNewsPost, getNewsBySlug, updateNewsPost } from "@/data/news";
import { parseNewsInput } from "@/lib/validation";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const existing = getNewsBySlug(slug);
  if (!existing) {
    return NextResponse.json({ error: "News post not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const input = parseNewsInput(body);
  if (!input) {
    return NextResponse.json({ error: "Invalid news post data" }, { status: 400 });
  }

  const post = updateNewsPost(slug, input);
  return NextResponse.json({ post });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const existing = getNewsBySlug(slug);
  if (!existing) {
    return NextResponse.json({ error: "News post not found" }, { status: 404 });
  }

  deleteNewsPost(slug);
  return NextResponse.json({ ok: true });
}
