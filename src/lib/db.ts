import { prisma } from "./prisma";
import { INITIAL_CATEGORIES, STARTER_ARTICLES, TrendStat } from "./starter-data";
import { injectInternalLinksAndCallout } from "./internal-linker";
import { localStore, SiteSettings } from "./local-store";

export interface FormattedArticle {
  id: string;
  title: string;
  seoTitle?: string;
  slug: string;
  focusKeyword?: string | null;
  excerpt: string;
  tldr: string;
  content: string;
  keyTakeaways: string[];
  faqs: { question: string; answer: string }[];
  trendStat?: TrendStat | null;
  topicTags?: string[];
  featuredImage: string;
  imageCaption: string | null;
  sourceName: string;
  sourceUrl: string;
  contentHash: string;
  readingTime: number;
  views: number;
  isFeatured: boolean;
  isBreaking: boolean;
  isIndexed: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  };
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

function parseJsonSafe<T>(jsonStr: any, fallback: T): T {
  if (!jsonStr) return fallback;
  if (typeof jsonStr !== "string") return jsonStr as T;
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    return fallback;
  }
}

function formatArticleRecord(raw: any): FormattedArticle {
  return {
    ...raw,
    seoTitle: raw.seoTitle || raw.title,
    focusKeyword: raw.focusKeyword || null,
    isIndexed: typeof raw.isIndexed === "boolean" ? raw.isIndexed : true,
    tldr: raw.tldr || raw.excerpt,
    keyTakeaways: parseJsonSafe<string[]>(raw.keyTakeaways, []),
    faqs: parseJsonSafe<{ question: string; answer: string }[]>(raw.faqs, []),
    trendStat: parseJsonSafe<TrendStat | null>(raw.trendStat, null),
    topicTags: parseJsonSafe<string[]>(raw.topicTags, []),
  };
}

// Memory / LocalStore fallback articles with genuine persistent view counts
function getFallbackArticles(): FormattedArticle[] {
  try {
    const stored = localStore.getAllArticles();
    if (stored && stored.length > 0) {
      return stored as FormattedArticle[];
    }
  } catch (err) {
    console.warn("Could not read local store, generating fresh fallback:", err);
  }

  const catMap = new Map(
    INITIAL_CATEGORIES.map((c, i) => [
      c.slug,
      { id: `cat-${i + 1}`, name: c.name, slug: c.slug, color: c.color },
    ])
  );

  const rawList = STARTER_ARTICLES.map((art, idx) => {
    const cat = catMap.get(art.categorySlug) || {
      id: "cat-1",
      name: "AI & Tech",
      slug: "ai-tech",
      color: "#00f0ff",
    };
    return {
      id: `fallback-art-${idx + 1}`,
      title: art.title,
      seoTitle: art.seoTitle || art.title,
      slug: art.slug,
      focusKeyword: art.focusKeyword || null,
      excerpt: art.excerpt,
      content: art.content,
      keyTakeaways: art.keyTakeaways,
      faqs: art.faqs,
      trendStat: art.trendStat,
      topicTags: art.topicTags,
      featuredImage: art.featuredImage,
      imageCaption: art.imageCaption,
      sourceName: art.sourceName,
      sourceUrl: art.sourceUrl,
      contentHash: `hash-${idx}`,
      readingTime: art.readingTime,
      views: 0,
      isFeatured: art.isFeatured,
      isBreaking: art.isBreaking,
      isIndexed: true,
      tldr: art.tldr || art.excerpt,
      categoryId: cat.id,
      category: cat,
      publishedAt: new Date(Date.now() - idx * 3600 * 1000 * 4),
      createdAt: new Date(Date.now() - idx * 3600 * 1000 * 4),
      updatedAt: new Date(),
    };
  });

  // Inject internal linking between starter articles
  return rawList.map((art) => {
    const enrichedContent = injectInternalLinksAndCallout(
      art.content,
      art.slug,
      rawList.map((r) => ({ title: r.title, slug: r.slug, views: r.views }))
    );
    return { ...art, content: enrichedContent };
  });
}

// 1. Fetch Categories
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { articles: true, feeds: true },
        },
      },
    });
    if (categories.length > 0) return categories;
  } catch (err) {
    console.warn("Database not yet reachable, using fallback categories:", (err as Error).message);
  }

  return INITIAL_CATEGORIES.map((c, idx) => ({
    id: `cat-${idx + 1}`,
    name: c.name,
    slug: c.slug,
    description: c.description,
    color: c.color,
    order: c.order,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: {
      articles: STARTER_ARTICLES.filter((a) => a.categorySlug === c.slug).length,
      feeds: c.feeds.length,
    },
  }));
}

// 2. Fetch Category by Slug
export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { articles: true, feeds: true },
        },
      },
    });
    if (category) return category;
  } catch (err) {
    console.warn("Database query error for category:", (err as Error).message);
  }

  const found = INITIAL_CATEGORIES.find((c) => c.slug === slug);
  if (!found) return null;

  return {
    id: `cat-${slug}`,
    name: found.name,
    slug: found.slug,
    description: found.description,
    color: found.color,
    order: found.order,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: {
      articles: STARTER_ARTICLES.filter((a) => a.categorySlug === slug).length,
      feeds: found.feeds.length,
    },
  };
}

// 3. Query Articles
export async function getArticles({
  categorySlug,
  topicTag,
  page = 1,
  limit = 9,
  search,
  featuredOnly = false,
  breakingOnly = false,
}: {
  categorySlug?: string;
  topicTag?: string;
  page?: number;
  limit?: number;
  search?: string;
  featuredOnly?: boolean;
  breakingOnly?: boolean;
}) {
  const skip = (page - 1) * limit;

  try {
    const where: any = {};
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    if (topicTag) {
      where.topicTags = { contains: topicTag };
    }
    if (featuredOnly) {
      where.isFeatured = true;
    }
    if (breakingOnly) {
      where.isBreaking = true;
    }
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
        { keyTakeaways: { contains: q } },
        { topicTags: { contains: q } },
      ];
    }

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true, color: true },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    if (totalCount > 0) {
      return {
        articles: articles.map(formatArticleRecord),
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    }
  } catch (err) {
    console.warn("Database query error for articles, falling back:", (err as Error).message);
  }

  // Fallback filtering
  let pool = getFallbackArticles();
  if (categorySlug) {
    pool = pool.filter((a) => a.category.slug === categorySlug);
  }
  if (topicTag) {
    pool = pool.filter((a) => a.topicTags?.includes(topicTag));
  }
  if (featuredOnly) {
    pool = pool.filter((a) => a.isFeatured);
  }
  if (breakingOnly) {
    pool = pool.filter((a) => a.isBreaking);
  }
  if (search && search.trim()) {
    const q = search.toLowerCase();
    pool = pool.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.topicTags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  const paginated = pool.slice(skip, skip + limit);
  return {
    articles: paginated,
    totalCount: pool.length,
    totalPages: Math.ceil(pool.length / limit) || 1,
    currentPage: page,
  };
}

// 4. Fetch Single Article by Slug
export async function getArticleBySlug(slug: string): Promise<FormattedArticle | null> {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
      },
    });
    if (article) return formatArticleRecord(article);
  } catch (err) {
    console.warn("Database query error for article slug:", (err as Error).message);
  }

  const fallback = getFallbackArticles().find((a) => a.slug === slug);
  return fallback || null;
}

// 5. Fetch Breaking Ticker Headlines
export async function getBreakingHeadlines(limit = 5): Promise<FormattedArticle[]> {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: {
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
      },
    });
    if (articles.length > 0) return articles.map(formatArticleRecord);
  } catch (err) {
    console.warn("Database error for breaking headlines:", (err as Error).message);
  }

  return getFallbackArticles().slice(0, limit);
}

// 6. Fetch Hero Stories
export async function getHeroGridStories(): Promise<{
  leadStory: FormattedArticle | null;
  secondaryStories: FormattedArticle[];
}> {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { publishedAt: "desc" },
      take: 4,
      include: {
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
      },
    });

    if (articles.length > 0) {
      const formatted = articles.map(formatArticleRecord);
      const lead = formatted.find((a) => a.isFeatured) || formatted[0];
      const secondaries = formatted.filter((a) => a.id !== lead.id).slice(0, 3);
      return { leadStory: lead, secondaryStories: secondaries };
    }
  } catch (err) {
    console.warn("Database error for hero stories:", (err as Error).message);
  }

  const fallback = getFallbackArticles();
  return {
    leadStory: fallback[0] || null,
    secondaryStories: fallback.slice(1, 4),
  };
}

// 7. Increment Views
export async function incrementViews(slug: string): Promise<number> {
  try {
    const updated = await prisma.article.update({
      where: { slug },
      data: { views: { increment: 1 } },
      select: { views: true },
    });
    return updated.views;
  } catch {
    return localStore.incrementArticleView(slug);
  }
}

// 8. Fetch Related Articles
export async function getRelatedArticles(
  categorySlug: string,
  currentSlug: string,
  limit = 3
): Promise<FormattedArticle[]> {
  try {
    const articles = await prisma.article.findMany({
      where: {
        category: { slug: categorySlug },
        slug: { not: currentSlug },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: {
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
      },
    });
    if (articles.length > 0) return articles.map(formatArticleRecord);
  } catch (err) {
    console.warn("Database error for related articles:", (err as Error).message);
  }

  return getFallbackArticles()
    .filter((a) => a.slug !== currentSlug)
    .slice(0, limit);
}

// 9. Topic Hub Data
export const CURATED_TOPICS = [
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    description: "Frontier foundation models, neural scaling laws, autonomous reasoning systems, and enterprise LLM deployment pipelines.",
    color: "#00f0ff",
  },
  {
    slug: "bitcoin",
    name: "Bitcoin & Institutional Web3",
    description: "Macro bitcoin treasury allocation, spot ETF flows, on-chain mining energetics, and Layer-2 settlement networks.",
    color: "#10b981",
  },
  {
    slug: "semiconductors",
    name: "Semiconductors & Compute",
    description: "Advanced packaging, HBM memory architectures, extreme ultraviolet lithography (EUV), and sovereign silicon supply chains.",
    color: "#38bdf8",
  },
  {
    slug: "venture-capital",
    name: "Venture Capital Deal Flow",
    description: "Early-stage Series A term sheets, vertical AI moat defensibility, enterprise software multiples, and micro-unicorn capitalization.",
    color: "#f43f5e",
  },
  {
    slug: "macroeconomics",
    name: "Global Macro & Central Banking",
    description: "Federal Reserve interest rate trajectories, treasury yield curve shifts, debt refinancing walls, and international trade dynamics.",
    color: "#f59e0b",
  },
];

export async function getArticlesByTopic(topicSlug: string, limit = 12) {
  return getArticles({ topicTag: topicSlug, limit });
}

// 10. Dashboard & Referral Analytics
export async function getAdminDashboardStats() {
  try {
    const [totalArticles, totalViews, totalCategories, totalFeeds, latestCron, topReferrals] =
      await Promise.all([
        prisma.article.count(),
        prisma.article.aggregate({ _sum: { views: true } }),
        prisma.category.count(),
        prisma.feed.count({ where: { isActive: true } }),
        prisma.cronLog.findFirst({ orderBy: { createdAt: "desc" } }),
        prisma.referralVisit.findMany({
          orderBy: { count: "desc" },
          take: 10,
        }),
      ]);

    if (totalArticles > 0 || totalCategories > 0) {
      return {
        totalArticles,
        totalViews: totalViews._sum.views || 0,
        totalCategories,
        totalFeeds,
        latestCron,
        topReferrals: topReferrals || [],
      };
    }
  } catch (err) {
    console.warn("Database not yet reachable for stats, using persistent local store:", (err as Error).message);
  }

  // Return authentic local store stats - real counts, real views, real cron log
  return localStore.getDashboardStats();
}

// 12. Site Settings (AdSense, Auto-Pilot & 50 Blogs/Day Configuration)
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await (prisma as any).siteSetting?.findMany();
    if (settings && settings.length > 0) {
      const map: Record<string, string> = {};
      settings.forEach((s: any) => {
        map[s.key] = s.value;
      });
      return {
        adsEnabled: map.adsEnabled === "true",
        adsenseClientId: map.adsenseClientId || "ca-pub-XXXXXXXXXXXXXXXX",
        autoPilotEnabled: map.autoPilotEnabled !== "false",
        targetDailyArticles: parseInt(map.targetDailyArticles || "50", 10),
        articlesPerRun: parseInt(map.articlesPerRun || "2", 10),
        cronIntervalMinutes: parseInt(map.cronIntervalMinutes || "30", 10),
      };
    }
  } catch (err) {
    // Database table not yet provisioned, use local store
  }
  return localStore.getSettings();
}

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  try {
    for (const [key, val] of Object.entries(updates)) {
      if (val !== undefined) {
        await (prisma as any).siteSetting?.upsert({
          where: { key },
          update: { value: String(val) },
          create: { key, value: String(val) },
        });
      }
    }
  } catch (err) {
    // Database fallback to local store
  }
  return localStore.updateSettings(updates);
}
