import { NextRequest, NextResponse } from "next/server";
import { runAutoPublisher } from "@/lib/publisher-engine";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Max execution time for Next.js

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyParam = searchParams.get("key");
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  const providedKey = keyParam || bearerToken;
  const expectedSecret = process.env.CRON_SECRET?.trim();

  // Protect endpoint
  if (!expectedSecret || providedKey !== expectedSecret) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized: Invalid or missing CRON_SECRET key.",
      },
      { status: 401 }
    );
  }

  try {
    const result = await runAutoPublisher("cron");
    return NextResponse.json({
      success: result.status !== "ERROR",
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Auto-publisher execution failed.",
      },
      { status: 500 }
    );
  }
}
