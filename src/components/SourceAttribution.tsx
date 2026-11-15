import { ExternalLink, ShieldCheck } from "lucide-react";

interface SourceAttributionProps {
  sourceName: string;
  sourceUrl: string;
  publishedAt: Date;
}

export default function SourceAttribution({
  sourceName,
  sourceUrl,
  publishedAt,
}: SourceAttributionProps) {
  return (
    <div className="my-8 rounded-xl border border-white/10 bg-[#0d0f15] p-5">
      <div className="flex items-start space-x-3.5">
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="h-4 w-4" />
        </div>

        <div className="flex-1 text-xs leading-relaxed text-slate-300">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono font-bold uppercase tracking-wider text-slate-200">
              Editorial Verification & Source Attribution
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Synthesized: {new Date(publishedAt).toLocaleDateString()}
            </span>
          </div>

          <p className="mt-2 text-slate-400">
            TrendIntel synthesized and expanded this intelligence analysis based on primary coverage and initial dispatch signals reported by{" "}
            <strong className="text-white font-medium">{sourceName}</strong>.
            To explore the original publication dispatch, reference the verified link below.
          </p>

          <div className="mt-3">
            <a
              href={sourceUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-amber-400 transition hover:border-amber-400 hover:bg-slate-800"
            >
              <span>Source: {sourceName}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
