import Link from "next/link";
import { getArticles } from "@/lib/db";
import ArticleCard from "@/components/ArticleCard";
import { Search, ChevronRight, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", page = "1" } = await searchParams;
  const currentPage = parseInt(page, 10);
  const query = q.trim();

  const results = query
    ? await getArticles({ search: query, page: currentPage, limit: 12 })
    : { articles: [], totalCount: 0, totalPages: 0, currentPage: 1 };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center space-x-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">
          HOME
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-white uppercase font-bold">SEARCH DISPATCHES</span>
      </nav>

      {/* Search Header */}
      <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-10 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-tight">
          Intelligence Search Engine
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Query full text dispatches, executive takeaways, and industry market analysis.
        </p>

        <form action="/search" method="GET" className="mt-6 flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by keywords, companies, technologies, tickers..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-amber-400 px-6 py-3 text-xs font-mono font-bold uppercase text-black hover:bg-amber-300 transition"
          >
            Search
          </button>
        </form>

        {query && (
          <div className="mt-4 text-xs font-mono text-slate-400">
            Showing <span className="text-white font-bold">{results.totalCount}</span> results matching query: <span className="text-amber-400 font-bold">&quot;{query}&quot;</span>
          </div>
        )}
      </div>

      {/* Results Feed */}
      {query ? (
        results.articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-800 py-16 text-center text-slate-500">
            <Layers className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <p className="text-sm font-medium">No dispatches matched your query.</p>
            <p className="text-xs text-slate-600 mt-1">Try broader terms or verify spelling.</p>
          </div>
        )
      ) : (
        <div className="rounded-xl border border-dashed border-slate-800 py-16 text-center text-slate-500">
          <Search className="mx-auto h-8 w-8 text-slate-600 mb-2" />
          <p className="text-sm font-medium">Enter a search keyword above to explore intelligence archives.</p>
        </div>
      )}
    </div>
  );
}
