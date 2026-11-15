import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategoryBySlug, getArticles, getCategories } from "@/lib/db";
import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";
import { ChevronRight, ChevronLeft, Layers, Rss } from "lucide-react";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found | TrendIntel" };
  }

  const pageUrl = `https://trendintel.blog/category/${category.slug}`;

  return {
    title: `${category.name} Intelligence & Trends | TrendIntel`,
    description:
      category.description ||
      `Comprehensive news intelligence and deep trend analysis covering ${category.name}.`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${category.name} Intelligence & Trends`,
      description:
        category.description ||
        `Continuous news analysis covering ${category.name}.`,
      url: pageUrl,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);

  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const paginatedResult = await getArticles({
    categorySlug: slug,
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
        <span className="text-slate-500 uppercase">CATEGORIES</span>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-white uppercase font-bold">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: category.color || "#f59e0b" }}
              />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                INTELLIGENCE DESK
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              {category.name}
            </h1>

            <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
              {category.description}
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-slate-400">
              <span className="font-bold text-white">
                {paginatedResult.totalCount}
              </span>{" "}
              PUBLISHED DISPATCHES
            </div>
          </div>
        </div>
      </div>

      <AdSlot slotId={`trendintel-cat-${category.slug}`} format="horizontal" />

      {/* Articles Feed */}
      <section className="mt-8">
        {paginatedResult.articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedResult.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-800 py-16 text-center text-slate-500">
            <Layers className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <p className="text-sm font-medium">No published articles found in this category yet.</p>
          </div>
        )}

        {/* Pagination */}
        {paginatedResult.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-4 border-t border-white/10 pt-8 font-mono text-xs">
            {currentPage > 1 ? (
              <Link
                href={`/category/${slug}?page=${currentPage - 1}`}
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
                href={`/category/${slug}?page=${currentPage + 1}`}
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
