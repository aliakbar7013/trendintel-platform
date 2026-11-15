"use client";

import { useState } from "react";
import ArticleCard from "./ArticleCard";
import { FormattedArticle } from "@/lib/db";
import { Filter, Layers } from "lucide-react";

interface CategoryFilterTabsProps {
  categories: { name: string; slug: string; color: string | null }[];
  initialArticles: FormattedArticle[];
}

export default function CategoryFilterTabs({
  categories,
  initialArticles,
}: CategoryFilterTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredArticles =
    activeTab === "all"
      ? initialArticles
      : initialArticles.filter((art) => art.category.slug === activeTab);

  return (
    <div className="w-full">
      {/* Category Pills Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
            Latest Intelligence Desks
          </h2>
        </div>

        {/* Tab Buttons - Horizontal swipeable on mobile, flex-wrap on desktop */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => setActiveTab("all")}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition min-h-[36px] flex items-center ${
              activeTab === "all"
                ? "bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                : "border border-white/5 bg-[#0f1118] text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            ALL DESKS ({initialArticles.length})
          </button>

          {categories.map((cat) => {
            const count = initialArticles.filter(
              (a) => a.category.slug === cat.slug
            ).length;

            return (
              <button
                key={cat.slug}
                onClick={() => setActiveTab(cat.slug)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition min-h-[36px] flex items-center ${
                  activeTab === cat.slug
                    ? "text-black shadow-lg"
                    : "border border-white/5 bg-[#0f1118] text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
                style={{
                  backgroundColor:
                    activeTab === cat.slug
                      ? cat.color || "#f59e0b"
                      : undefined,
                }}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Filtered Articles */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <div className="col-span-full rounded-xl border border-dashed border-slate-800 py-16 text-center text-slate-500">
            <Filter className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <p className="text-sm font-medium">No articles currently published in this desk.</p>
            <p className="text-xs text-slate-600 mt-1">
              The automated editorial engine will ingest new dispatches during the next cron cycle.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
