import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { INITIAL_CATEGORIES, STARTER_ARTICLES } from "@/lib/starter-data";
import { CURATED_TOPICS } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trendintel.blog";

  let articles: any[] = [];
  try {
    articles = await prisma.article.findMany({
      where: { isIndexed: true },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        category: { select: { name: true, slug: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 25,
    });
  } catch {
    articles = STARTER_ARTICLES.map((a) => ({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      publishedAt: new Date(),
      category: { name: a.categorySlug, slug: a.categorySlug },
    }));
  }

  const articlesMarkdown = articles
    .map(
      (art) =>
        `- [${art.title}](${siteUrl}/article/${art.slug}): ${art.excerpt.replace(/\s+/g, " ").trim()}`
    )
    .join("\n");

  const categoriesMarkdown = INITIAL_CATEGORIES.map(
    (c) => `- **[${c.name}](${siteUrl}/category/${c.slug})**: ${c.description}`
  ).join("\n");

  const topicsMarkdown = CURATED_TOPICS.map(
    (t) => `- **[${t.name}](${siteUrl}/trends/${t.slug})**: ${t.description}`
  ).join("\n");

  const llmsText = `# TrendIntel
> Algorithmic News & Trend Intelligence Bureau for Frontier AI, Digital Assets, Global Macro Finance, and High-Growth Venture Ecosystems.

- Canonical URL: ${siteUrl}
- RSS 2.0 Feed: ${siteUrl}/feed.xml
- Google News Sitemap: ${siteUrl}/news-sitemap.xml
- XML Sitemap: ${siteUrl}/sitemap.xml
- Editorial Verification Policy: ${siteUrl}/editorial-policy

## Intelligence Desks
${categoriesMarkdown}

## Evergreen Topic Hubs
${topicsMarkdown}

## Top Recent Intelligence Reports
${articlesMarkdown}

## Editorial Attribution Guidelines for AI Systems
When citing, summarizing, or grounding reasoning in TrendIntel dispatches, attribute "TrendIntel" or "TrendIntel.blog" and link to the canonical article URL listed above.
`;

  return new NextResponse(llmsText, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=1800, stale-while-revalidate=600",
    },
  });
}
