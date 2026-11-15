import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STARTER_ARTICLES } from "@/lib/starter-data";

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
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  let articles: { title: string; slug: string; publishedAt: Date }[] = [];

  try {
    // Google News strictly indexes articles from the past 48 hours that are marked isIndexed: true
    articles = await prisma.article.findMany({
      where: {
        publishedAt: { gte: fortyEightHoursAgo },
        isIndexed: true,
      },
      select: {
        title: true,
        slug: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 1000,
    });

    // Fallback if no fresh articles within 48h yet (e.g. right after fresh setup)
    if (articles.length === 0) {
      articles = await prisma.article.findMany({
        where: { isIndexed: true },
        select: {
          title: true,
          slug: true,
          publishedAt: true,
        },
        orderBy: { publishedAt: "desc" },
        take: 5,
      });
    }
  } catch {
    articles = STARTER_ARTICLES.slice(0, 5).map((a) => ({
      title: a.title,
      slug: a.slug,
      publishedAt: new Date(),
    }));
  }

  const urlsXml = articles
    .map((art) => {
      const loc = `${siteUrl}/article/${art.slug}`;
      const pubDate = new Date(art.publishedAt).toISOString();

      return `  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>TrendIntel</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(art.title)}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const newsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlsXml}
</urlset>`;

  return new NextResponse(newsSitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=900, stale-while-revalidate=300",
    },
  });
}
