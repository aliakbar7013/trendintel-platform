import fs from "fs";
import path from "path";
import os from "os";
import { STARTER_ARTICLES, INITIAL_CATEGORIES } from "./starter-data";
import { injectInternalLinksAndCallout } from "./internal-linker";

export interface StoredArticle {
  id: string;
  title: string;
  seoTitle: string;
  slug: string;
  focusKeyword: string | null;
  excerpt: string;
  content: string;
  keyTakeaways: string[];
  faqs: Array<{ question: string; answer: string }>;
  trendStat: {
    metric: string;
    label: string;
    context: string;
    trendDirection?: "up" | "down" | "neutral";
  } | null;
  topicTags: string[];
  featuredImage: string;
  imageCaption: string | null;
  sourceName: string;
  sourceUrl: string;
  contentHash: string;
  readingTime: number;
  views: number;
  isFeatured: boolean;
  isBreaking: boolean;
  isIndexed: boolean;
  tldr: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  publishedAt: string; // ISO string
  createdAt: string;   // ISO string
  updatedAt: string;   // ISO string
}

export interface StoredCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  order: number;
}

export interface StoredFeed {
  id: string;
  name: string;
  url: string;
  categoryId: string;
  isActive: boolean;
}

export interface StoredCronLog {
  id: string;
  status: "SUCCESS" | "PARTIAL" | "ERROR";
  feedsScanned: number;
  articlesPublished: number;
  articlesSkipped: number;
  errors: string | null;
  durationMs: number;
  triggeredBy: string;
  createdAt: string; // ISO string
}

export interface StoredReferral {
  id: string;
  domain: string;
  fullUrl?: string;
  targetPath: string;
  count: number;
  lastSeenAt: string; // ISO string
}

export interface StoredMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO string
}

export interface SiteSettings {
  adsEnabled: boolean;
  adsenseClientId: string;
  autoPilotEnabled: boolean;
  targetDailyArticles: number;
  articlesPerRun: number;
  cronIntervalMinutes: number;
}

export interface LocalStoreState {
  settings?: SiteSettings;
  articles: StoredArticle[];
  categories: StoredCategory[];
  feeds: StoredFeed[];
  cronLogs: StoredCronLog[];
  referrals: StoredReferral[];
  messages: StoredMessage[];
}

function getDataFilePath(): string {
  // On Vercel / AWS Lambda, use writable temporary directory
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "local-store.json");
  }
  const cwd = process.cwd();
  if (cwd.includes(".next") && cwd.includes("standalone")) {
    const projectRoot = path.resolve(cwd, "..", "..");
    return path.join(projectRoot, "data", "local-store.json");
  }
  return path.join(cwd, "data", "local-store.json");
}

function buildInitialStore(): LocalStoreState {
  const categories: StoredCategory[] = INITIAL_CATEGORIES.map((c, idx) => ({
    id: `cat-${idx + 1}`,
    name: c.name,
    slug: c.slug,
    description: c.description,
    color: c.color,
    order: c.order,
  }));

  const feeds: StoredFeed[] = [];
  INITIAL_CATEGORIES.forEach((c, cIdx) => {
    c.feeds.forEach((f, fIdx) => {
      feeds.push({
        id: `feed-${cIdx + 1}-${fIdx + 1}`,
        name: f.name,
        url: f.url,
        categoryId: `cat-${cIdx + 1}`,
        isActive: true,
      });
    });
  });

  const now = Date.now();
  const rawArticles: StoredArticle[] = STARTER_ARTICLES.map((art, idx) => {
    const cat = categories.find((c) => c.slug === art.categorySlug) || categories[0];
    const pubDate = new Date(now - (STARTER_ARTICLES.length - idx) * 3600 * 1000 * 4).toISOString();
    return {
      id: `art-starter-${idx + 1}`,
      title: art.title,
      seoTitle: art.seoTitle || art.title,
      slug: art.slug,
      focusKeyword: art.focusKeyword || null,
      excerpt: art.excerpt,
      content: art.content,
      keyTakeaways: art.keyTakeaways,
      faqs: art.faqs,
      trendStat: art.trendStat,
      topicTags: art.topicTags,
      featuredImage: art.featuredImage,
      imageCaption: art.imageCaption,
      sourceName: art.sourceName,
      sourceUrl: art.sourceUrl,
      contentHash: `starter-hash-${idx + 1}`,
      readingTime: art.readingTime,
      views: 0, // Real authentic counter, begins at 0 and increments with real reads
      isFeatured: art.isFeatured,
      isBreaking: art.isBreaking,
      isIndexed: true,
      tldr: art.tldr || art.excerpt,
      categoryId: cat.id,
      category: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        color: cat.color,
      },
      publishedAt: pubDate,
      createdAt: pubDate,
      updatedAt: pubDate,
    };
  });

  // Inject internal links between starter articles
  const enrichedArticles = rawArticles.map((art) => {
    const enrichedContent = injectInternalLinksAndCallout(
      art.content,
      art.slug,
      rawArticles.map((r) => ({ title: r.title, slug: r.slug, views: r.views }))
    );
    return { ...art, content: enrichedContent };
  });

  return {
    articles: enrichedArticles,
    categories,
    feeds,
    cronLogs: [], // Clean authentic state: empty until an actual cron job executes
    referrals: [], // Clean authentic state: empty until real referrers are logged
    messages: [],
  };
}

class LocalStoreManager {
  private dataCache: LocalStoreState | null = null;

  private ensureFile(): string {
    const filePath = getDataFilePath();
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (!fs.existsSync(filePath)) {
        // If bundled store exists in read-only folder, copy it
        const bundledPath = path.join(process.cwd(), "data", "local-store.json");
        let initial: LocalStoreState;
        if (fs.existsSync(bundledPath)) {
          try {
            initial = JSON.parse(fs.readFileSync(bundledPath, "utf-8"));
          } catch {
            initial = buildInitialStore();
          }
        } else {
          initial = buildInitialStore();
        }
        try {
          fs.writeFileSync(filePath, JSON.stringify(initial, null, 2), "utf-8");
        } catch {
          // Read-only filesystem fallback
        }
        this.dataCache = initial;
      }
    } catch {
      // Safe fallback
    }
    return filePath;
  }

  public getStore(): LocalStoreState {
    const filePath = this.ensureFile();
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content) as LocalStoreState;
      this.dataCache = parsed;
      return parsed;
    } catch (err) {
      console.error("[LocalStore] Failed to parse local store file, reinitializing:", err);
      const initial = buildInitialStore();
      fs.writeFileSync(filePath, JSON.stringify(initial, null, 2), "utf-8");
      this.dataCache = initial;
      return initial;
    }
  }

  public saveStore(state: LocalStoreState): void {
    const filePath = this.ensureFile();
    try {
      fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
      this.dataCache = state;
    } catch (err) {
      console.error("[LocalStore] Failed to write local store:", err);
    }
  }

  // Articles
  public getAllArticles() {
    return this.getStore().articles.map(this.hydrateArticleDates);
  }

  public getArticleBySlug(slug: string) {
    const art = this.getStore().articles.find((a) => a.slug === slug);
    return art ? this.hydrateArticleDates(art) : null;
  }

  public hasArticleHash(hash: string): boolean {
    return this.getStore().articles.some((a) => a.contentHash === hash);
  }

  public incrementArticleView(slug: string): number {
    const store = this.getStore();
    const art = store.articles.find((a) => a.slug === slug);
    if (!art) return 0;
    art.views = (art.views || 0) + 1;
    art.updatedAt = new Date().toISOString();
    this.saveStore(store);
    return art.views;
  }

  public addArticle(article: any) {
    const store = this.getStore();
    const category =
      store.categories.find((c) => c.id === article.categoryId) || store.categories[0];

    const newArticle: StoredArticle = {
      id: article.id || `art-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: article.title,
      seoTitle: article.seoTitle || article.title,
      slug: article.slug,
      focusKeyword: article.focusKeyword || null,
      excerpt: article.excerpt,
      content: article.content,
      keyTakeaways: Array.isArray(article.keyTakeaways)
        ? article.keyTakeaways
        : typeof article.keyTakeaways === "string"
        ? JSON.parse(article.keyTakeaways)
        : [],
      faqs: Array.isArray(article.faqs)
        ? article.faqs
        : typeof article.faqs === "string"
        ? JSON.parse(article.faqs)
        : [],
      trendStat: article.trendStat
        ? typeof article.trendStat === "string"
          ? JSON.parse(article.trendStat)
          : article.trendStat
        : null,
      topicTags: Array.isArray(article.topicTags)
        ? article.topicTags
        : typeof article.topicTags === "string"
        ? JSON.parse(article.topicTags)
        : [],
      featuredImage: article.featuredImage,
      imageCaption: article.imageCaption || null,
      sourceName: article.sourceName,
      sourceUrl: article.sourceUrl,
      contentHash: article.contentHash,
      readingTime: article.readingTime || 4,
      views: 0,
      isFeatured: !!article.isFeatured,
      isBreaking: !!article.isBreaking,
      isIndexed: article.isIndexed !== false,
      tldr: article.tldr || article.excerpt,
      categoryId: category.id,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        color: category.color,
      },
      publishedAt: article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.articles.unshift(newArticle);
    this.saveStore(store);
    return this.hydrateArticleDates(newArticle);
  }

  public updateArticle(id: string, updates: Partial<StoredArticle>) {
    const store = this.getStore();
    const idx = store.articles.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    store.articles[idx] = {
      ...store.articles[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveStore(store);
    return this.hydrateArticleDates(store.articles[idx]);
  }

  public deleteArticle(id: string): boolean {
    const store = this.getStore();
    const before = store.articles.length;
    store.articles = store.articles.filter((a) => a.id !== id);
    if (store.articles.length !== before) {
      this.saveStore(store);
      return true;
    }
    return false;
  }

  // Categories
  public getCategories() {
    const store = this.getStore();
    return store.categories.map((c) => ({
      ...c,
      _count: {
        articles: store.articles.filter((a) => a.categoryId === c.id).length,
        feeds: store.feeds.filter((f) => f.categoryId === c.id).length,
      },
      feeds: store.feeds.filter((f) => f.categoryId === c.id),
    }));
  }

  public addCategory(cat: { name: string; slug: string; description?: string; color?: string; order?: number }) {
    const store = this.getStore();
    const newCat: StoredCategory = {
      id: `cat-${Date.now()}`,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      color: cat.color || "#f59e0b",
      order: cat.order || store.categories.length + 1,
    };
    store.categories.push(newCat);
    this.saveStore(store);
    return newCat;
  }

  public deleteCategory(id: string): boolean {
    const store = this.getStore();
    const before = store.categories.length;
    store.categories = store.categories.filter((c) => c.id !== id);
    if (store.categories.length !== before) {
      this.saveStore(store);
      return true;
    }
    return false;
  }

  // Feeds
  public getFeeds() {
    return this.getStore().feeds;
  }

  public addFeed(feed: { name: string; url: string; categoryId: string }) {
    const store = this.getStore();
    const newFeed: StoredFeed = {
      id: `feed-${Date.now()}`,
      name: feed.name,
      url: feed.url,
      categoryId: feed.categoryId,
      isActive: true,
    };
    store.feeds.push(newFeed);
    this.saveStore(store);
    return newFeed;
  }

  public updateFeed(id: string, updates: Partial<StoredFeed>) {
    const store = this.getStore();
    const idx = store.feeds.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    store.feeds[idx] = { ...store.feeds[idx], ...updates };
    this.saveStore(store);
    return store.feeds[idx];
  }

  public deleteFeed(id: string): boolean {
    const store = this.getStore();
    const before = store.feeds.length;
    store.feeds = store.feeds.filter((f) => f.id !== id);
    if (store.feeds.length !== before) {
      this.saveStore(store);
      return true;
    }
    return false;
  }

  // Cron Logs
  public getCronLogs() {
    return this.getStore().cronLogs;
  }

  public addCronLog(log: Omit<StoredCronLog, "id" | "createdAt">) {
    const store = this.getStore();
    const newLog: StoredCronLog = {
      ...log,
      id: `cron-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.cronLogs.unshift(newLog);
    // Keep max 50 logs
    if (store.cronLogs.length > 50) {
      store.cronLogs = store.cronLogs.slice(0, 50);
    }
    this.saveStore(store);
    return newLog;
  }

  // Referrals
  public getReferrals() {
    return this.getStore().referrals;
  }

  public recordReferral(domain: string, targetPath: string, fullUrl?: string) {
    const store = this.getStore();
    const existing = store.referrals.find(
      (r) => r.domain === domain && r.targetPath === targetPath
    );
    if (existing) {
      existing.count += 1;
      existing.lastSeenAt = new Date().toISOString();
      if (fullUrl) existing.fullUrl = fullUrl;
    } else {
      store.referrals.push({
        id: `ref-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        domain,
        fullUrl,
        targetPath,
        count: 1,
        lastSeenAt: new Date().toISOString(),
      });
    }
    this.saveStore(store);
  }

  // Messages
  public getMessages() {
    return this.getStore().messages;
  }

  public addMessage(msg: { name: string; email: string; subject: string; message: string }) {
    const store = this.getStore();
    const newMsg: StoredMessage = {
      id: `msg-${Date.now()}`,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    store.messages.unshift(newMsg);
    this.saveStore(store);
    return newMsg;
  }

  // Site Settings (AdSense, Auto-Pilot & 50 Blogs/Day Configuration)
  public getSettings(): SiteSettings {
    const store = this.getStore();
    return {
      adsEnabled: false,
      adsenseClientId: "ca-pub-XXXXXXXXXXXXXXXX",
      autoPilotEnabled: true,
      targetDailyArticles: 50,
      articlesPerRun: 2,
      cronIntervalMinutes: 30,
      ...(store.settings || {}),
    };
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    const store = this.getStore();
    const current = this.getSettings();
    store.settings = {
      ...current,
      ...updates,
    };
    this.saveStore(store);
    return store.settings;
  }

  // Real Dashboard Stats
  public getDashboardStats() {
    const store = this.getStore();
    const totalArticles = store.articles.length;
    // Genuine sum of verified views across all articles
    const totalViews = store.articles.reduce((acc, a) => acc + (a.views || 0), 0);
    const totalCategories = store.categories.length;
    const totalFeeds = store.feeds.filter((f) => f.isActive).length;
    const latestCron = store.cronLogs[0] || null;
    const topReferrals = [...store.referrals]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalArticles,
      totalViews,
      totalCategories,
      totalFeeds,
      latestCron,
      topReferrals,
    };
  }

  private hydrateArticleDates(art: StoredArticle) {
    return {
      ...art,
      publishedAt: new Date(art.publishedAt),
      createdAt: new Date(art.createdAt),
      updatedAt: new Date(art.updatedAt),
    };
  }
}

export const localStore = new LocalStoreManager();
