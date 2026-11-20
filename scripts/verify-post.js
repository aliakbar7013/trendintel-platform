require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function test() {
  const article = await p.article.findUnique({
    where: { slug: 'federal-reserve-autonomous-ai-swarms-flash-bank-runs' },
    include: { category: true }
  });
  console.log('--- VERIFIED ARTICLE IN HOSTINGER MYSQL DB ---');
  console.log('ID:', article.id);
  console.log('Title:', article.title);
  console.log('Category:', article.category.name, `(${article.category.slug})`);
  console.log('Focus Keyword:', article.focusKeyword);
  console.log('Meta Description (Excerpt):', article.excerpt, `(${article.excerpt.length} chars)`);
  console.log('Word count:', article.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length);
  console.log('Takeaways:', JSON.parse(article.keyTakeaways));
  console.log('FAQs count:', JSON.parse(article.faqs).length);
  console.log('Trend Stat:', JSON.parse(article.trendStat));
  console.log('Topic Tags:', JSON.parse(article.topicTags));
  console.log('Published At:', article.publishedAt);
  console.log('Canonical URL:', `https://trendintel.blog/article/${article.slug}`);

  // Test local-store.json
  const store = JSON.parse(require('fs').readFileSync('data/local-store.json', 'utf8'));
  const localMatch = store.articles.find(a => a.slug === article.slug);
  console.log('\n--- VERIFIED ARTICLE IN LOCAL-STORE.JSON ---');
  console.log('Found in local store:', !!localMatch);
  console.log('Local store title:', localMatch?.title);

  await p.$disconnect();
}

test().catch(console.error);
