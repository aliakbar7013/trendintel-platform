export async function notifySearchEnginesAndHubs(
  publishedUrls: string[]
): Promise<{ indexNow: boolean; webSub: boolean; sitemapPings: boolean }> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trendintel.blog";
  const host = new URL(siteUrl).hostname;
  let indexNowSuccess = false;
  let webSubSuccess = false;
  let sitemapPingsSuccess = false;

  if (!publishedUrls || publishedUrls.length === 0) {
    return { indexNow: false, webSub: false, sitemapPings: false };
  }

  // 1. IndexNow Ping (Instant notification for Bing, Yandex, Naver, Seznam)
  try {
    const indexNowPayload = {
      host,
      key: process.env.INDEXNOW_KEY || "trendintel_indexnow_verified_key",
      keyLocation: `${siteUrl}/indexnow.txt`,
      urlList: publishedUrls,
    };

    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(indexNowPayload),
    });

    indexNowSuccess = res.ok || res.status === 202;
    console.log(`[PingEngine] IndexNow dispatched for ${publishedUrls.length} URLs (Status: ${res.status})`);
  } catch (err: any) {
    console.warn("[PingEngine] IndexNow ping failed:", err.message);
  }

  // 2. WebSub / PubSubHubbub (Notifies RSS aggregators & readers immediately)
  try {
    const feedUrl = `${siteUrl}/feed.xml`;
    const params = new URLSearchParams();
    params.append("hub.mode", "publish");
    params.append("hub.url", feedUrl);

    const res = await fetch("https://pubsubhubbub.appspot.com/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    webSubSuccess = res.ok || res.status === 204;
    console.log(`[PingEngine] WebSub hub published (Status: ${res.status})`);
  } catch (err: any) {
    console.warn("[PingEngine] WebSub ping failed:", err.message);
  }

  // 3. Sitemap Pings
  try {
    const sitemapUrl = encodeURIComponent(`${siteUrl}/sitemap.xml`);
    await Promise.allSettled([
      fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`),
      fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`),
    ]);
    sitemapPingsSuccess = true;
    console.log("[PingEngine] Search engine sitemap pings completed");
  } catch (err: any) {
    console.warn("[PingEngine] Sitemap ping notice:", err.message);
  }

  return {
    indexNow: indexNowSuccess,
    webSub: webSubSuccess,
    sitemapPings: sitemapPingsSuccess,
  };
}
