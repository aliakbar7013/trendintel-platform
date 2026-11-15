# TrendIntel (trendintel.blog)
### Autonomous News & Trend Publishing Platform with Automated Backlink & Internal Link Engine

An enterprise-grade, fully automated editorial news intelligence platform engineered specifically for **Hostinger Node.js Web Hosting + Hostinger MySQL**. 

TrendIntel continuously ingests high-signal wire feeds, applies SHA-256 cryptographic deduplication, extracts clean text via Mozilla Readability, synthesizes original in-depth news analysis with Google Gemini 2.5 Flash, fetches contextual photography from Pexels, distributes internal link equity via an automated link graph, attracts natural external citations via shareable stat widgets and embed tools, and publishes directly to MySQL with instant cache revalidation.

---

## 1. Architecture & Backlink Engine Highlights

- **Next.js 15+ App Router:** Server-Side Rendering (SSR) for immediate, zero-latency Googlebot and search engine indexing.
- **Self-Contained (Zero External Daemons):** Operates entirely within standard Node.js 22 LTS + Hostinger MySQL without needing Redis or external background message workers.
- **Automated Internal Link Graph (`lib/internal-linker.ts`):** Automatically injects 2 to 3 contextual internal links within article paragraphs and dynamically places a mid-article **"⚡ Related Intelligence Brief / Deep Dive"** callout card linking to the highest-performing related story.
- **Backlink Magnet Features:**
  - **Market Snapshot & Quantitative Trend Stat Box:** Formats key data points (e.g., `100,000+ Units · +240% YoY`) into shareable visual cards with a one-click citation copy button.
  - **"Cite or Embed This Analysis" One-Click Widget:** Provides ready-to-copy HTML backlinks, Markdown citations, and APA references to make backlinking frictionless for journalists and bloggers.
  - **Public Topic & Trend Hub Pages (`/trends/[topic]`):** Evergreen dossiers (e.g., `/trends/artificial-intelligence`, `/trends/bitcoin`, `/trends/venture-capital`) aggregating timelines of coverage and stats to serve as high-authority reference assets.
- **Automated Syndication & Pingback Engine:**
  - Full-site RSS 2.0 (`/feed.xml`), JSON Feed 1.1 (`/feed.json`), and Category RSS (`/category/[slug]/feed.xml`) for auto-syndication across Google News Publisher Center, Flipboard, Feedly, and aggregator bots.
  - **Search Engine Pings (`lib/ping-engine.ts`):** Immediately notifies **IndexNow** (Bing, Yandex, Naver, Seznam) and **WebSub/PubSubHubbub** hubs upon publishing.
  - **Outbound Webmentions (`lib/webmention.ts`):** Automatically sends W3C Webmention notifications to cited external publications to secure backlinks in their comments or mentions sections.
- **Admin Backlink & Outreach Tracker (`/admin`):**
  - Live incoming referral traffic domain monitor (tracking visits from Hacker News, TechCrunch, Flipboard, etc.).
  - Curated high-DA directory submission checklist (Google News, Bing PubHub, Flipboard, Feedspot).
  - **AI Outreach Pitch Generator:** One-click generation of personalized email pitches to send to journalists covering each story.

---

## 2. Directory Structure

```
trendintel-platform/
├── prisma/
│   ├── schema.prisma                  # MySQL Schema (Category, Feed, Article, CronLog, ContactMessage, ReferralVisit)
│   └── seed.ts                        # Seed data for categories, feeds & initial stories
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/page.tsx         # Secure admin login terminal
│   │   │   └── page.tsx               # Admin Bureau Control Dashboard
│   │   ├── api/
│   │   │   ├── admin/                 # Secured admin APIs (publish-now, articles, feeds, outreach, logs)
│   │   │   ├── analytics/referral/    # Incoming backlink referral tracking API
│   │   │   ├── articles/[slug]/view/  # Real-time view count tracking API
│   │   │   ├── contact/               # Contact message processor saving to MySQL
│   │   │   ├── cron/prune/            # Automated crawl-budget content pruning route
│   │   │   └── cron/publish/          # Hostinger Cron endpoint protected by CRON_SECRET
│   │   ├── article/[slug]/page.tsx    # Journalistic article with TL;DR box, Trend Stat, Deep Dive & Cite widgets
│   │   ├── category/[slug]/           # Category archive with paginated feeds & category RSS
│   │   ├── trends/                    # Topic & Trend Hub directory
│   │   │   ├── [topic]/page.tsx       # Evergreen topic dossier (/trends/artificial-intelligence)
│   │   │   └── page.tsx               # All topic hubs overview
│   │   ├── search/page.tsx            # Full-text archive search engine
│   │   ├── about/page.tsx             # Bureau mission & technological architecture
│   │   ├── contact/page.tsx           # Contact & press portal saving messages to MySQL
│   │   ├── editorial-policy/page.tsx  # AI news workflow disclosure, attribution rules & corrections policy
│   │   ├── privacy-policy/page.tsx    # GDPR/CCPA & Google AdSense compliance
│   │   ├── terms/page.tsx             # Terms of Service & financial disclaimer
│   │   ├── feed.xml/route.ts          # RSS 2.0 Full Feed
│   │   ├── feed.json/route.ts         # JSON Feed 1.1 Specification
│   │   ├── globals.css                # Dark editorial theme, ticker animations, glassmorphism
│   │   ├── icon.tsx                   # Dynamic high-resolution favicon
│   │   ├── layout.tsx                 # Root layout with Discover meta tags, schemas & Webmention discovery
│   │   ├── llms.txt/route.ts          # Machine-readable directory for Perplexity, SearchGPT & AI engines
│   │   ├── news-sitemap.xml/route.ts  # Google News 48-hour XML sitemap (news:news namespace)
│   │   ├── page.tsx                   # Homepage (Breaking wire, market pulse, hero grid, category tabs)
│   │   ├── robots.ts                  # Dynamic robots.txt pointing to both sitemaps & allowing AI bots
│   │   └── sitemap.ts                 # Dynamic XML sitemap (excludes pruned low-signal articles)
│   ├── components/
│   │   ├── admin/AdminDashboard.tsx   # Bureau console with Backlink Monitor & Outreach Generator
│   │   ├── AdSlot.tsx                 # Google AdSense placeholders
│   │   ├── ArticleCard.tsx            # High-contrast magazine card
│   │   ├── BreakingTicker.tsx         # Live marquee breaking news bar
│   │   ├── CategoryFilterTabs.tsx     # Reactive category tab filter
│   │   ├── CiteWidget.tsx             # One-click HTML, Markdown, and APA backlink generator
│   │   ├── FAQSection.tsx             # Structured reader FAQ block
│   │   ├── Footer.tsx                 # Global footer with syndication links
│   │   ├── HeroGrid.tsx               # 1 Lead story + 3 Secondary trending stories
│   │   ├── KeyTakeawaysCard.tsx       # Executive takeaways summary box
│   │   ├── Navbar.tsx                 # Sticky navigation with live emerald pulse & Trend Hubs link
│   │   ├── ReadingProgressBar.tsx     # Reading progress indicator
│   │   ├── ReferralTracker.tsx        # Lightweight client referral tracking component
│   │   ├── SocialShare.tsx            # Social share & copy link tools
│   │   ├── SourceAttribution.tsx      # Transparent source attribution box
│   │   └── TrendStatWidget.tsx        # Shareable quantitative market benchmark card
│   └── lib/
│       ├── ai.ts                      # Gemini 2.5 Flash SDK synthesis with trend stats & topic tags
│       ├── auth.ts                    # HMAC-SHA256 admin session security
│       ├── db.ts                      # Prisma MySQL data access layer with zero-downtime fallback
│       ├── extractor.ts               # Mozilla Readability + JSDOM full-text extraction
│       ├── hasher.ts                  # SHA-256 deduplication hashing
│       ├── images.ts                  # Pexels API photo journalism + category fallback pools
│       ├── internal-linker.ts         # Automated internal link equity distribution & deep-dive injection
│       ├── ping-engine.ts             # IndexNow, WebSub & sitemap ping dispatcher
│       ├── prisma.ts                  # Singleton PrismaClient
│       ├── publisher-engine.ts        # End-to-end auto-publishing pipeline with internal links & pings
│       ├── quality-gate.ts            # Word count (>=450), refusal filter & unique slug validator
│       ├── starter-data.ts            # Pre-seeded categories, feeds, and articles with trend stats
│       └── webmention.ts              # Outbound W3C Webmention notifier
├── .env.example
├── next.config.ts                     # Standalone build configuration for Hostinger Node.js
├── package.json                       # Compatible with Node.js 22 LTS
├── tailwind.config.ts                 # Editorial color palette & typography
└── tsconfig.json
```

---

## 3. Environment Variables

Create a `.env` file in the root directory (or configure them in Hostinger hPanel):

```env
# Database Configuration (Hostinger MySQL)
# Format: mysql://USER:PASSWORD@127.0.0.1:3306/DATABASE_NAME
DATABASE_URL="mysql://u123456789_trenduser:YourSecureDbPassword123!@127.0.0.1:3306/u123456789_trendintel"

# Google Gemini API Key (Required for AI Synthesis)
# Obtain free key: https://aistudio.google.com/
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# Pexels API Key (Optional for automated high-res photos)
# Obtain free key: https://www.pexels.com/api/
PEXELS_API_KEY="YourPexelsApiKeyHere"

# Secret Token Protecting /api/cron/publish
CRON_SECRET="trendintel_secure_cron_token_894172"

# Admin Control Panel Password for /admin
ADMIN_PASSWORD="TrendIntelBureauAdminPass2025!"

# Public Canonical URL
NEXT_PUBLIC_SITE_URL="https://trendintel.blog"

# Optional IndexNow Verification Key
INDEXNOW_KEY="trendintel_indexnow_verified_key"
```

---

## 4. Hostinger Node.js + MySQL Step-by-Step Deployment

### Step A: Create MySQL Database in Hostinger
1. In **Hostinger hPanel**, go to **Databases** > **MySQL Databases**.
2. Create a new database:
   - Database Name: `u123456789_trendintel`
   - Username: `u123456789_trenduser`
   - Password: Choose a strong password.
3. Note your connection string (Hostinger MySQL runs locally on `127.0.0.1:3306`):
   ```
   mysql://u123456789_trenduser:YourPassword@127.0.0.1:3306/u123456789_trendintel
   ```

### Step B: Configure Hostinger Node.js Application
1. In hPanel, navigate to **Advanced** > **Node.js**.
2. Create or configure the application:
   - **Node.js version:** Select `Node.js 22 LTS` (or 20+).
   - **Application mode:** `Production`.
   - **Application root:** `/home/u123456789/domains/trendintel.blog/public_html`
   - **Application startup file:** `.next/standalone/server.js` (or `node_modules/next/dist/bin/next` with argument `start`).
3. Add your environment variables in the hPanel Node.js dashboard.

### Step C: Deploy Code & Initialize Database
Connect via Hostinger SSH or Terminal:

```bash
cd /home/u123456789/domains/trendintel.blog/public_html

# 1. Install dependencies
npm install

# 2. Push Prisma Schema to Hostinger MySQL
npx prisma generate
npx prisma db push

# 3. Seed initial categories, feeds & starter articles
npm run db:seed

# 4. Build Next.js for production
npm run build

# 5. Mirror static assets for standalone server (if using server.js)
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public 2>/dev/null || true

# 6. Restart the application in Hostinger hPanel
```

---

## 5. Setting Up the Hostinger Automated Cron Job

To run the auto-blogging and pingback engine automatically every 30 minutes:

1. In Hostinger hPanel, go to **Advanced** > **Cron Jobs**.
2. Select **Custom** schedule (`*/30 * * * *`).
3. Enter the execution command:
   ```bash
   curl -s "https://trendintel.blog/api/cron/publish?key=trendintel_secure_cron_token_894172" > /dev/null
   ```

Each run executes:
- Ingestion of active category RSS feeds.
- Cryptographic deduplication.
- Full-text extraction with paywall skipping.
- AI synthesis with trend stats & topic tags.
- Programmatic quality gate verification.
- Contextual internal linking & deep-dive card injection.
- Pexels photography retrieval.
- Database storage and cache revalidation.
- IndexNow, WebSub hub, and outbound Webmention pinging.

---

## 6. Accessing the Admin Bureau & Backlink Engine (`/admin`)

1. Open `https://trendintel.blog/admin` in your browser.
2. Enter your `ADMIN_PASSWORD`.
3. In the Bureau Dashboard:
   - **Run Auto-Publisher Now:** Trigger live publishing on demand.
   - **Backlinks & Syndication Tab:** View incoming referral traffic domains, copy ready-to-submit RSS and JSON feeds, and review the directory submission checklist.
   - **AI Outreach Pitch Generator:** Click the **Pitch** button next to any article to generate a personalized email pitch for reporters and bloggers.
   - **Article & Feed Managers:** Edit articles, add categories, and toggle individual RSS feeds.

---

## 7. Technical SEO, Google Discover, GEO & Content Pruning

TrendIntel incorporates cutting-edge technical optimizations designed to capture prime search real estate and dominate generative search engines:

### A. Google Discover & Rich Snippets
- **Global Robots Directives:** Configured with `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />` to unlock Google Discover carousel and rich visual search eligibility.
- **High-Resolution Photography (`>= 1200px`):** The automated Pexels pipeline (`lib/images.ts`) strictly filters for landscape images where `width >= 1200 && height >= 675`, satisfying Google Discover's minimum resolution criteria.

### B. 48-Hour Google News Sitemap (`/news-sitemap.xml`)
- Dedicated Google News sitemap implementing the official `xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"` namespace.
- Strictly serves indexed articles published within the last 48 hours for rapid crawler discovery.

### C. Generative Engine Optimization (GEO) & Machine-Readable Directory (`/llms.txt`)
- Accessible at `https://trendintel.blog/llms.txt` following the emerging web standard for AI search engines (Perplexity, SearchGPT, Claude, Gemini).
- Provides a clean Markdown directory outlining editorial focus, category feeds, evergreen topic hubs, and the 25 most recent canonical article links with one-sentence summaries.
- `robots.txt` explicitly permits `GPTBot`, `PerplexityBot`, and `ClaudeBot`.

### D. Information Gain & Answer Engine Optimization (AEO)
- **Direct Answer / TL;DR Box:** Every AI-synthesized article generates a sharp 45–60 word direct summary positioned immediately beneath the main H1 heading, engineered to capture Google Featured Snippets and AI Overviews.
- **Structured Data Tables:** The Gemini prompt converts quantitative comparisons and technical specifications into clean, accessible HTML `<table>` elements.
- **Future-Looking Analysis:** Articles conclude with an analytical "Broader Context & What Happens Next" section to deliver genuine information gain beyond raw wire reporting.

### E. Automated Crawl Budget & Content Pruning Guardrail
- Database schema tracks `isIndexed: Boolean` on all articles.
- The pruning engine (`lib/prune.ts`) runs automatically during each auto-publish cycle or via a dedicated endpoint (`/api/cron/prune?key=...`).
- Any article older than 45 days with fewer than 10 total views is automatically transitioned to `isIndexed: false`.
- Pruned articles receive `<meta name="robots" content="noindex, follow" />` and are excluded from XML sitemaps, preserving search engine crawl budget strictly for high-performing, authoritative pages.

### F. End-to-End On-Page & Structured Data SEO Architecture
Every published article is systematically optimized for search engine bots:
- **Focus Keyword Targeting:** Gemini identifies primary 2-to-4 word search entities and naturally integrates them into the title, meta description, direct answer, headings, and body opening.
- **SERP-Calibrated Meta Tags:** High-CTR `<title>` (<60 characters with entity up front) and `<meta name="description">` (145–155 characters) guaranteeing zero search result truncation.
- **Triple JSON-LD Structured Data Schema:**
  - **`NewsArticle`:** Includes `speakable` specification for Google Assistant & AI Overviews, `ImageObject` (1200x675), `wordCount`, `NewsMediaOrganization` publisher, and ISO 8601 timestamps.
  - **`BreadcrumbList`:** Rich SERP navigation hierarchy (`Home > Category > Article`).
  - **`FAQPage`:** Injects structured question-and-answer pairs to trigger Google expandable FAQ rich snippets in search results.
- **Semantic Microdata Markup:** Emits HTML5 microdata (`itemScope`, `itemType="https://schema.org/NewsArticle"`, `itemProp="headline"`, `itemProp="abstract"`, `itemProp="articleBody"`).
- **Core Web Vitals & Image Optimization:** Hero images load with `priority` and responsive `sizes` for sub-second Largest Contentful Paint (LCP).
- **Quality Gate SEO Enforcement (`lib/quality-gate.ts`):** Programmatically validates word count ($\ge 450$ words), heading hierarchy (minimum two `<h2>` tags), and non-empty featured snippet answers.
