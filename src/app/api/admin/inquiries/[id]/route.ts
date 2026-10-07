import { NextRequest, NextResponse } from "next/server";
import { deleteInquiry, markInquiryRead } from "@/data/inquiries";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  markInquiryRead(id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  deleteInquiry(id);
  return NextResponse.json({ ok: true });
}
