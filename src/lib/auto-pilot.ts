/**
 * Autonomous Background Auto-Pilot Engine
 *
 * Automatically triggers the TrendIntel publication engine at a configured interval
 * (default: every 30 minutes, 2 articles/run = ~50-60 articles/day) without requiring
 * external cron daemons. Safe for both local development and Hostinger production.
 */

import { runAutoPublisher } from "./publisher-engine";
import { getSiteSettings } from "./db";

declare global {
  var __trendintel_autopilot_timer: NodeJS.Timeout | null | undefined;
  var __trendintel_autopilot_running: boolean | undefined;
}

export function isAutoPilotRunning(): boolean {
  return Boolean(global.__trendintel_autopilot_timer);
}

export function getAutoPilotStatus(): {
  isActive: boolean;
  intervalMinutes: number;
  lastExecutionAt: string | null;
  isRunningExecution: boolean;
} {
  return {
    isActive: Boolean(global.__trendintel_autopilot_timer),
    intervalMinutes: 30,
    lastExecutionAt: global.__trendintel_last_auto_pilot_run || null,
    isRunningExecution: Boolean(global.__trendintel_autopilot_running),
  };
}

declare global {
  var __trendintel_last_auto_pilot_run: string | undefined;
}

export async function executeAutoPilotCycle(): Promise<any> {
  if (global.__trendintel_autopilot_running) {
    console.log("[AutoPilot] A cycle is already executing. Skipping concurrent trigger.");
    return { skipped: true, reason: "Already running" };
  }

  global.__trendintel_autopilot_running = true;
  global.__trendintel_last_auto_pilot_run = new Date().toISOString();

  try {
    console.log(`[AutoPilot] Triggering autonomous publishing cycle at ${new Date().toISOString()}...`);
    const result = await runAutoPublisher("cron");
    console.log(
      `[AutoPilot] Cycle complete: Published ${result.articlesPublished} stories, scanned ${result.feedsScanned} feeds.`
    );
    return result;
  } catch (err: any) {
    console.error("[AutoPilot] Cycle encountered error:", err.message);
    throw err;
  } finally {
    global.__trendintel_autopilot_running = false;
  }
}

export async function startAutoPilot(intervalMinutes = 30): Promise<boolean> {
  // Prevent duplicate timers
  if (global.__trendintel_autopilot_timer) {
    clearInterval(global.__trendintel_autopilot_timer);
    global.__trendintel_autopilot_timer = null;
  }

  const ms = Math.max(5, intervalMinutes) * 60 * 1000;
  console.log(`[AutoPilot] Starting autonomous background timer every ${intervalMinutes} minutes (${ms}ms)...`);

  // Start recurring timer
  global.__trendintel_autopilot_timer = setInterval(async () => {
    try {
      const settings = await getSiteSettings();
      if (settings.autoPilotEnabled === false) {
        console.log("[AutoPilot] Auto-pilot disabled in settings. Pausing execution.");
        return;
      }
      await executeAutoPilotCycle();
    } catch (err: any) {
      console.warn("[AutoPilot] Recurring cycle error:", err.message);
    }
  }, ms);

  return true;
}

export function stopAutoPilot(): boolean {
  if (global.__trendintel_autopilot_timer) {
    clearInterval(global.__trendintel_autopilot_timer);
    global.__trendintel_autopilot_timer = null;
    console.log("[AutoPilot] Autonomous background timer stopped.");
    return true;
  }
  return false;
}
