import Link from "next/link";
import type { Metadata } from "next";
import { CURATED_TOPICS, getArticles } from "@/lib/db";
import { Layers, ArrowRight, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Topic & Trend Hubs | TrendIntel Backlink & Syndication Directory",
  description:
    "Explore evergreen intelligence dossiers and coverage timelines on Artificial Intelligence, Bitcoin, Semiconductors, Venture Capital, and Global Macro.",
};

export default async function TrendsIndexPage() {
  const topicsWithCounts = await Promise.all(
    CURATED_TOPICS.map(async (topic) => {
      const res = await getArticles({ topicTag: topic.slug, limit: 1 });
      return { ...topic, count: res.totalCount };
    })
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-white/10 pb-8 mb-10">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
          INDEXED TOPIC HUBS & CHRONOLOGIES
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-white">
          TrendIntel Intelligence Hubs
        </h1>
        <p className="mt-3 text-base text-slate-300 leading-relaxed max-w-3xl">
          Evergreen analytical dossiers compiling real-time news chronologies, verified quantitative benchmarks, and strategic impact assessments. Built to provide journalists, researchers, and operators with linkable reference assets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topicsWithCounts.map((topic) => (
          <Link
            key={topic.slug}
            href={`/trends/${topic.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0f1118] p-6 transition duration-200 hover:border-amber-500/50 hover:bg-[#151822]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: topic.color }}
                />
                <span className="text-xs font-mono font-bold text-slate-400">
                  {topic.count} STORIES
                </span>
              </div>

              <h2 className="text-xl font-bold text-white group-hover:text-amber-400 transition font-mono">
                {topic.name}
              </h2>

              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                {topic.description}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs font-mono font-bold text-amber-400 group-hover:text-amber-300">
              <span>EXPLORE DOSSIER</span>
              <ArrowRight className="h-4 w-4 transition transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
