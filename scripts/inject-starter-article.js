const fs = require('fs');
const path = require('path');
const articleData = require('C:/Users/aliak/.gemini/antigravity/scratch/article-data.js');

const starterPath = path.resolve(__dirname, '../src/lib/starter-data.ts');
let code = fs.readFileSync(starterPath, 'utf8');

if (code.includes(articleData.slug)) {
  console.log('Article already in starter-data.ts');
  process.exit(0);
}

const newEntry = `  {
    title: ${JSON.stringify(articleData.title)},
    seoTitle: ${JSON.stringify(articleData.seoTitle)},
    slug: ${JSON.stringify(articleData.slug)},
    focusKeyword: ${JSON.stringify(articleData.focusKeyword)},
    excerpt: ${JSON.stringify(articleData.excerpt)},
    tldr: ${JSON.stringify(articleData.tldr)},
    categorySlug: "global-finance",
    featuredImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80",
    imageCaption: "Algorithmic financial terminals and autonomous agent nodes processing high-frequency liquidity reallocations.",
    sourceName: "Federal Reserve Board & ACM Conference Dispatches",
    sourceUrl: "https://www.federalreserve.gov/newsevents/speech/barr20261120a.htm",
    readingTime: 5,
    isFeatured: true,
    isBreaking: true,
    keyTakeaways: ${JSON.stringify(articleData.keyTakeaways, null, 6)},
    trendStat: ${JSON.stringify(articleData.trendStat, null, 6)},
    topicTags: ${JSON.stringify(articleData.topicTags, null, 6)},
    faqs: ${JSON.stringify(articleData.faqs, null, 6)},
    content: ${JSON.stringify(articleData.content)}
  },
`;

const needle = 'export const STARTER_ARTICLES: StarterArticle[] = [\n';
if (!code.includes(needle)) {
  console.error('Could not find needle in starter-data.ts');
  process.exit(1);
}

code = code.replace(needle, needle + newEntry);
fs.writeFileSync(starterPath, code, 'utf8');
console.log('✓ Successfully injected article into src/lib/starter-data.ts');
