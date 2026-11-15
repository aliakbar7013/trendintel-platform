import Link from "next/link";
import { Zap } from "lucide-react";
import { FormattedArticle } from "@/lib/db";

interface BreakingTickerProps {
  headlines: FormattedArticle[];
}

export default function BreakingTicker({ headlines }: BreakingTickerProps) {
  if (!headlines || headlines.length === 0) return null;

  return (
    <div className="relative border-b border-white/5 bg-[#0d0f17] text-xs">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-2 sm:px-6 lg:px-8 overflow-hidden">
        {/* Static Badge */}
        <div className="flex shrink-0 items-center space-x-1.5 rounded bg-rose-500/10 px-2.5 py-1 text-rose-400 border border-rose-500/20 mr-4 font-mono uppercase tracking-wider font-bold">
          <Zap className="h-3 w-3 animate-pulse text-rose-500" />
          <span>WIRE</span>
        </div>

        {/* Marquee or Scrolling Ticker */}
        <div className="relative w-full overflow-hidden whitespace-nowrap">
          <div className="animate-ticker flex space-x-8">
            {headlines.concat(headlines).map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                href={`/article/${item.slug}`}
                className="group flex items-center space-x-2 text-slate-300 transition hover:text-amber-400"
              >
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-black font-mono"
                  style={{ backgroundColor: item.category.color || "#f59e0b" }}
                >
                  {item.category.name}
                </span>
                <span className="font-medium group-hover:underline">
                  {item.title}
                </span>
                <span className="text-slate-600 font-mono">/</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
