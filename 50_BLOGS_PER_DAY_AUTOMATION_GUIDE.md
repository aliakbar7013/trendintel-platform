# TrendIntel.blog — 50 Blogs/Day Autonomous Publishing Blueprint

> **System Objective:** Fully automated, zero-interference publishing of **~50 high-authority, 100% plagiarism-free, SEO-optimized articles per day** inspired by competitor industry feeds, engineered to pass AI detection, qualify for Google Discover, and maximize long-term Google AdSense revenue.

---

## 1. Daily Publication Math & Cadence Breakdown

| Metric | Target Specification | Operational Mechanics |
| :--- | :--- | :--- |
| **Daily Output** | **48 to 52 articles / 24 hours** | ~2.08 articles published per hour |
| **Execution Cadence** | **Every 30 minutes** | 48 automated cycles per day |
| **Batch Size per Cycle** | **1 to 2 articles / cycle** | Alternates between 1 and 2 articles to maintain consistent pacing |
| **Desk Distribution** | **~12–13 articles per desk** | Fair round-robin rotation across AI, Crypto, Finance & Startups |
| **Gemini 2.5 Flash Quota** | **50 requests / 24 hours** | **3.3% of Google's free tier (1,500 requests/day limit)** |
| **Estimated Monthly Cost** | **$0.00 (Free Tier)** | Pay-as-you-go would be < $0.15/month |

---

## 2. Bypassing Google AI Detection & Zero-Plagiarism Architecture

Google's algorithms (**SpamBrain** and the **Helpful Content System**) actively penalize scraped content, line-by-line rewrites, and generic AI text. TrendIntel defeats these checks through a four-stage synthesis pipeline:

### A. Fact-Extraction vs. Prose Separation
The engine **never** copies or rewrites competitor sentences. Instead:
1. It ingests competitor dispatches from 29 monitored feeds as raw structured data.
2. It extracts solely **factual anchors**: company names, funding amounts, dates, hardware specs, regulatory rulings, and direct quotes.
3. The competitor's original narrative and paragraph structures are discarded.
4. Gemini reconstructs the entire story from scratch using the **TrendIntel Institutional Analyst Persona** (modeled after *The Wall Street Journal* and *Bloomberg*).

### B. Banned AI Clichés & Burstiness Enforcement
AI detectors flag synthetic text through repetitive sentence lengths and cliché transitions. TrendIntel enforces a strict negative-prompting ban on 25+ synthetic markers:
* **Banned Words:** `delve`, `tapestry`, `beacon`, `testament`, `crucial role`, `pivotal moment`, `in conclusion`, `moreover`, `furthermore`, `it is important to note`, `fast-paced world`, `game-changer`, `revolutionize`, `dive in`, `unravel`.
* **Burstiness Enforcement:** The system prompt mandates alternating sentence cadences—short, declarative 6-word statements paired with complex, multi-clause institutional analyses.
* **Post-Generation Sanitizer:** `src/lib/quality-gate.ts` automatically strips and replaces any remaining synthetic markers before database insertion.

### C. High Information Gain (Mandatory Structured Tables)
Google prioritizes pages that provide proprietary tabular data. Every single published article automatically includes an HTML `<table>` comparing:
* Strategic dimensions (entity benchmark, market shift, execution timeline, capital reallocation).
* Search engines extract these tables for **Featured Snippets** and **AI Overviews**.

### D. Internal Link Equity Distribution
Before persisting an article, `src/lib/internal-linker.ts` scans the database for top-performing articles in the same category and injects **2 to 3 natural contextual internal links** plus a **"Read Also / Deep Dive"** callout card, strengthening domain authority and crawl efficiency.

---

## 3. Google Discover Carousel Domination Checklist

Google Discover drives significantly higher click-through rates (CTR) than standard search results. The platform enforces all four Discover requirements:

1. **High-Resolution Featured Images ($\ge 1200\text{px}$):**
   * Google Discover requires landscape images with `width >= 1200px`.
   * `src/lib/images.ts` filters Pexels API calls for `width >= 1200` landscape orientation, with high-definition $1600 \times 900$ curated fallbacks.
2. **Global Robots Meta Directive:**
   * Global header configured in `src/app/layout.tsx`:
     `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`
3. **48-Hour Google News XML Sitemap:**
   * Accessible at `/news-sitemap.xml`. Only articles published within the last 48 hours are served using the official `<news:news>` XML namespace.
4. **Direct Answer (TL;DR) Lede:**
   * Every article includes a 45–60 word Direct Answer paragraph directly below the H1 for Featured Snippets.

---

## 4. Competitor Feed Syndicate (29 Active Feeds)

The platform monitors 29 high-volume RSS feeds across four desks:

### AI & Enterprise Tech (6 Feeds)
* TechCrunch AI & Enterprise
* The Verge Tech Wire
* VentureBeat AI Intelligence
* Ars Technica Silicon & Cloud
* Wired Technology & Compute
* Google News Frontier AI

### Crypto & Web3 Markets (6 Feeds)
* CoinDesk Institutional
* Cointelegraph Markets
* Decrypt Web3 Dispatches
* Blockworks Macro & Crypto
* Bitcoin Magazine
* Google News Digital Assets

### Global Macro Finance (6 Feeds)
* Yahoo Finance Global Markets
* CNBC Economy & Central Banks
* MarketWatch Top Intelligence
* Investing.com Macro Economy
* Financial Times Markets Wire
* Google News Global Economy

### Startups & Venture Capital (6 Feeds)
* TechCrunch Startups & Venture
* EU-Startups European Intelligence
* Sifted VC & Scaleup Coverage
* GeekWire Tech Ecosystem
* Tech in Asia Venture Track
* Google News Venture Capital

---

## 5. Fully Autonomous Operation Setup (Zero Interference)

The system can run completely unattended via two parallel mechanisms:

### Method A: Hostinger / cPanel Cron Job (Recommended for Production)
Log into your **Hostinger Control Panel** > **Advanced** > **Cron Jobs**, and configure:

* **Frequency:** Every 30 minutes (`*/30 * * * *`)
* **Command:**
  ```bash
  curl -s "https://trendintel.blog/api/cron/publish?key=trendintel_cron_secure_token_change_in_production_894172" > /dev/null
  ```

### Method B: Built-In Node.js Auto-Pilot (Local & Standalone)
* TrendIntel includes an autonomous background runner in `src/lib/auto-pilot.ts`.
* Accessible in `/admin` under **50 Blogs/Day Blueprint** or the Dashboard overview card.
* When active, the Node.js server automatically triggers publishing cycles on its own internal timer, even if no external cron is configured.

---

## 6. Google AdSense Approval Roadmap (Monetization Strategy)

To secure Google AdSense approval without rejections:

1. **Stage 1 (Current State): Keep Ads OFF on Frontend:**
   * Google AdSense strictly forbids empty ad containers, dashed placeholder boxes, or developer text during domain review.
   * `<AdSlot />` returns `null` across all pages.
2. **Stage 2: Accumulate 50–100 Clean Stories:**
   * Run the auto-pilot for 24–48 hours to build an active archive across all 4 categories.
3. **Stage 3: Submit `trendintel.blog` to Google AdSense:**
   * Reviewers will see a clean, professional, fast-loading newsroom with zero broken placeholders.
4. **Stage 4: Instant Revenue Activation:**
   * Once approved, open `/admin` > **Monetization & Ads**, paste your `ca-pub-XXXXXXXXXXXXXXXX` ID, and click **"SWITCH ADS ON"**. Live ads will instantly appear across all home, category, and article slots.
