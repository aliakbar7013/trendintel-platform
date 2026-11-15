import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { localStore } from "@/lib/local-store";

const SEARCH_ENGINE_DOMAINS = [
  "google.com",
  "google.",
  "bing.com",
  "yahoo.com",
  "duckduckgo.com",
  "baidu.com",
  "yandex.ru",
  "ecosia.org",
];

export async function POST(request: NextRequest) {
  try {
    const { referrer, targetPath } = await request.json();

    if (!referrer || typeof referrer !== "string") {
      return NextResponse.json({ ignored: true, reason: "No referrer" });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(referrer);
    } catch {
      return NextResponse.json({ ignored: true, reason: "Invalid referrer URL" });
    }

    const domain = parsedUrl.hostname.toLowerCase().replace(/^www\./, "");

    // Ignore self-referrals or local testing
    if (
      domain === "trendintel.blog" ||
      domain === "localhost" ||
      domain === "127.0.0.1"
    ) {
      return NextResponse.json({ ignored: true, reason: "Self referral" });
    }

    // Ignore generic search engines (tracked separately in Google Search Console)
    const isSearchEngine = SEARCH_ENGINE_DOMAINS.some((se) =>
      domain.includes(se)
    );
    if (isSearchEngine) {
      return NextResponse.json({ ignored: true, reason: "Search engine referral" });
    }

    const cleanPath = (targetPath || "/").slice(0, 500);

    try {
      await prisma.referralVisit.upsert({
        where: {
          domain_targetPath: {
            domain,
            targetPath: cleanPath,
          },
        },
        update: {
          count: { increment: 1 },
          lastSeenAt: new Date(),
        },
        create: {
          domain,
          fullUrl: referrer.slice(0, 1000),
          targetPath: cleanPath,
          count: 1,
        },
      });

      return NextResponse.json({ recorded: true, domain });
    } catch (dbErr: any) {
      console.warn("Could not save referral to MySQL, saving to localStore:", dbErr.message);
      localStore.recordReferral(domain, cleanPath, referrer.slice(0, 1000));
      return NextResponse.json({ recorded: true, domain, fallback: true });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
