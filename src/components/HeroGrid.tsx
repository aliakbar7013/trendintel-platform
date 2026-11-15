import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Sparkles, TrendingUp } from "lucide-react";
import { FormattedArticle } from "@/lib/db";

interface HeroGridProps {
  leadStory: FormattedArticle | null;
  secondaryStories: FormattedArticle[];
}

export default function HeroGrid({ leadStory, secondaryStories }: HeroGridProps) {
  if (!leadStory) return null;

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
        {/* Main Lead Story (8 cols) */}
        <div className="lg:col-span-8">
          <Link
            href={`/article/${leadStory.slug}`}
            className="group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl transition duration-300 hover:border-amber-500/50 min-h-[380px] sm:min-h-[460px] lg:min-h-[560px]"
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src={leadStory.featuredImage}
                alt={leadStory.title}
                fill
                priority
                className="object-cover transition duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/65 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 p-4 sm:p-7 lg:p-10">
              {/* Category & Status Badges */}
              <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-black"
                  style={{ backgroundColor: leadStory.category.color || "#f59e0b" }}
                >
                  {leadStory.category.name}
                </span>

                {leadStory.isBreaking && (
                  <span className="flex items-center space-x-1 rounded-full bg-rose-500/90 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono font-semibold text-white">
                    <Sparkles className="h-3 w-3" />
                    <span>LEAD DISPATCH</span>
                  </span>
                )}

                <span className="flex items-center space-x-1 text-[11px] sm:text-xs text-slate-300 font-mono">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{leadStory.readingTime} min read</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight group-hover:text-amber-300 transition">
                {leadStory.title}
              </h1>

              {/* Excerpt */}
              <p className="mt-2.5 sm:mt-3 line-clamp-2 text-xs sm:text-sm md:text-base text-slate-300">
                {leadStory.excerpt}
              </p>

              {/* Metadata footer */}
              <div className="mt-4 sm:mt-6 flex items-center justify-between border-t border-white/10 pt-3 sm:pt-4 text-[11px] sm:text-xs text-slate-400 font-mono">
                <span className="truncate max-w-[60%]">Source: {leadStory.sourceName}</span>
                <span className="flex items-center space-x-1 shrink-0">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{leadStory.views} views</span>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* 3 Secondary Stories (4 cols) */}
        <div className="flex flex-col justify-between gap-4 lg:col-span-4">
          <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Trending Dispatches
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {secondaryStories.map((item, idx) => (
              <Link
                key={item.id}
                href={`/article/${item.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-white/5 bg-[#0f1118] p-4 transition duration-200 hover:border-white/20 hover:bg-[#161922]"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className="rounded px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-black"
                      style={{ backgroundColor: item.category.color || "#f59e0b" }}
                    >
                      {item.category.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.readingTime}m read
                    </span>
                  </div>

                  <h3 className="line-clamp-2 text-sm font-bold text-white transition group-hover:text-amber-400">
                    {item.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-xs text-slate-400">
                    {item.excerpt}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-2 text-[11px] text-slate-500 font-mono">
                  <span>{item.sourceName}</span>
                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
