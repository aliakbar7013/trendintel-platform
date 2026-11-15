import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/auth";
import {
  getAutoPilotStatus,
  startAutoPilot,
  stopAutoPilot,
  executeAutoPilotCycle,
} from "@/lib/auto-pilot";
import { updateSiteSettings, getSiteSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = getAutoPilotStatus();
  const settings = await getSiteSettings();

  return NextResponse.json({
    status,
    settings,
  });
}

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, intervalMinutes, articlesPerRun, targetDailyArticles } = body;

    if (action === "trigger_now") {
      const result = await executeAutoPilotCycle();
      return NextResponse.json({
        success: true,
        message: `Auto-pilot cycle finished. Published ${result.articlesPublished || 0} stories.`,
        result,
      });
    }

    if (action === "start") {
      const mins = intervalMinutes || 30;
      startAutoPilot(mins);
      await updateSiteSettings({ autoPilotEnabled: true, cronIntervalMinutes: mins });
      return NextResponse.json({
        success: true,
        message: `Auto-pilot started. Publishing every ${mins} minutes (~50 articles/day).`,
      });
    }

    if (action === "stop") {
      stopAutoPilot();
      await updateSiteSettings({ autoPilotEnabled: false });
      return NextResponse.json({
        success: true,
        message: "Auto-pilot stopped.",
      });
    }

    if (action === "update_config") {
      const updates: any = {};
      if (typeof intervalMinutes === "number") updates.cronIntervalMinutes = intervalMinutes;
      if (typeof articlesPerRun === "number") updates.articlesPerRun = articlesPerRun;
      if (typeof targetDailyArticles === "number") updates.targetDailyArticles = targetDailyArticles;

      const updated = await updateSiteSettings(updates);
      return NextResponse.json({
        success: true,
        message: "Auto-pilot publishing configuration updated.",
        settings: updated,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to manage auto-pilot." }, { status: 500 });
  }
}
