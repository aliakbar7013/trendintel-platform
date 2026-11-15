import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { articleId, articleSlug } = await request.json();

    let article: any = null;
    if (articleId) {
      article = await prisma.article.findUnique({ where: { id: articleId } });
    } else if (articleSlug) {
      article = await prisma.article.findUnique({ where: { slug: articleSlug } });
    }

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://trendintel.blog"}/article/${article.slug}`;

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
Generate a personalized, highly professional email outreach pitch to send to tech/finance journalists, newsletter curators, and bloggers covering this topic.
The goal is to get them to reference or backlink to our analysis.

ARTICLE DETAILS:
Title: ${article.title}
Excerpt: ${article.excerpt}
Canonical URL: ${canonicalUrl}
Key Takeaways: ${article.keyTakeaways}

Format the response as:
SUBJECT: [Catchy, high-signal subject line under 60 chars]
PITCH: [Short 3-paragraph friendly email pitch highlighting key data points, why their readers will benefit, and an offer to quote or embed the stat with backlink]
`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        if (response.text) {
          return NextResponse.json({
            success: true,
            pitchText: response.text,
            canonicalUrl,
          });
        }
      } catch (aiErr: any) {
        console.warn("Gemini outreach generation error:", aiErr.message);
      }
    }

    // High-signal template fallback
    const fallbackPitch = `SUBJECT: Data dispatch on ${article.title.slice(0, 45)}...

Hi [Name / Editor],

I saw your recent coverage on market shifts in this sector and wanted to share a comprehensive intelligence report our bureau at TrendIntel just published:

"${article.title}"
Link: ${canonicalUrl}

A few key quantitative data points you might find valuable for your next newsletter edition or story follow-up:
- ${article.excerpt}
- Original synthesis with full source attributions and executive takeaways.

Feel free to cite any data points or embed the trend stat in your reporting. If you need custom quotes or additional telemetry, I'm happy to provide background.

Best regards,
Editorial Intelligence Desk
TrendIntel.blog | ${canonicalUrl}`;

    return NextResponse.json({
      success: true,
      pitchText: fallbackPitch,
      canonicalUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
