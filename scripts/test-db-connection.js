require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const url = process.env.DATABASE_URL || 'mysql://localhost:3306/trendintel';
const p = new PrismaClient({ datasources: { db: { url } } });

async function test() {
  try {
    await p.$connect();
    console.log('DATABASE CONNECTION SUCCESS TO u181084554_trendnews!');
    const articleCount = await p.article.count();
    console.log('TOTAL ARTICLES IN DB:', articleCount);
    const cronLogs = await p.cronLog.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
    console.log('RECENT CRON LOGS:', JSON.stringify(cronLogs, null, 2));
    await p.$disconnect();
  } catch (err) {
    console.error('DATABASE CONNECTION FAILED:', err.message);
  }
}
test();
