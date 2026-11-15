import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export interface ExtractedArticle {
  title: string;
  textContent: string;
  excerpt: string;
  byline: string | null;
  siteName: string | null;
  length: number;
}

const REALISTIC_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36";

export async function extractArticleContent(
  url: string,
  timeoutMs = 10000
): Promise<ExtractedArticle | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": REALISTIC_USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      redirect: "follow",
    });

    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`Extraction HTTP error ${res.status} for ${url}`);
      return null;
    }

    const html = await res.text();
    if (!html || html.length < 500) {
      return null;
    }

    // Check paywall or captcha hints in raw HTML
    const lowerHtml = html.toLowerCase();
    if (
      lowerHtml.includes("just a moment...") ||
      lowerHtml.includes("cf-browser-verification") ||
      lowerHtml.includes("enable javascript and cookies to continue")
    ) {
      console.warn(`Skipping Cloudflare/Captcha challenge page: ${url}`);
      return null;
    }

    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const parsed = reader.parse();

    if (!parsed || !parsed.textContent) {
      return null;
    }

    const cleanText = parsed.textContent.replace(/\s+/g, " ").trim();

    // Check minimum character requirement
    if (cleanText.length < 250) {
      console.warn(`Extracted content too short (${cleanText.length} chars): ${url}`);
      return null;
    }

    // Check for hard paywall indicators
    const lowerText = cleanText.toLowerCase();
    if (
      lowerText.includes("subscribe to read the full story") ||
      lowerText.includes("already a subscriber? log in") ||
      lowerText.includes("this article is for subscribers only")
    ) {
      console.warn(`Skipping paywalled content: ${url}`);
      return null;
    }

    return {
      title: parsed.title || "",
      textContent: cleanText,
      excerpt: parsed.excerpt || cleanText.slice(0, 300),
      byline: parsed.byline || null,
      siteName: parsed.siteName || null,
      length: cleanText.length,
    };
  } catch (err: any) {
    clearTimeout(timer);
    console.warn(`Failed to extract article from ${url}:`, err.message);
    return null;
  }
}
