import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { INITIAL_CATEGORIES, STARTER_ARTICLES } from "../src/lib/starter-data";

const prisma = new PrismaClient();

function generateHash(title: string, url: string): string {
  return crypto
    .createHash("sha256")
    .update((url.trim().toLowerCase() + title.trim().toLowerCase()))
    .digest("hex");
}

async function main() {
  console.log("🌱 Starting TrendIntel MySQL Database Seeding...");

  // 1. Seed Categories & Feeds
  for (const catData of INITIAL_CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {
        name: catData.name,
        description: catData.description,
        color: catData.color,
        order: catData.order,
      },
      create: {
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        color: catData.color,
        order: catData.order,
      },
    });

    console.log(`✓ Category ensured: ${category.name} (${category.slug})`);

    for (const feed of catData.feeds) {
      await prisma.feed.upsert({
        where: { url: feed.url },
        update: {
          name: feed.name,
          categoryId: category.id,
          isActive: true,
        },
        create: {
          name: feed.name,
          url: feed.url,
          categoryId: category.id,
          isActive: true,
        },
      });
      console.log(`  └─ Feed registered: ${feed.name}`);
    }
  }

  // 2. Seed Starter High-Signal Articles
  console.log("\n📰 Seeding initial editorial intelligence articles...");
  for (const art of STARTER_ARTICLES) {
    const category = await prisma.category.findUnique({
      where: { slug: art.categorySlug },
    });

    if (!category) continue;

    const hash = generateHash(art.title, art.sourceUrl);

    await prisma.article.upsert({
      where: { slug: art.slug },
      update: {
        title: art.title,
        excerpt: art.excerpt,
        content: art.content,
        keyTakeaways: JSON.stringify(art.keyTakeaways),
        faqs: JSON.stringify(art.faqs),
        featuredImage: art.featuredImage,
        imageCaption: art.imageCaption,
        sourceName: art.sourceName,
        sourceUrl: art.sourceUrl,
        readingTime: art.readingTime,
        isFeatured: art.isFeatured,
        isBreaking: art.isBreaking,
        categoryId: category.id,
      },
      create: {
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        content: art.content,
        keyTakeaways: JSON.stringify(art.keyTakeaways),
        faqs: JSON.stringify(art.faqs),
        featuredImage: art.featuredImage,
        imageCaption: art.imageCaption,
        sourceName: art.sourceName,
        sourceUrl: art.sourceUrl,
        contentHash: hash,
        readingTime: art.readingTime,
        isFeatured: art.isFeatured,
        isBreaking: art.isBreaking,
        categoryId: category.id,
        views: Math.floor(Math.random() * 250) + 120,
      },
    });
    console.log(`✓ Seeded article: ${art.title.slice(0, 50)}...`);
  }

  // 3. Seed an initial CronLog entry
  await prisma.cronLog.create({
    data: {
      status: "SUCCESS",
      feedsScanned: 9,
      articlesPublished: STARTER_ARTICLES.length,
      articlesSkipped: 0,
      durationMs: 1250,
      triggeredBy: "system_seed",
    },
  });

  console.log("\n🚀 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
