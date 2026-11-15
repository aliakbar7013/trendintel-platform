import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { INITIAL_CATEGORIES, STARTER_ARTICLES } from "@/lib/starter-data";
import { CURATED_TOPICS } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trendintel.blog";

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/trends`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/editorial-policy`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Evergreen Topic Hub Routes
  const topicRoutes: MetadataRoute.Sitemap = CURATED_TOPICS.map((topic) => ({
    url: `${baseUrl}/trends/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // Category routes
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    });
    if (categories.length > 0) {
      categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/category/${cat.slug}`,
        lastModified: cat.updatedAt,
        changeFrequency: "daily",
        priority: 0.9,
      }));
    }
  } catch {
    categoryRoutes = INITIAL_CATEGORIES.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    }));
  }

  // Article routes (Excludes pruned articles with isIndexed = false)
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await prisma.article.findMany({
      where: { isIndexed: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
      take: 2000,
    });
    if (articles.length > 0) {
      articleRoutes = articles.map((art) => ({
        url: `${baseUrl}/article/${art.slug}`,
        lastModified: art.updatedAt || art.publishedAt,
        changeFrequency: "daily",
        priority: 0.85,
      }));
    }
  } catch {
    articleRoutes = STARTER_ARTICLES.map((art) => ({
      url: `${baseUrl}/article/${art.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    }));
  }

  return [...staticRoutes, ...topicRoutes, ...categoryRoutes, ...articleRoutes];
}
