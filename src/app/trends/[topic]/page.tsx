import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticles, CURATED_TOPICS } from "@/lib/db";
import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";
import { ChevronRight, TrendingUp, Layers, Bookmark, Rss } from "lucide-react";

export const dynamic = "force-dynamic";

interface TopicHubPageProps {
  params: Promise<{ topic: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const topicMeta = CURATED_TOPICS.find((t) => t.slug === topic) || {
    name: topic.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: `Comprehensive intelligence dossier, coverage timeline, and live data telemetry on ${topic}.`,
  };

  const pageUrl = `https://trendintel.blog/trends/${topic}`;

  return {
    title: `${topicMeta.name} Trends & Timeline | TrendIntel Intelligence Hub`,
    description: topicMeta.description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${topicMeta.name} Trends & Live Telemetry`,
      description: topicMeta.description,
      url: pageUrl,
    },
  };
}

export default async function TopicHubPage({
  params,
  searchParams,
}: TopicHubPageProps) {
  const { topic } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);

  const topicConfig = CURATED_TOPICS.find((t) => t.slug === topic) || {
    slug: topic,
    name: topic.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: `Continuous intelligence stream and live market developments regarding ${topic}.`,
    color: "#f59e0b",
  };

  const result = await getArticles({
    topicTag: topic,
    page: currentPage,
    limit: 12,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center space-x-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">
          HOME
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <Link href="/trends" className="hover:text-amber-400 transition uppercase">
          TREND HUBS
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-white uppercase font-bold">{topicConfig.name}</span>
      </nav>

      {/* Hub Hero Dossier */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2">
              <span
                className="h-3 w-3 rounded-full animate-pulse"
                style={{ backgroundColor: topicConfig.color }}
              />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                EVERGREEN TOPIC HUB & DOSSIER
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              {topicConfig.name}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              {topicConfig.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 text-xs font-mono">
              <span className="text-slate-400">INDEXED STORIES: </span>
              <strong className="text-white">{result.totalCount}</strong>
            </div>

            <Link
              href="/feed.xml"
              target="_blank"
              className="flex items-center space-x-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs font-mono font-bold text-amber-300 hover:bg-amber-400 hover:text-black transition"
            >
              <Rss className="h-3.5 w-3.5" />
              <span>RSS WIRE</span>
            </Link>
          </div>
        </div>
      </div>

      <AdSlot slotId={`trendintel-topic-${topic}`} format="horizontal" />

      {/* Articles Feed */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            <span>Timeline of Coverage</span>
          </h2>
          <span className="text-xs font-mono text-slate-500">
            Chronological Dispatch Archive
          </span>
        </div>

        {result.articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-800 py-16 text-center text-slate-500">
            <Layers className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <p className="text-sm font-medium">No published stories tagged under this topic yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
