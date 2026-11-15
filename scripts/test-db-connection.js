const { PrismaClient } = require('@prisma/client');
const url = 'mysql://u181084554_trendnewss:Aliakbar%407013@srv982.hstgr.io:3306/u181084554_trendnews';
const p = new PrismaClient({ datasources: { db: { url } } });

async function test() {
  try {
    await p.$connect();
    console.log('DATABASE CONNECTION SUCCESS TO u181084554_trendnews!');
    const tables = await p.$queryRawUnsafe('SHOW TABLES');
    console.log('TABLES:', tables);
    await p.$disconnect();
  } catch (err) {
    console.error('DATABASE CONNECTION FAILED:', err.message);
  }
}
test();
