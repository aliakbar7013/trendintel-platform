export interface LinkTarget {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  views?: number;
}

// Stop words that shouldn't be matched as keywords
const STOP_WORDS = new Set([
  "the", "and", "for", "with", "from", "that", "this", "what", "why", "how",
  "new", "has", "have", "been", "over", "into", "after", "amid", "hits", "cross",
  "says", "will", "more", "most", "about", "their", "market", "report"
]);

function extractKeywordsFromTitle(title: string): string[] {
  // Extract 2-to-4 word phrases and significant nouns/entities
  const clean = title.replace(/[^\w\s-]/g, "").trim();
  const words = clean.split(/\s+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()));

  const phrases: string[] = [];

  // 2-word combinations
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(`${words[i]} ${words[i + 1]}`.toLowerCase());
  }

  // Significant standalone terms
  for (const w of words) {
    if (w.length >= 5) {
      phrases.push(w.toLowerCase());
    }
  }

  return phrases;
}

export function injectInternalLinksAndCallout(
  htmlContent: string,
  currentSlug: string,
  candidates: LinkTarget[]
): string {
  if (!htmlContent) return htmlContent;

  const validTargets = candidates.filter((c) => c.slug !== currentSlug);
  if (validTargets.length === 0) return htmlContent;

  // Split into paragraphs while preserving other tags
  const pRegex = /(<p[^>]*>[\s\S]*?<\/p>)/gi;
  const parts = htmlContent.split(pRegex);

  let internalLinksAdded = 0;
  const maxLinksToAdd = 3;
  const usedTargets = new Set<string>();

  // Process paragraphs for natural internal linking
  for (let i = 0; i < parts.length; i++) {
    if (internalLinksAdded >= maxLinksToAdd) break;

    const segment = parts[i];
    // Only inject in standard <p> tags without existing links or headers
    if (!segment.startsWith("<p") || segment.includes("<a ") || segment.includes("href=")) {
      continue;
    }

    for (const target of validTargets) {
      if (usedTargets.has(target.slug)) continue;

      const keywords = extractKeywordsFromTitle(target.title);

      for (const phrase of keywords) {
        // Safe regex with word boundary
        const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const phraseRegex = new RegExp(`\\b(${escaped})\\b`, "i");

        if (phraseRegex.test(segment)) {
          // Replace only the first occurrence in this paragraph
          parts[i] = segment.replace(
            phraseRegex,
            `<a href="/article/${target.slug}" class="internal-link font-medium text-amber-400 hover:text-amber-300 underline underline-offset-2 decoration-amber-500/50" title="${target.title.replace(/"/g, '&quot;')}">$1</a>`
          );
          usedTargets.add(target.slug);
          internalLinksAdded++;
          break; // Move to next paragraph
        }
      }

      if (parts[i] !== segment) {
        break; // Max 1 internal link per paragraph
      }
    }
  }

  let enrichedHtml = parts.join("");

  // Inject "Read Also / Deep Dive" Card midway through the article
  const paragraphs = enrichedHtml.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
  if (paragraphs.length >= 3) {
    // Pick highest viewed or first candidate
    const topRelated =
      [...validTargets].sort((a, b) => (b.views || 0) - (a.views || 0))[0] || validTargets[0];

    const midIndex = Math.min(Math.floor(paragraphs.length / 2), 3);
    const targetP = paragraphs[midIndex - 1];

    const calloutHtml = `
<aside class="not-prose my-8 overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[#0e111a] to-[#121622] p-4 sm:p-5 shadow-xl">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div className="flex items-start space-x-3">
      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/20 text-amber-400 font-mono text-sm font-bold border border-amber-400/30">
        ⚡
      </div>
      <div>
        <div class="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
          RELATED INTELLIGENCE BRIEF
        </div>
        <a href="/article/${topRelated.slug}" class="mt-0.5 block text-sm font-bold text-white hover:text-amber-300 transition line-clamp-1">
          ${topRelated.title}
        </a>
      </div>
    </div>
    <a href="/article/${topRelated.slug}" class="inline-flex items-center justify-center rounded-lg border border-amber-500/40 bg-amber-400/10 px-3.5 py-1.5 text-xs font-mono font-bold text-amber-300 hover:bg-amber-400 hover:text-black transition shrink-0">
      READ ANALYSIS &rarr;
    </a>
  </div>
</aside>
`;

    // Insert after target paragraph
    enrichedHtml = enrichedHtml.replace(targetP, `${targetP}\n${calloutHtml}`);
  }

  return enrichedHtml;
}
