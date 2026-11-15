import { NextRequest, NextResponse } from "next/server";
import { pruneUnderperformingArticles } from "@/lib/prune";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyParam = searchParams.get("key");
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  const providedKey = keyParam || bearerToken;
  const expectedSecret = process.env.CRON_SECRET?.trim();

  if (!expectedSecret || providedKey !== expectedSecret) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing CRON_SECRET key." },
      { status: 401 }
    );
  }

  try {
    const result = await pruneUnderperformingArticles();
    return NextResponse.json({
      success: true,
      message: `Pruning routine completed. De-indexed ${result.prunedCount} low-signal articles older than 45 days.`,
      prunedCount: result.prunedCount,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Pruning execution failed." },
      { status: 500 }
    );
  }
}
