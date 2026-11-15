import { NextRequest, NextResponse } from "next/server";
import { getCategoryBySlug, getArticles } from "@/lib/db";

export const dynamic = "force-dynamic";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trendintel.blog";
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return new NextResponse("Category not found", { status: 404 });
  }

  const { articles } = await getArticles({ categorySlug: slug, limit: 30 });

  const itemsXml = articles
    .map((art) => {
      const articleUrl = `${siteUrl}/article/${art.slug}`;
      const pubDate = new Date(art.publishedAt).toUTCString();
      const description = `${art.excerpt} &lt;p&gt;Synthesized by &lt;a href="${articleUrl}"&gt;TrendIntel.blog&lt;/a&gt;.&lt;/p&gt;`;

      return `
    <item>
      <title>${escapeXml(art.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      <category>${escapeXml(category.name)}</category>
    </item>`;
    })
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TrendIntel | ${escapeXml(category.name)} Wire</title>
    <link>${siteUrl}/category/${category.slug}</link>
    <description>${escapeXml(category.description || "")}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/category/${category.slug}/feed.xml" rel="self" type="application/rss+xml" />
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
