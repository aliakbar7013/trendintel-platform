require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function run() {
  const articles = await p.article.findMany({
    include: { category: true },
    orderBy: { publishedAt: 'desc' }
  });
  console.log('Total articles in DB:', articles.length);
  articles.forEach((a, i) => {
    console.log(`[${i + 1}] Category: ${a.category?.name} | Slug: ${a.slug}`);
    console.log(`    Title: ${a.title}`);
    console.log(`    PublishedAt: ${a.publishedAt}`);
    console.log(`    FocusKeyword: ${a.focusKeyword}`);
  });

  const categories = await p.category.findMany();
  console.log('\nCategories:');
  categories.forEach(c => console.log(`- ${c.name} (id: ${c.id}, slug: ${c.slug})`));

  await p.$disconnect();
}
run().catch(console.error);
