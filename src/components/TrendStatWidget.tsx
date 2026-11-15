"use client";

import { useState } from "react";
import { TrendingUp, Copy, Check, BarChart2 } from "lucide-react";
import { TrendStat } from "@/lib/starter-data";

interface TrendStatWidgetProps {
  stat: TrendStat;
  articleTitle: string;
  articleSlug: string;
}

export default function TrendStatWidget({
  stat,
  articleTitle,
  articleSlug,
}: TrendStatWidgetProps) {
  const [copied, setCopied] = useState(false);

  if (!stat || !stat.metric || !stat.label) return null;

  const handleCopyCitation = async () => {
    const citation = `"${stat.metric} — ${stat.label}" (Intelligence Source: TrendIntel.blog: https://trendintel.blog/article/${articleSlug})`;
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-[#0d1017] to-[#121622] p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
          <BarChart2 className="h-4 w-4" />
          <span>MARKET SNAPSHOT & QUANTITATIVE BENCHMARK</span>
        </div>

        <button
          onClick={handleCopyCitation}
          className="flex items-center space-x-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-mono text-cyan-300 transition hover:bg-cyan-500/20"
          title="Copy verified stat for your article or newsletter"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Stat Citation Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy Stat Citation</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
              {stat.metric}
            </span>
            {stat.change && (
              <span className="flex items-center space-x-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span>{stat.change}</span>
              </span>
            )}
          </div>
          <h4 className="mt-1 text-sm font-bold text-slate-200 uppercase font-mono">
            {stat.label}
          </h4>
        </div>
      </div>

      <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
        {stat.context}
      </p>

      <div className="mt-4 border-t border-white/5 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Verified by TrendIntel Bureau Analytics</span>
        <span className="text-cyan-400/80">Press & Media Embed Asset</span>
      </div>
    </div>
  );
}
