import Link from "next/link";
import Image from "next/image";
import { Clock, Eye } from "lucide-react";
import { FormattedArticle } from "@/lib/db";

interface ArticleCardProps {
  article: FormattedArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#0f1118] transition duration-200 hover:border-white/20 hover:bg-[#151822]">
      {/* Thumbnail */}
      <Link
        href={`/article/${article.slug}`}
        className="relative block aspect-[16/9] w-full overflow-hidden bg-slate-900"
      >
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          className="object-cover transition duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3 z-10">
          <span
            className="rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-black shadow"
            style={{ backgroundColor: article.category.color || "#f59e0b" }}
          >
            {article.category.name}
          </span>
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-2 flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{article.readingTime} min</span>
            </span>
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>

          <h3 className="line-clamp-2 text-base font-bold text-white transition group-hover:text-amber-400 leading-snug">
            <Link href={`/article/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
            {article.excerpt}
          </p>
        </div>

        {/* Card Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-slate-500 font-mono">
          <span className="truncate max-w-[60%]">Via {article.sourceName}</span>
          <span className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{article.views}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
