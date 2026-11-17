import Parser from "rss-parser";
import { revalidatePath } from "next/cache";
import { prisma, isDatabaseConfigured } from "./prisma";
import { generateContentHash } from "./hasher";
import { extractArticleContent } from "./extractor";
import { synthesizeNewsArticle, countWords } from "./ai";
import { validateArticleQuality } from "./quality-gate";
import { fetchEditorialImage } from "./images";
import { injectInternalLinksAndCallout } from "./internal-linker";
import { notifySearchEnginesAndHubs } from "./ping-engine";
import { sendOutboundWebmention } from "./webmention";
import { pruneUnderperformingArticles } from "./prune";
import { INITIAL_CATEGORIES } from "./starter-data";
import { localStore } from "./local-store";
import { getSiteSettings } from "./db";

export interface PublisherEngineResult {
  status: "SUCCESS" | "PARTIAL" | "ERROR";
  feedsScanned: number;
  articlesPublished: number;
  articlesSkipped: number;
  durationMs: number;
  publishedTitles: string[];
  publishedUrls: string[];
  errors: string[];
}

const parser = new Parser({
  timeout: 4000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
    Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
  },
});

export async function runAutoPublisher(
  triggeredBy: "cron" | "admin_manual" = "cron"
): Promise<PublisherEngineResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const publishedTitles: string[] = [];
  const publishedUrls: string[] = [];
  let feedsScanned = 0;
  let articlesPublished = 0;
  let articlesSkipped = 0;

  console.log(`[AutoPublisher] Starting execution (Triggered by: ${triggeredBy})...`);

  // Run automated crawl-budget content pruning asynchronously (non-blocking)
  if (isDatabaseConfigured() && Math.random() < 0.1) {
    pruneUnderperformingArticles().catch((pruneErr: any) => {
      console.warn("[AutoPublisher] Pruning pass notice:", pruneErr.message);
    });
  }

  try {
    // 1. Fetch active categories and feeds
    let categories: any[] = [];
    if (isDatabaseConfigured()) {
      try {
        categories = await prisma.category.findMany({
          include: {
            feeds: {
              where: { isActive: true },
            },
          },
        });
      } catch (err: any) {
        console.warn("Could not query DB categories directly:", err.message);
      }
    }

    // Fallback if DB empty, not reachable, or not yet seeded
    if (!categories || categories.length === 0) {
      categories = localStore.getCategories();
    }

    // Query site settings for dynamic daily volume control (default 1 article per run for snappy serverless execution)
    let settings = { articlesPerRun: 1 };
    try {
      const liveSettings = await getSiteSettings();
      if (liveSettings) settings = liveSettings;
    } catch {
      // Non-blocking fallback
    }

    // For automated cron runs, strictly publish 1 article per trigger to guarantee sub-8s serverless completion.
    // 48 cron runs per day (every 30 mins) = 48-50 published articles/day without serverless timeout risk.
    const MAX_ARTICLES_PER_RUN = triggeredBy === "cron" ? 1 : Math.max(1, settings.articlesPerRun || 1);

    // Shuffle categories so publication is evenly distributed across AI, Crypto, Finance & Startups
    const randomizedCategories = [...categories].sort(() => Math.random() - 0.5);

    // Scan feeds
    for (const category of randomizedCategories) {
      if (articlesPublished >= MAX_ARTICLES_PER_RUN) break;

      // Filter out feeds that are inactive or use redirect-only proxies (like Google News)
      const categoryFeeds = (category.feeds || []).filter(
        (f: any) => f.isActive !== false && !f.url?.includes("news.google.com")
      );
      const randomizedFeeds = [...categoryFeeds].sort(() => Math.random() - 0.5);

      for (const feed of randomizedFeeds) {
        if (articlesPublished >= MAX_ARTICLES_PER_RUN) break;

        feedsScanned++;
        console.log(`[AutoPublisher] Parsing feed: ${feed.name} (${feed.url})`);

        let feedData;
        try {
          feedData = await parser.parseURL(feed.url);
        } catch (err: any) {
          const errMsg = `Failed to parse feed ${feed.name}: ${err.message}`;
          console.warn(errMsg);
          errors.push(errMsg);
          continue;
        }

        // Evaluate top 5 freshest candidates in the feed
        const items = (feedData.items || []).slice(0, 5);
        console.log(`[AutoPublisher] Found ${items.length} top items in ${feed.name}`);

        for (const item of items) {
          if (articlesPublished >= MAX_ARTICLES_PER_RUN) break;

          const itemTitle = item.title?.trim() || "";
          const itemUrl = item.link?.trim() || "";

          if (!itemTitle || !itemUrl) {
            articlesSkipped++;
            continue;
          }

          // 2. Deduplication check via SHA-256 hash
          const contentHash = generateContentHash(itemTitle, itemUrl);
          try {
            const existing = await prisma.article.findUnique({
              where: { contentHash },
            });
            if (existing) {
              articlesSkipped++;
              continue;
            }
          } catch {
            if (localStore.hasArticleHash(contentHash)) {
              articlesSkipped++;
              continue;
            }
          }

          console.log(`[AutoPublisher] Processing high-signal candidate: "${itemTitle.slice(0, 60)}"`);

          // 3. Fast extraction prioritizing RSS-embedded content (0ms latency)
          let rawContent = "";
          let rawTitle = itemTitle;
          let sourcePublisher = feed.name || item.creator || "Editorial Bureau";

          const feedSnippet = (
            item["content:encoded"] ||
            item.content ||
            item.contentSnippet ||
            item.summary ||
            ""
          )
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();

          if (feedSnippet.length >= 200) {
            rawContent = feedSnippet;
          } else {
            // Only scrape external URL if RSS snippet is too brief
            const extracted = await extractArticleContent(itemUrl, 2000);
            if (extracted && extracted.textContent.length >= 200) {
              rawContent = extracted.textContent;
              rawTitle = extracted.title || itemTitle;
              sourcePublisher = extracted.siteName || sourcePublisher;
            }
          }

          if (!rawContent || rawContent.length < 200) {
            console.log(`[AutoPublisher] Skipping item (insufficient readable text): ${itemUrl}`);
            articlesSkipped++;
            continue;
          }

          // 4. AI Synthesis with Gemini 2.5 Flash
          const synthesis = await synthesizeNewsArticle({
            rawTitle,
            rawContent,
            sourceName: sourcePublisher,
            categoryName: category.name,
          });

          if (!synthesis) {
            errors.push(`AI synthesis failed for: "${itemTitle.slice(0, 50)}"`);
            articlesSkipped++;
            continue;
          }

          // 5. Automated Quality Gate
          const quality = await validateArticleQuality(synthesis);
          if (!quality.passed || !quality.sanitizedArticle) {
            console.warn(`[AutoPublisher] Quality gate rejected story: ${quality.reason}`);
            errors.push(`Quality gate rejected "${itemTitle.slice(0, 40)}": ${quality.reason}`);
            articlesSkipped++;
            continue;
          }

          const approved = quality.sanitizedArticle;

          // 6. Automated Internal Link Graph & Deep Dive Callout Injection
          let finalContent = approved.content;
          try {
            const existingArticles = await prisma.article.findMany({
              where: { categoryId: category.id },
              select: { title: true, slug: true, excerpt: true, views: true },
              orderBy: { views: "desc" },
              take: 10,
            });

            if (existingArticles.length > 0) {
              finalContent = injectInternalLinksAndCallout(
                approved.content,
                approved.slug,
                existingArticles
              );
            }
          } catch (linkErr: any) {
            console.warn("Internal linking fallback notice:", linkErr.message);
          }

          // 7. Automated Photo Journalism
          const imageResult = await fetchEditorialImage(
            approved.pexelsSearchQuery,
            category.slug
          );

          // Calculate estimated reading time
          const readingTime = Math.max(3, Math.ceil(countWords(finalContent) / 200));

          // 8. Insert into MySQL Article table
          try {
            let articleSaved = false;
            try {
              await prisma.article.create({
                data: {
                  title: approved.title,
                  seoTitle: approved.seoTitle || approved.title,
                  slug: approved.slug,
                  focusKeyword: approved.focusKeyword || null,
                  excerpt: approved.metaDescription,
                  tldr: approved.tldr,
                  content: finalContent,
                  keyTakeaways: JSON.stringify(approved.keyTakeaways),
                  faqs: JSON.stringify(approved.faqs),
                  trendStat: approved.trendStat ? JSON.stringify(approved.trendStat) : null,
                  topicTags: approved.topicTags ? JSON.stringify(approved.topicTags) : null,
                  featuredImage: imageResult.url,
                  imageCaption: imageResult.caption,
                  sourceName: sourcePublisher,
                  sourceUrl: itemUrl,
                  contentHash,
                  readingTime,
                  isFeatured: articlesPublished === 0, // Promote first article in run
                  isBreaking: articlesPublished === 0,
                  isIndexed: true,
                  categoryId: category.id,
                },
              });
              articleSaved = true;
            } catch (insertErr: any) {
              console.warn("[AutoPublisher] MySQL insert failed, persisting to local store:", insertErr.message);
              try {
                localStore.addArticle({
                  title: approved.title,
                  seoTitle: approved.seoTitle || approved.title,
                  slug: approved.slug,
                  focusKeyword: approved.focusKeyword || null,
                  excerpt: approved.metaDescription,
                  tldr: approved.tldr,
                  content: finalContent,
                  keyTakeaways: approved.keyTakeaways,
                  faqs: approved.faqs,
                  trendStat: approved.trendStat,
                  topicTags: approved.topicTags,
                  featuredImage: imageResult.url,
                  imageCaption: imageResult.caption,
                  sourceName: sourcePublisher,
                  sourceUrl: itemUrl,
                  contentHash,
                  readingTime,
                  isFeatured: articlesPublished === 0,
                  isBreaking: articlesPublished === 0,
                  isIndexed: true,
                  categoryId: category.id,
                });
                articleSaved = true;
              } catch (localErr: any) {
                console.error("[AutoPublisher] Local store write failed:", localErr.message);
                errors.push(`Storage Error: ${localErr.message}`);
              }
            }

            if (articleSaved) {
              articlesPublished++;
              publishedTitles.push(approved.title);
              const canonicalArticleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://trendintel.blog"}/article/${approved.slug}`;
              publishedUrls.push(canonicalArticleUrl);
              console.log(`[AutoPublisher] ✓ Successfully published: "${approved.title}"`);

              // 9. Dispatch Outbound Webmention in background
              sendOutboundWebmention(canonicalArticleUrl, itemUrl).catch(() => {});
            }
          } catch (itemErr: any) {
            console.error("[AutoPublisher] Processing error for item:", itemErr.message);
            errors.push(`Item Error: ${itemErr.message}`);
          }
        }
      }
    }

    // 10. Cache Revalidation & Real-Time Pinging
    if (articlesPublished > 0) {
      try {
        revalidatePath("/");
        revalidatePath("/sitemap.xml");
        revalidatePath("/news-sitemap.xml");
        revalidatePath("/llms.txt");
        revalidatePath("/feed.xml");
        revalidatePath("/feed.json");
        for (const cat of categories) {
          revalidatePath(`/category/${cat.slug}`);
          revalidatePath(`/category/${cat.slug}/feed.xml`);
        }
      } catch (cacheErr: any) {
        console.warn("Revalidation notice:", cacheErr.message);
      }

      // Notify IndexNow, WebSub & Search Engines in background without blocking response
      notifySearchEnginesAndHubs(publishedUrls).catch((pingErr: any) => {
        console.warn("Search engine ping notice:", pingErr.message);
      });
    }
  } catch (globalErr: any) {
    console.error("[AutoPublisher] Global engine error:", globalErr.message);
    errors.push(`Engine exception: ${globalErr.message}`);
  }

  const durationMs = Date.now() - startTime;
  const status: "SUCCESS" | "PARTIAL" | "ERROR" =
    errors.length === 0
      ? "SUCCESS"
      : articlesPublished > 0
      ? "PARTIAL"
      : "ERROR";

  // 11. Record execution in MySQL or LocalStore CronLog
  try {
    await prisma.cronLog.create({
      data: {
        status,
        feedsScanned,
        articlesPublished,
        articlesSkipped,
        errors: errors.length > 0 ? errors.join("\n") : null,
        durationMs,
        triggeredBy,
      },
    });
  } catch (logErr: any) {
    console.warn("Could not write to MySQL CronLog, persisting to local store:", logErr.message);
    try {
      localStore.addCronLog({
        status,
        feedsScanned,
        articlesPublished,
        articlesSkipped,
        errors: errors.length > 0 ? errors.join("\n") : null,
        durationMs,
        triggeredBy,
      });
    } catch (localLogErr: any) {
      console.warn("Could not write to localStore cron logs:", localLogErr.message);
    }
  }

  console.log(
    `[AutoPublisher] Finished in ${durationMs}ms: Published ${articlesPublished}, Skipped ${articlesSkipped}, Status: ${status}`
  );

  return {
    status,
    feedsScanned,
    articlesPublished,
    articlesSkipped,
    durationMs,
    publishedTitles,
    publishedUrls,
    errors,
  };
}
