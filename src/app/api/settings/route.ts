import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { adsEnabled: false, adsenseClientId: "ca-pub-XXXXXXXXXXXXXXXX" },
      { status: 200 }
    );
  }
}
