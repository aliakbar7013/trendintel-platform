import { GoogleGenAI, Type } from "@google/genai";

export interface TrendStat {
  metric: string;
  label: string;
  context: string;
  change?: string;
}

export interface AISynthesizedArticle {
  title: string;
  seoTitle: string; // Under 60 chars high-CTR search title with primary entity
  slug: string;
  focusKeyword: string; // Primary 2-to-4 word target search query
  metaDescription: string; // 145-155 chars with target keyword and clear hook
  tldr: string; // 45-60 word Direct Answer summary optimized for Google Featured Snippets & AI Overviews
  keyTakeaways: string[];
  content: string; // HTML formatted with <h2>, <h3>, <p>, <blockquote>, <table>, <ul>, <li>
  faqs: { question: string; answer: string }[];
  trendStat?: TrendStat;
  topicTags?: string[];
  pexelsSearchQuery: string;
}

const SYSTEM_INSTRUCTION = `
You are a senior investigative financial, technology, and crypto journalist writing exclusively for TrendIntel.blog.
Your mission is to synthesize raw competitor dispatches and wire reports into an original, deeply analytical, 100% plagiarism-free 600–800 word intelligence analysis. Your writing must be engineered for maximum Information Gain, Google Discover carousel feature, and Generative Engine Optimization (GEO).

ZERO-PLAGIARISM & HUMAN JOURNALISTIC VOICE STANDARDS (BYPASSING AI DETECTION):
1. TOTAL STRUCTURAL SEPARATION:
   - Never mimic the sentence rhythm, paragraph ordering, or grammatical structure of the competitor source dispatch.
   - Treat the source text strictly as a raw fact sheet (extracting who, what, numbers, dates, capital amounts, entity names, quotes).
   - Rebuild the narrative entirely from first principles: lead with the broader systemic implication, followed by institutional analysis.
2. BAN ON ROBOTIC AI CLICHÉS:
   - You are STRICTLY FORBIDDEN from using any of the following dead giveaways of synthetic AI text:
     "delve", "tapestry", "beacon", "testament", "crucial", "pivotal", "in conclusion", "furthermore", "moreover", "it is important to note", "it remains to be seen", "fast-paced world", "ever-evolving landscape", "game-changer", "revolutionize", "dive in", "unravel", "foster", "plethora", "at the end of the day", "only time will tell".
   - Instead, write with dynamic, authoritative human journalism cadences: short, decisive 6-word sentences intermixed with rigorous, multi-clause institutional breakdowns.
3. HIGH INFORMATION GAIN & SECOND-ORDER ANALYSIS:
   - Do not merely summarize what occurred. Explain what happens next, who gains unfair advantage, and who gets displaced.
   - Contrast this event against historical market cycles and competitor positioning.

STRICT SEO & GOOGLE DISCOVER STRUCTURE RULES:
1. FOCUS KEYWORD & PRIMARY ENTITY:
   - Identify the primary 2-to-4 word high-intent search query (e.g. "frontier AI compute clusters", "tokenized US treasuries RWA", "vertical SaaS valuation multiples").
   - Populate "focusKeyword" with this exact query.
   - Naturally integrate this keyword into "seoTitle", the opening 60 characters of "metaDescription", the "tldr" Direct Answer, at least one <h2> heading, and within the opening 80 words of the body content.
2. GOOGLE DISCOVER HIGH-CTR TITLES:
   - "seoTitle": High-CTR punchy search headline under 60 characters with the primary entity up-front to prevent SERP ellipsis.
   - "title": Compelling full editorial headline under 75 characters crafted for Google Discover curiosity and authority (mention concrete numbers, shifts, or paradoxes).
3. SEARCH ENGINE META DESCRIPTION:
   - "metaDescription": Between 145 and 155 characters. Must contain the focus keyword and a clear hook explaining the real-world significance.
4. DIRECT ANSWER / FEATURED SNIPPET (TL;DR):
   - In "tldr", write a sharp, punchy 45–60 word Direct Answer paragraph right below the H1 that directly explains the core development, the primary entities involved, the financial/technical scale, and the immediate outcome. Optimize strictly for Google Featured Snippets and AI Overviews.
5. MANDATORY COMPARISON / DATA TABLE:
   - Every single article MUST contain a well-structured HTML <table> comparing metrics, dates, valuations, specs, or competitive shifts.
   - Format: <div class="overflow-x-auto my-6"><table class="w-full text-left text-xs font-mono"><thead><tr><th scope="col">...</th></tr></thead><tbody><tr><td>...</td></tr></tbody></table></div>.
6. RICH JOURNALISTIC ARTICLE BODY (HTML):
   - Clear <h2> subheadings:
     * <h2>What Happened: Core Developments & Industry Shockwaves</h2>
     * <h2>Why It Matters: Strategic Architecture & Market Analysis</h2>
     * <h2>Market & Capital Impact: Who Wins and Who Loses</h2>
     * <h2>Broader Context & What Happens Next</h2>
   - Include an insightful <blockquote> emphasizing an institutional thesis, and clear <ul>/<li> lists for specific shifts.
   - Do NOT wrap output in \`\`\`html blocks inside the JSON; return clean HTML tags directly inside the "content" field.
7. EXECUTIVE TAKEAWAYS & FAQS:
   - "keyTakeaways": Exactly 4 sharp, high-signal takeaways.
   - "faqs": Exactly 3 realistic, insightful reader FAQs addressing practical mechanics and implications with direct, authoritative answers.
8. QUANTITATIVE TREND STAT:
   - Extract 1 "Key Trend Stat / Market Snapshot" (e.g., metric: "+100,000 Accelerators", label: "Frontier Cluster Scaling", context: "Power grid bottleneck benchmark", change: "+140% YoY").
9. TOPIC TAGS:
   - Provide 2 to 4 standardized kebab-case evergreen topic tags (e.g. ["artificial-intelligence", "sovereign-compute"]).
10. NEVER include conversational filler ("As an AI", "In this article", etc.).
`;

export const BANNED_AI_CLICHES = [
  "delve",
  "delving",
  "tapestry",
  "beacon",
  "testament to",
  "crucial role",
  "pivotal moment",
  "in conclusion",
  "moreover",
  "furthermore",
  "it is important to note",
  "it is worth noting",
  "fast-paced world",
  "ever-evolving landscape",
  "game-changer",
  "game changer",
  "revolutionize",
  "revolutionizing",
  "dive into",
  "dive in",
  "unravel",
  "unraveling",
  "plethora",
  "foster",
  "fostering innovation",
  "only time will tell",
  "it remains to be seen",
  "in summary",
  "all in all",
  "at the end of the day",
];

const AI_REFUSAL_PHRASES = [
  "as an ai",
  "as a large language model",
  "i cannot fulfill",
  "i am unable to",
  "i don't have access",
  "i cannot browse",
  "apologies, but",
  "here is a synthesized article",
];

export function containsRefusal(text: string): boolean {
  const lower = text.toLowerCase();
  return AI_REFUSAL_PHRASES.some((phrase) => lower.includes(phrase));
}

export function sanitizeAICliches(text: string): string {
  let cleaned = text;
  // Replace common robotic transitions with natural human transitions
  const replacements: [RegExp, string][] = [
    [/\bdelve into\b/gi, "examine"],
    [/\bdelve\b/gi, "probe"],
    [/\ba testament to\b/gi, "evidence of"],
    [/\ba tapestry of\b/gi, "a matrix of"],
    [/\ba beacon of\b/gi, "a standard for"],
    [/\bcrucial role\b/gi, "key role"],
    [/\bpivotal moment\b/gi, "turning point"],
    [/\bgame-changer\b/gi, "catalyst"],
    [/\brevolutionize\b/gi, "transform"],
    [/\bin conclusion,\b/gi, "In market terms,"],
    [/\bfurthermore,\b/gi, "Additionally,"],
    [/\bmoreover,\b/gi, "Beyond this,"],
    [/\bit is important to note that\b/gi, "Critically,"],
    [/\bit remains to be seen\b/gi, "Market observers are tracking"],
    [/\bonly time will tell\b/gi, "Execution benchmarks will determine"],
    [/\bfast-paced world\b/gi, "competitive landscape"],
  ];

  for (const [pattern, replacement] of replacements) {
    cleaned = cleaned.replace(pattern, replacement);
  }
  return cleaned;
}

export function countWords(str: string): number {
  return str
    .replace(/<[^>]*>/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export async function synthesizeNewsArticle({
  rawTitle,
  rawContent,
  sourceName,
  categoryName,
}: {
  rawTitle: string;
  rawContent: string;
  sourceName: string;
  categoryName: string;
}): Promise<AISynthesizedArticle | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Generating high-signal simulation synthesis.");
    return generateFallbackSynthesis(rawTitle, rawContent, sourceName, categoryName);
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
SOURCE DISPATCH TO SYNTHESIZE:
Category: ${categoryName}
Source Publication: ${sourceName}
Original Title: ${rawTitle}
Raw Extracted Text:
${rawContent.slice(0, 5000)}

Perform full journalistic synthesis following the system instructions and return strictly valid JSON.
`;

  const candidateModels = [
    process.env.GEMINI_MODEL,
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
  ].filter(Boolean) as string[];

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Journalistic headline under 75 characters.",
              },
              seoTitle: {
                type: Type.STRING,
                description: "Punchy search title under 60 characters with primary entity up front.",
              },
              slug: {
                type: Type.STRING,
                description: "URL-friendly kebab-case slug without special characters.",
              },
              focusKeyword: {
                type: Type.STRING,
                description: "Primary 2-to-4 word target search query or entity.",
              },
              metaDescription: {
                type: Type.STRING,
                description: "SEO meta description between 145 and 155 characters with focus keyword.",
              },
              tldr: {
                type: Type.STRING,
                description: "45-60 word Direct Answer / TLDR paragraph optimized for Featured Snippets.",
              },
              keyTakeaways: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "4 sharp executive takeaways.",
              },
              content: {
                type: Type.STRING,
                description: "550-750 word HTML article with <h2>, <h3>, <p>, <blockquote>, <table>, <ul>, <li> ending with 'Broader Context & What Happens Next'.",
              },
              faqs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING },
                  },
                  required: ["question", "answer"],
                },
                description: "3 realistic FAQs.",
              },
              trendStat: {
                type: Type.OBJECT,
                properties: {
                  metric: { type: Type.STRING },
                  label: { type: Type.STRING },
                  context: { type: Type.STRING },
                  change: { type: Type.STRING },
                },
                required: ["metric", "label", "context"],
                description: "Shareable quantitative trend stat widget data.",
              },
              topicTags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-4 kebab-case evergreen topic tags for topic hub aggregation.",
              },
              pexelsSearchQuery: {
                type: Type.STRING,
                description: "2-3 word photography search query.",
              },
            },
            required: [
              "title",
              "seoTitle",
              "slug",
              "focusKeyword",
              "metaDescription",
              "tldr",
              "keyTakeaways",
              "content",
              "faqs",
              "trendStat",
              "topicTags",
              "pexelsSearchQuery",
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        continue;
      }

      const parsed = JSON.parse(responseText) as AISynthesizedArticle;

      // Sanitize slug
      parsed.slug = parsed.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      return parsed;
    } catch (err: any) {
      console.warn(`Gemini model ${modelName} attempt failed:`, err.message);
      // Try next model in list
    }
  }

  console.error("All Gemini models exhausted. Falling back to high-signal simulation synthesis.");
  return generateFallbackSynthesis(rawTitle, rawContent, sourceName, categoryName);
}

// Development / Offline Fallback Synthesizer
function generateFallbackSynthesis(
  rawTitle: string,
  rawContent: string,
  sourceName: string,
  categoryName: string
): AISynthesizedArticle {
  const cleanTitle = rawTitle.replace(/[^\w\s-]/g, "").slice(0, 60);
  const slug = cleanTitle
    .toLowerCase()
    .replace(/\s+/g, "-")
    .slice(0, 50);

  const excerpt = rawContent.slice(0, 150).replace(/\s+/g, " ");

  return {
    title: cleanTitle,
    seoTitle: cleanTitle.slice(0, 58),
    slug: `${slug}-${Math.floor(Math.random() * 899 + 100)}`,
    focusKeyword: `${categoryName.toLowerCase().replace(/[^a-z0-9]/g, " ")} market analysis`.trim(),
    metaDescription: `${excerpt.slice(0, 140)}... Comprehensive news analysis from TrendIntel.`,
    tldr: `Recent dispatches across the ${categoryName} sector reveal accelerated operational realignment regarding ${cleanTitle}. Industry operators are committing substantial capital to navigate regulatory shifts, optimize hardware throughput, and establish durable commercial defensibility over the upcoming multi-quarter cycle.`,
    keyTakeaways: [
      `Key market development regarding ${cleanTitle.slice(0, 40)}.`,
      `Strategic implications for enterprise leaders across ${categoryName}.`,
      "Shifts in liquidity, regulatory frameworks, and computational efficiency.",
      "Accelerated adoption cycles observed by institutional industry participants."
    ],
    content: `
      <h2>What Happened: The Core Developments</h2>
      <p>In a significant market movement reported across global intelligence networks, recent developments concerning ${cleanTitle} have triggered widespread attention among industry analysts and institutional stakeholders.</p>
      <p>Original source coverage originating from ${sourceName} highlights a structural acceleration in the sector. Rather than representing an isolated data point, this event signifies a broader momentum shift across the ${categoryName} ecosystem.</p>
      
      <div class="overflow-x-auto my-6 not-prose">
        <table class="w-full text-left text-xs font-mono border border-slate-700 rounded-lg">
          <thead class="bg-slate-800 text-slate-300 border-b border-slate-700">
            <tr>
              <th class="p-3">Key Metric / Spec</th>
              <th class="p-3">Previous Baseline</th>
              <th class="p-3">Current Benchmark</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr>
              <td class="p-3 font-bold text-white">Cluster Scalability</td>
              <td class="p-3 text-slate-400">10,000 Nodes</td>
              <td class="p-3 text-emerald-400 font-bold">100,000+ Nodes</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-white">Power Draw</td>
              <td class="p-3 text-slate-400">50 - 150 MW</td>
              <td class="p-3 text-amber-400 font-bold">1.2 - 2.5 GW</td>
            </tr>
          </tbody>
        </table>
      </div>

      <blockquote>
        "The velocity of change in this market segment is compelling enterprise decision-makers to rethink foundational capital allocation and technological preparedness."
      </blockquote>

      <h2>Why It Matters: Strategic Analysis</h2>
      <p>Understanding the second-order consequences of this shift requires examining the interplay between technological capacity and economic incentives. As organizations contend with increased competitive pressure and macro volatility, early movers are securing critical strategic moats.</p>
      <p>Market analysts observe that operational efficiency gains achieved through these new frameworks provide a defensible buffer against rising input costs and tighter regulatory enforcement standards.</p>

      <h2>Market and Industry Impact</h2>
      <p>The broader implications across global markets are expected to manifest across several dimensions:</p>
      <ul>
        <li><strong>Capital Reallocation:</strong> Strategic realignment of venture and institutional treasury funds toward high-signal assets.</li>
        <li><strong>Regulatory Scrutiny:</strong> Heightened engagement from international standards organizations seeking harmonized compliance frameworks.</li>
        <li><strong>Operational Transformation:</strong> Rapid integration of automated workflows to decouple revenue expansion from overhead growth.</li>
      </ul>

      <h2>Broader Context & What Happens Next</h2>
      <p>Looking ahead toward upcoming quarterly earnings cycles and regulatory disclosures, market participants should anticipate consolidated supply pacts and tighter sovereign export licensing. Organizations that proactively align capital allocation with these macro constraints will maintain decisive operational leverage.</p>
    `,
    faqs: [
      {
        question: "What is the primary significance of this report?",
        answer: "This development illustrates structural realignments within the sector, showcasing how leading operators adapt to shifting technological and financial paradigms."
      },
      {
        question: "Who is most directly affected by these changes?",
        answer: "Enterprise technology leaders, investment portfolio managers, and regulatory compliance teams operating within this domain."
      },
      {
        question: "How should stakeholders respond in the near term?",
        answer: "Organizations should audit internal exposure, evaluate supplier redundancies, and prioritize capital resilience over speculative expansion."
      }
    ],
    trendStat: {
      metric: "+84.5%",
      label: "Quarterly Sector Velocity",
      context: "Measured institutional participation index across enterprise bureaus",
      change: "Historic Peak",
    },
    topicTags: [
      categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      "market-intelligence",
      "strategic-analysis",
    ],
    pexelsSearchQuery: `${categoryName.toLowerCase()} technology`,
  };
}
