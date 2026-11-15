"use client";

import { useState } from "react";
import { Link2, Copy, Check, Code, FileText, Bookmark } from "lucide-react";

interface CiteWidgetProps {
  title: string;
  slug: string;
  publishedAt: Date;
  sourceName: string;
}

export default function CiteWidget({
  title,
  slug,
  publishedAt,
}: CiteWidgetProps) {
  const [activeTab, setActiveTab] = useState<"html" | "markdown" | "apa">("html");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const siteUrl = "https://trendintel.blog";
  const canonicalUrl = `${siteUrl}/article/${slug}`;
  const pubDate = new Date(publishedAt);
  const year = pubDate.getFullYear();
  const monthName = pubDate.toLocaleString("en-US", { month: "long" });
  const day = pubDate.getDate();

  // Snippets
  const htmlSnippet = `<a href="${canonicalUrl}" target="_blank" rel="noopener">${title} — TrendIntel</a>`;
  const markdownSnippet = `[${title}](${canonicalUrl}) via TrendIntel.blog`;
  const apaSnippet = `TrendIntel Editorial Bureau. (${year}, ${monthName} ${day}). ${title}. TrendIntel.blog. ${canonicalUrl}`;

  const currentSnippet =
    activeTab === "html"
      ? htmlSnippet
      : activeTab === "markdown"
      ? markdownSnippet
      : apaSnippet;

  const handleCopy = async (type: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="not-prose my-8 rounded-2xl border border-white/10 bg-[#0c0e15] p-5 sm:p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
          <Link2 className="h-4 w-4" />
          <span>Cite or Embed This Analysis</span>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Syndication & Citation License: Attribution 4.0
        </span>
      </div>

      <p className="mt-3 text-xs text-slate-400 leading-relaxed">
        Writing an article, newsletter dispatch, or research report? Use these pre-formatted snippets to cite TrendIntel and link to this verified analysis:
      </p>

      {/* Format Selector Tabs */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab("html")}
          className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition min-h-[36px] ${
            activeTab === "html"
              ? "bg-amber-400 text-black shadow-md shadow-amber-500/20"
              : "border border-white/5 bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Code className="h-3 w-3" />
          <span>HTML Backlink</span>
        </button>

        <button
          onClick={() => setActiveTab("markdown")}
          className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition min-h-[36px] ${
            activeTab === "markdown"
              ? "bg-amber-400 text-black shadow-md shadow-amber-500/20"
              : "border border-white/5 bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="h-3 w-3" />
          <span>Markdown Citation</span>
        </button>

        <button
          onClick={() => setActiveTab("apa")}
          className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition min-h-[36px] ${
            activeTab === "apa"
              ? "bg-amber-400 text-black shadow-md shadow-amber-500/20"
              : "border border-white/5 bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Bookmark className="h-3 w-3" />
          <span>APA / Academic</span>
        </button>
      </div>

      {/* Code Display & Copy Button */}
      <div className="mt-3 relative rounded-xl border border-slate-800 bg-[#07080c] p-3.5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <pre className="font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap break-all flex-1">
            {currentSnippet}
          </pre>

          <button
            onClick={() => handleCopy(activeTab, currentSnippet)}
            className="self-end sm:self-start flex shrink-0 items-center space-x-1 rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs font-mono font-bold text-amber-300 transition hover:bg-slate-700 hover:text-white min-h-[34px]"
          >
            {copiedType === activeTab ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
