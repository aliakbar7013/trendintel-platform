import { NextResponse } from "next/server";
import { getArticles } from "@/lib/db";

export const dynamic = "force-dynamic";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trendintel.blog";
  const { articles } = await getArticles({ limit: 30 });

  const itemsXml = articles
    .map((art) => {
      const articleUrl = `${siteUrl}/article/${art.slug}`;
      const pubDate = new Date(art.publishedAt).toUTCString();
      const description = `${art.excerpt} &lt;p&gt;Source analysis published on &lt;a href="${articleUrl}"&gt;TrendIntel.blog&lt;/a&gt;.&lt;/p&gt;`;

      return `
    <item>
      <title>${escapeXml(art.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      <category>${escapeXml(art.category.name)}</category>
      <author>editorial@trendintel.blog (TrendIntel Bureau)</author>
      <source url="${art.sourceUrl}">${escapeXml(art.sourceName)}</source>
    </item>`;
    })
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TrendIntel | Frontier News &amp; Trend Intelligence</title>
    <link>${siteUrl}</link>
    <description>Continuous algorithmic news intelligence and analytical synthesis covering frontier artificial intelligence, digital assets, central bank monetary trends, and venture deal flows.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/icon.png</url>
      <title>TrendIntel</title>
      <link>${siteUrl}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=1800, stale-while-revalidate=600",
    },
  });
}
