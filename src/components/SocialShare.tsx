"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

interface SocialShareProps {
  title: string;
  slug: string;
}

export default function SocialShare({ title, slug }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const articleUrl = `https://trendintel.blog/article/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(articleUrl)}`;

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    articleUrl
  )}`;

  const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${title} ${articleUrl}`
  )}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4 my-8">
      <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
        <Share2 className="h-4 w-4 text-amber-400" />
        <span>Transmit Intelligence</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 min-h-[36px]"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* X / Twitter */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white min-h-[36px]"
        >
          X (Twitter)
        </a>

        {/* LinkedIn */}
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white min-h-[36px]"
        >
          LinkedIn
        </a>

        {/* WhatsApp */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white min-h-[36px]"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
