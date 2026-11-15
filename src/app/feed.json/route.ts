import { NextResponse } from "next/server";
import { getArticles } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trendintel.blog";
  const { articles } = await getArticles({ limit: 30 });

  const jsonFeed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "TrendIntel | Frontier News & Trend Intelligence",
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json`,
    description:
      "Continuous algorithmic news intelligence and analytical synthesis covering frontier artificial intelligence, digital assets, central bank monetary trends, and venture deal flows.",
    icon: `${siteUrl}/icon.png`,
    favicon: `${siteUrl}/icon.png`,
    authors: [
      {
        name: "TrendIntel Editorial Bureau",
        url: siteUrl,
      },
    ],
    items: articles.map((art) => ({
      id: `${siteUrl}/article/${art.slug}`,
      url: `${siteUrl}/article/${art.slug}`,
      title: art.title,
      summary: art.excerpt,
      content_html: `${art.content}<p>Read original intelligence dispatch at <a href="${siteUrl}/article/${art.slug}">TrendIntel.blog</a></p>`,
      image: art.featuredImage,
      date_published: new Date(art.publishedAt).toISOString(),
      date_modified: new Date(art.updatedAt).toISOString(),
      tags: [art.category.name, ...(art.topicTags || [])],
    })),
  };

  return NextResponse.json(jsonFeed, {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "s-maxage=1800, stale-while-revalidate=600",
    },
  });
}
