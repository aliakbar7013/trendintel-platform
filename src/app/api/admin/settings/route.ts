import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      adsEnabled,
      adsenseClientId,
      autoPilotEnabled,
      targetDailyArticles,
      articlesPerRun,
      cronIntervalMinutes,
    } = body;

    const updates: any = {};
    if (typeof adsEnabled === "boolean") updates.adsEnabled = adsEnabled;
    if (typeof adsenseClientId === "string") updates.adsenseClientId = adsenseClientId.trim();
    if (typeof autoPilotEnabled === "boolean") updates.autoPilotEnabled = autoPilotEnabled;
    if (typeof targetDailyArticles === "number") updates.targetDailyArticles = targetDailyArticles;
    if (typeof articlesPerRun === "number") updates.articlesPerRun = articlesPerRun;
    if (typeof cronIntervalMinutes === "number") updates.cronIntervalMinutes = cronIntervalMinutes;

    const updated = await updateSiteSettings(updates);
    return NextResponse.json({
      success: true,
      message: "Settings updated successfully.",
      settings: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
