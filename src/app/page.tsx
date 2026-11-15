import {
  getBreakingHeadlines,
  getHeroGridStories,
  getCategories,
  getArticles,
} from "@/lib/db";
import BreakingTicker from "@/components/BreakingTicker";
import HeroGrid from "@/components/HeroGrid";
import CategoryFilterTabs from "@/components/CategoryFilterTabs";
import AdSlot from "@/components/AdSlot";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Activity, Cpu, Bitcoin, DollarSign, Rocket } from "lucide-react";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1", 10);

  const [headlines, heroStories, categories, paginatedResult] =
    await Promise.all([
      getBreakingHeadlines(5),
      getHeroGridStories(),
      getCategories(),
      getArticles({ page: currentPage, limit: 9 }),
    ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Breaking News Ticker Bar */}
      <BreakingTicker headlines={headlines} />

      {/* Market Pulse Ticker Bar */}
      <div className="border-b border-white/5 bg-[#090b10] py-2 px-3 sm:px-4">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2 sm:gap-3">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] sm:text-[11px]">
              MARKET PULSE
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[10px] sm:text-[11px]">
            <span className="flex items-center space-x-1">
              <Cpu className="h-3 w-3 text-cyan-400 shrink-0" />
              <span>AI COMPUTE:</span>
              <span className="text-emerald-400 font-bold">+4.8%</span>
            </span>
            <span className="flex items-center space-x-1">
              <Bitcoin className="h-3 w-3 text-emerald-400 shrink-0" />
              <span>BTC:</span>
              <span className="text-emerald-400 font-bold">$96,420</span>
            </span>
            <span className="flex items-center space-x-1">
              <DollarSign className="h-3 w-3 text-amber-400 shrink-0" />
              <span>10Y YIELD:</span>
              <span className="text-amber-300 font-bold">4.42%</span>
            </span>
            <span className="flex items-center space-x-1 hidden sm:flex">
              <Rocket className="h-3 w-3 text-rose-400 shrink-0" />
              <span>VC ROUNDS (24H):</span>
              <span className="text-white font-bold">$1.84B</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Hero Grid (1 Main Lead + 3 Secondary) */}
      <HeroGrid
        leadStory={heroStories.leadStory}
        secondaryStories={heroStories.secondaryStories}
      />

      {/* Top Banner AdSlot Placeholder */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdSlot slotId="trendintel-home-leaderboard" format="horizontal" />
      </div>

      {/* 3. Dynamic Category Filter Tabs & Latest Articles Feed */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <CategoryFilterTabs
          categories={categories}
          initialArticles={paginatedResult.articles}
        />

        {/* Pagination Controls */}
        {paginatedResult.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-4 border-t border-white/10 pt-8 font-mono text-xs">
            {currentPage > 1 ? (
              <Link
                href={`/?page=${currentPage - 1}`}
                className="flex items-center space-x-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-300 hover:border-amber-400 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>PREVIOUS</span>
              </Link>
            ) : (
              <span className="flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-2 text-slate-600 cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" />
                <span>PREVIOUS</span>
              </span>
            )}

            <span className="text-slate-400 font-semibold">
              PAGE {currentPage} OF {paginatedResult.totalPages}
            </span>

            {currentPage < paginatedResult.totalPages ? (
              <Link
                href={`/?page=${currentPage + 1}`}
                className="flex items-center space-x-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-300 hover:border-amber-400 hover:text-white"
              >
                <span>NEXT</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-2 text-slate-600 cursor-not-allowed">
                <span>NEXT</span>
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
