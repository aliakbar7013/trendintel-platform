import { prisma } from "./prisma";

export async function pruneUnderperformingArticles(): Promise<{ prunedCount: number }> {
  try {
    const fortyFiveDaysAgo = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000);

    // Automatically set isIndexed = false for articles older than 45 days with fewer than 10 views
    const result = await prisma.article.updateMany({
      where: {
        publishedAt: { lt: fortyFiveDaysAgo },
        views: { lt: 10 },
        isIndexed: true,
      },
      data: {
        isIndexed: false,
      },
    });

    if (result.count > 0) {
      console.log(`[ContentPruning] De-indexed ${result.count} stale/underperforming articles to optimize crawl budget.`);
    }

    return { prunedCount: result.count };
  } catch (err: any) {
    console.warn("[ContentPruning] Pruning notice:", err.message);
    return { prunedCount: 0 };
  }
}
