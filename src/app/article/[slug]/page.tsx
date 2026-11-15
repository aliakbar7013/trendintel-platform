import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticleBySlug, getRelatedArticles } from "@/lib/db";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import KeyTakeawaysCard from "@/components/KeyTakeawaysCard";
import TrendStatWidget from "@/components/TrendStatWidget";
import FAQSection from "@/components/FAQSection";
import SourceAttribution from "@/components/SourceAttribution";
import CiteWidget from "@/components/CiteWidget";
import SocialShare from "@/components/SocialShare";
import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";
import ViewTracker from "@/components/ViewTracker";
import { ChevronRight, Clock, Eye, Calendar, Sparkles, Tag, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | TrendIntel",
      robots: { index: false, follow: false },
    };
  }

  const pageUrl = `https://trendintel.blog/article/${article.slug}`;
  const seoDisplayTitle = article.seoTitle || article.title;

  const keywordsList = [
    article.focusKeyword,
    ...(article.topicTags || []),
    article.category.name,
    "TrendIntel",
    "market intelligence",
    "breaking analysis",
  ].filter(Boolean) as string[];

  return {
    title: seoDisplayTitle,
    description: article.excerpt,
    keywords: keywordsList,
    authors: [{ name: "TrendIntel Editorial Bureau", url: "https://trendintel.blog/about" }],
    creator: "TrendIntel Editorial Bureau",
    publisher: "TrendIntel",
    category: article.category.name,
    alternates: {
      canonical: pageUrl,
      types: {
        "application/rss+xml": "https://trendintel.blog/feed.xml",
      },
    },
    robots: article.isIndexed
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        }
      : {
          index: false,
          follow: true,
        },
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.excerpt,
      url: pageUrl,
      siteName: "TrendIntel",
      locale: "en_US",
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      section: article.category.name,
      tags: article.topicTags || [article.category.name],
      images: [
        {
          url: article.featuredImage,
          width: 1200,
          height: 675,
          alt: article.imageCaption || article.title,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@trendintel_blog",
      creator: "@trendintel_blog",
      title: article.seoTitle || article.title,
      description: article.excerpt,
      images: [
        {
          url: article.featuredImage,
          alt: article.imageCaption || article.title,
        },
      ],
    },
    other: {
      "article:published_time": article.publishedAt.toISOString(),
      "article:modified_time": article.updatedAt.toISOString(),
      "article:section": article.category.name,
      "article:tag": (article.topicTags || []).join(", "),
      news_keywords: keywordsList.join(", "),
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(
    article.category.slug,
    article.slug,
    3
  );

  const pageUrl = `https://trendintel.blog/article/${article.slug}`;
  const wordCount = article.content
    .replace(/<[^>]*>/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  // 1. Structured Data: NewsArticle (Google News & Rich Snippet Compliant)
  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    alternativeHeadline: article.seoTitle || article.title,
    description: article.excerpt,
    image: {
      "@type": "ImageObject",
      url: article.featuredImage,
      width: 1200,
      height: 675,
      caption: article.imageCaption || article.title,
    },
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    inLanguage: "en-US",
    isAccessibleForFree: "true",
    wordCount,
    articleSection: article.category.name,
    keywords: [article.focusKeyword, ...(article.topicTags || [])].filter(Boolean).join(", "),
    author: {
      "@type": "Organization",
      name: "TrendIntel Editorial Bureau",
      url: "https://trendintel.blog/about",
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "TrendIntel",
      url: "https://trendintel.blog",
      logo: {
        "@type": "ImageObject",
        url: "https://trendintel.blog/icon.png",
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".article-direct-answer", ".article-key-takeaways"],
    },
  };

  // 2. Structured Data: BreadcrumbList (Rich SERP Breadcrumb Navigation)
  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://trendintel.blog",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: article.category.name,
        item: `https://trendintel.blog/category/${article.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: pageUrl,
      },
    ],
  };

  // 3. Structured Data: FAQPage (Google Expandable Question SERP Features)
  const faqPageJsonLd =
    article.faqs && article.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {/* Scroll Progress Indicator */}
      <ReadingProgressBar />

      {/* Incremental Analytics Tracking */}
      <ViewTracker slug={article.slug} />

      {/* JSON-LD Structured Data Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      {faqPageJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
        />
      )}

      {/* Crawl Control / Content Pruning Guardrail */}
      {!article.isIndexed && (
        <meta name="robots" content="noindex, follow" />
      )}

      <article
        itemScope
        itemType="https://schema.org/NewsArticle"
        className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8"
      >
        {/* Hidden Microdata for Semantic Rich Crawlers */}
        <meta itemProp="datePublished" content={article.publishedAt.toISOString()} />
        <meta itemProp="dateModified" content={article.updatedAt.toISOString()} />
        <meta itemProp="inLanguage" content="en-US" />
        <meta itemProp="mainEntityOfPage" content={pageUrl} />
        {article.focusKeyword && (
          <meta itemProp="keywords" content={[article.focusKeyword, ...(article.topicTags || [])].filter(Boolean).join(", ")} />
        )}

        {/* 1. Breadcrumbs with Schema.org Microdata */}
        <nav aria-label="Breadcrumbs" className="mb-4 sm:mb-6">
          <ol
            itemScope
            itemType="https://schema.org/BreadcrumbList"
            className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-400"
          >
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center space-x-1.5"
            >
              <Link href="/" itemProp="item" className="hover:text-amber-400 transition">
                <span itemProp="name">HOME</span>
              </Link>
              <meta itemProp="position" content="1" />
              <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
            </li>

            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center space-x-1.5"
            >
              <Link
                href={`/category/${article.category.slug}`}
                itemProp="item"
                className="hover:text-amber-400 transition uppercase"
              >
                <span itemProp="name">{article.category.name}</span>
              </Link>
              <meta itemProp="position" content="2" />
              <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
            </li>

            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="truncate max-w-[180px] sm:max-w-md text-slate-500"
            >
              <span itemProp="name">{article.title}</span>
              <meta itemProp="item" content={pageUrl} />
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </nav>

        {/* 2. Article Header */}
        <header className="mb-6 sm:mb-8">
          <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
            <Link
              href={`/category/${article.category.slug}`}
              className="rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-black transition hover:opacity-90"
              style={{ backgroundColor: article.category.color || "#f59e0b" }}
            >
              {article.category.name}
            </Link>

            {article.isBreaking && (
              <span className="flex items-center space-x-1 rounded-full bg-rose-500/90 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-mono font-semibold text-white">
                <Sparkles className="h-3 w-3" />
                <span>INTELLIGENCE BRIEF</span>
              </span>
            )}

            {!article.isIndexed && (
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                ARCHIVED DISPATCH
              </span>
            )}
          </div>

          <h1
            itemProp="headline"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight"
          >
            {article.title}
          </h1>

          {/* Featured Snippet & AI Overview Direct Answer Box (TL;DR) */}
          <section
            aria-label="Direct Answer Summary"
            itemProp="abstract"
            className="article-direct-answer my-5 sm:my-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 sm:p-5 text-slate-200 shadow-lg"
          >
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>Direct Answer / Quick Intelligence Takeaway</span>
            </div>
            <p className="text-xs sm:text-sm md:text-base leading-relaxed text-slate-200 font-sans font-medium">
              {article.tldr || article.excerpt}
            </p>
          </section>

          {/* Meta Bar */}
          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-white/10 py-3 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <time
                dateTime={article.publishedAt.toISOString()}
                className="flex items-center space-x-1.5"
              >
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                <span>
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </time>

              <span className="flex items-center space-x-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{article.readingTime} min read</span>
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-slate-400">
              <Eye className="h-3.5 w-3.5" />
              <span>{article.views} total reads</span>
            </div>
          </div>
        </header>

        {/* 3. Featured Hero Image (Google Discover Optimized: Width >= 1200px) */}
        <figure className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
          <Image
            src={article.featuredImage}
            alt={article.imageCaption || `${article.title} - TrendIntel Analysis`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
          {article.imageCaption && (
            <figcaption className="absolute bottom-0 inset-x-0 bg-black/75 px-4 py-2 text-[11px] font-mono text-slate-300 backdrop-blur-sm">
              {article.imageCaption}
            </figcaption>
          )}
        </figure>

        {/* 4. Highlighted Key Takeaways Summary Card */}
        <div className="article-key-takeaways">
          <KeyTakeawaysCard takeaways={article.keyTakeaways} />
        </div>

        {/* 5. Trend Stat / Market Snapshot Card (Backlink Magnet) */}
        {article.trendStat && (
          <TrendStatWidget
            stat={article.trendStat}
            articleTitle={article.title}
            articleSlug={article.slug}
          />
        )}

        {/* 6. In-Article AdSlot */}
        <AdSlot slotId="trendintel-article-mid-1" format="responsive" />

        {/* 7. Journalistic Article Body (Semantic HTML with internal links, tables & 'Broader Context') */}
        <div
          itemProp="articleBody"
          className="prose prose-invert prose-slate max-w-none text-slate-200"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* 8. Evergreen Topic Hub Tags */}
        {article.topicTags && article.topicTags.length > 0 && (
          <div className="my-8 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
            <span className="flex items-center space-x-1 text-xs font-mono text-slate-400 mr-1">
              <Tag className="h-3.5 w-3.5 text-amber-400" />
              <span>Topical Entities:</span>
            </span>
            {article.topicTags.map((tag) => (
              <Link
                key={tag}
                href={`/trends/${tag}`}
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-xs font-mono text-slate-300 hover:border-amber-400 hover:text-white transition"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* 9. Dedicated Frequently Asked Questions */}
        <FAQSection faqs={article.faqs} />

        {/* 10. Original Source Attribution */}
        <SourceAttribution
          sourceName={article.sourceName}
          sourceUrl={article.sourceUrl}
          publishedAt={article.publishedAt}
        />

        {/* 11. "Cite This Report" One-Click Backlink Widget */}
        <CiteWidget
          title={article.title}
          slug={article.slug}
          publishedAt={article.publishedAt}
          sourceName={article.sourceName}
        />

        {/* 12. Social Share Buttons */}
        <SocialShare title={article.title} slug={article.slug} />

        {/* 13. Related Stories Grid (Internal Link Equity Booster) */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 border-t border-white/10 pt-10">
            <h2 className="mb-6 text-sm font-mono font-bold uppercase tracking-wider text-white">
              Related Dispatches from {article.category.name}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
