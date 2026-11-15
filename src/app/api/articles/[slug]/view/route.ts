import { NextRequest, NextResponse } from "next/server";
import { incrementViews } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const views = await incrementViews(slug);
    return NextResponse.json({ success: true, views });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
