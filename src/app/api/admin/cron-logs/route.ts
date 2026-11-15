import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { localStore } from "@/lib/local-store";

export async function GET(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const logs = await prisma.cronLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    if (logs && logs.length > 0) {
      return NextResponse.json({ logs });
    }
  } catch (err: any) {
    console.warn("DB cron logs query failed, falling back to localStore:", err.message);
  }

  return NextResponse.json({ logs: localStore.getCronLogs() });
}
