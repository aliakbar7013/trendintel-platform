require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function run() {
  const tables = await p.$queryRawUnsafe('SHOW TABLES');
  console.log('Tables:', tables);

  const articlesCount = await p.article.count();
  console.log('Article count:', articlesCount);

  // Check the last 15 articles in DB
  const articles = await p.article.findMany({
    take: 15,
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      category: { select: { name: true, slug: true } }
    }
  });
  console.log('Recent articles:', JSON.stringify(articles, null, 2));

  await p.$disconnect();
}

run().catch(console.error);
