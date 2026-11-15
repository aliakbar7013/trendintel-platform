import { prisma } from "./prisma";
import { containsRefusal, countWords, sanitizeAICliches, AISynthesizedArticle } from "./ai";

export interface QualityCheckResult {
  passed: boolean;
  reason?: string;
  sanitizedArticle?: AISynthesizedArticle;
}

export async function validateArticleQuality(
  article: AISynthesizedArticle
): Promise<QualityCheckResult> {
  // 1. Check non-empty fields
  if (!article.title || article.title.trim().length < 10) {
    return { passed: false, reason: "Title is missing or too short (< 10 chars)" };
  }

  if (!article.slug || article.slug.trim().length < 5) {
    return { passed: false, reason: "Slug is missing or invalid" };
  }

  if (!article.metaDescription || article.metaDescription.trim().length < 80) {
    return { passed: false, reason: "Meta description is missing or too short (< 80 chars)" };
  }

  if (!article.content || article.content.trim().length < 500) {
    return { passed: false, reason: "HTML content is missing or too short" };
  }

  if (!article.keyTakeaways || article.keyTakeaways.length < 3) {
    return { passed: false, reason: "Must have at least 3 key takeaways" };
  }

  // 2. Refusal check
  if (
    containsRefusal(article.title) ||
    containsRefusal(article.content) ||
    containsRefusal(article.metaDescription)
  ) {
    return { passed: false, reason: "Contains AI refusal or conversational disclaimers" };
  }

  // 3. Word count verification (>= 450 words)
  const wordCount = countWords(article.content);
  if (wordCount < 450) {
    return {
      passed: false,
      reason: `Word count (${wordCount} words) is below the minimum threshold of 450 words`,
    };
  }

  // 4. SEO Structure Quality Validations
  if (!article.tldr || article.tldr.trim().length < 60) {
    return {
      passed: false,
      reason: "Direct Answer (TL;DR) summary is missing or too brief (< 60 chars)",
    };
  }

  // Ensure content has at least two <h2> headings for semantic search hierarchy
  const h2Matches = article.content.match(/<h2[^>]*>/gi);
  if (!h2Matches || h2Matches.length < 2) {
    return {
      passed: false,
      reason: "Content lacks proper semantic heading hierarchy (minimum 2 <h2> tags required)",
    };
  }

  // 5. Ensure Unique & Validated Slug in Database
  let finalSlug = article.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (finalSlug.length < 5) {
    finalSlug = `intel-${Date.now()}`;
  }

  const sanitizedSeoTitle = (article.seoTitle || article.title).slice(0, 60).trim();
  const sanitizedFocusKeyword = (article.focusKeyword || article.title.split(/\s+/).slice(0, 4).join(" ")).trim();

  // Sanitize any robotic AI clichés from text fields
  let sanitizedContent = sanitizeAICliches(article.content);
  const sanitizedMeta = sanitizeAICliches(article.metaDescription);
  const sanitizedTldr = sanitizeAICliches(article.tldr);
  const sanitizedTitle = sanitizeAICliches(article.title);

  // Guarantee Information Gain: If table is absent, inject a high-signal metrics table
  if (!sanitizedContent.includes("<table")) {
    const tableHtml = `
<div class="not-prose my-6 overflow-x-auto rounded-xl border border-white/10 bg-[#090b10] p-4 shadow-lg">
  <table class="w-full text-left text-xs font-mono">
    <thead class="border-b border-white/10 text-amber-400 uppercase tracking-wider text-[11px]">
      <tr>
        <th scope="col" class="pb-2">Strategic Dimension</th>
        <th scope="col" class="pb-2">Institutional Shift & Benchmark</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5 text-slate-300">
      <tr>
        <td class="py-2.5 font-bold text-white">Target Entity</td>
        <td class="py-2.5 text-amber-300 font-bold">${sanitizedFocusKeyword}</td>
      </tr>
      <tr>
        <td class="py-2.5 font-bold text-white">Market Implication</td>
        <td class="py-2.5">${article.keyTakeaways[0] || "Structural industry repositioning"}</td>
      </tr>
      <tr>
        <td class="py-2.5 font-bold text-white">Execution Timeline</td>
        <td class="py-2.5">${article.keyTakeaways[1] || "Immediate to 90-day deployment window"}</td>
      </tr>
      <tr>
        <td class="py-2.5 font-bold text-white">Capital & Resource Impact</td>
        <td class="py-2.5">${article.keyTakeaways[2] || "Reallocation toward high-defensibility assets"}</td>
      </tr>
    </tbody>
  </table>
</div>
`;
    // Insert before the first <h2> or after the second paragraph
    const firstH2 = sanitizedContent.indexOf("<h2");
    if (firstH2 !== -1) {
      sanitizedContent = sanitizedContent.slice(0, firstH2) + tableHtml + sanitizedContent.slice(firstH2);
    } else {
      sanitizedContent = tableHtml + sanitizedContent;
    }
  }

  try {
    const existing = await prisma.article.findUnique({
      where: { slug: finalSlug },
    });
    if (existing) {
      finalSlug = `${finalSlug}-${Math.floor(Math.random() * 8999 + 1000)}`;
    }
  } catch (err) {
    // If DB is offline during test, keep slug
  }

  return {
    passed: true,
    sanitizedArticle: {
      ...article,
      title: sanitizedTitle,
      metaDescription: sanitizedMeta,
      tldr: sanitizedTldr,
      content: sanitizedContent,
      slug: finalSlug,
      seoTitle: sanitizedSeoTitle,
      focusKeyword: sanitizedFocusKeyword,
    },
  };
}
