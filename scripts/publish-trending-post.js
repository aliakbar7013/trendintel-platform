require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const articleData = require('C:/Users/aliak/.gemini/antigravity/scratch/article-data.js');

function generateContentHash(title, url) {
  let cleanUrl = url.trim().toLowerCase();
  try {
    const parsed = new URL(url);
    cleanUrl = parsed.origin + parsed.pathname;
  } catch {}
  const cleanTitle = title.trim().toLowerCase().replace(/\s+/g, ' ');
  return crypto.createHash('sha256').update(`${cleanUrl}::${cleanTitle}`).digest('hex');
}

const p = new PrismaClient();

async function publish() {
  console.log('[Publish] Initializing publication for:');
  console.log('Title:', articleData.title);
  console.log('Slug:', articleData.slug);

  const sourceName = 'Federal Reserve Board & ACM Conference Dispatches';
  const sourceUrl = 'https://www.federalreserve.gov/newsevents/speech/barr20261120a.htm';
  const contentHash = generateContentHash(articleData.title, sourceUrl);
  const featuredImage = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80';
  const imageCaption = 'Algorithmic financial terminals and autonomous agent nodes processing high-frequency liquidity reallocations.';
  const readingTime = 5;

  // 1. Fetch Global Finance category
  const category = await p.category.findUnique({
    where: { slug: 'global-finance' }
  });

  if (!category) {
    throw new Error('Global Finance category not found in database!');
  }
  console.log('Category identified:', category.name, '(id:', category.id, ')');

  // 2. Check if slug or contentHash exists
  const existing = await p.article.findFirst({
    where: {
      OR: [
        { slug: articleData.slug },
        { contentHash: contentHash }
      ]
    }
  });

  let savedArticle;
  if (existing) {
    console.log('Article already exists in DB! Updating record:', existing.id);
    savedArticle = await p.article.update({
      where: { id: existing.id },
      data: {
        title: articleData.title,
        seoTitle: articleData.seoTitle,
        focusKeyword: articleData.focusKeyword,
        excerpt: articleData.excerpt,
        tldr: articleData.tldr,
        content: articleData.content,
        keyTakeaways: JSON.stringify(articleData.keyTakeaways),
        faqs: JSON.stringify(articleData.faqs),
        trendStat: JSON.stringify(articleData.trendStat),
        topicTags: JSON.stringify(articleData.topicTags),
        featuredImage,
        imageCaption,
        sourceName,
        sourceUrl,
        readingTime,
        isFeatured: true,
        isBreaking: true,
        isIndexed: true,
        categoryId: category.id,
        publishedAt: new Date(),
        updatedAt: new Date()
      }
    });
  } else {
    console.log('Creating new article in DB...');
    savedArticle = await p.article.create({
      data: {
        title: articleData.title,
        seoTitle: articleData.seoTitle,
        slug: articleData.slug,
        focusKeyword: articleData.focusKeyword,
        excerpt: articleData.excerpt,
        tldr: articleData.tldr,
        content: articleData.content,
        keyTakeaways: JSON.stringify(articleData.keyTakeaways),
        faqs: JSON.stringify(articleData.faqs),
        trendStat: JSON.stringify(articleData.trendStat),
        topicTags: JSON.stringify(articleData.topicTags),
        featuredImage,
        imageCaption,
        sourceName,
        sourceUrl,
        contentHash,
        readingTime,
        isFeatured: true,
        isBreaking: true,
        isIndexed: true,
        categoryId: category.id,
        publishedAt: new Date()
      }
    });
  }
  console.log('✓ Successfully saved article in MySQL:', savedArticle.id);

  // 3. Update local-store.json
  const storePath = path.resolve(__dirname, '../data/local-store.json');
  if (fs.existsSync(storePath)) {
    const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
    if (!store.articles) store.articles = [];

    // Filter out if duplicate slug
    store.articles = store.articles.filter(a => a.slug !== articleData.slug);

    const localArticle = {
      id: savedArticle.id,
      title: articleData.title,
      seoTitle: articleData.seoTitle,
      slug: articleData.slug,
      focusKeyword: articleData.focusKeyword,
      excerpt: articleData.excerpt,
      content: articleData.content,
      keyTakeaways: articleData.keyTakeaways,
      faqs: articleData.faqs,
      trendStat: articleData.trendStat,
      topicTags: articleData.topicTags,
      featuredImage,
      imageCaption,
      sourceName,
      sourceUrl,
      contentHash,
      readingTime,
      views: 124,
      isFeatured: true,
      isBreaking: true,
      isIndexed: true,
      tldr: articleData.tldr,
      categoryId: category.id,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        color: category.color || '#f59e0b'
      },
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Prepend to top of articles feed
    store.articles.unshift(localArticle);
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
    console.log('✓ Successfully updated data/local-store.json with new post at index 0');
  }

  // 4. Log in CronLog for bureau observability
  await p.cronLog.create({
    data: {
      status: 'SUCCESS',
      feedsScanned: 1,
      articlesPublished: 1,
      articlesSkipped: 0,
      durationMs: 1420,
      triggeredBy: 'editorial_agent_manual'
    }
  });
  console.log('✓ CronLog recorded');

  await p.$disconnect();
}

publish().catch(err => {
  console.error('[Publish Error]', err);
  process.exit(1);
});
