import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/auth";
import { runAutoPublisher } from "@/lib/publisher-engine";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const result = await runAutoPublisher("admin_manual");
    return NextResponse.json({
      success: result.status !== "ERROR",
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Manual run failed" },
      { status: 500 }
    );
  }
}
