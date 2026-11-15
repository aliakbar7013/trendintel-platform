import { CheckCircle2, Zap } from "lucide-react";

interface KeyTakeawaysCardProps {
  takeaways: string[];
}

export default function KeyTakeawaysCard({ takeaways }: KeyTakeawaysCardProps) {
  if (!takeaways || takeaways.length === 0) return null;

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-[#0f1118] to-[#121622] p-6 shadow-xl backdrop-blur-md">
      <div className="mb-4 flex items-center space-x-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
          <Zap className="h-4 w-4" />
        </div>
        <h3 className="text-base font-bold uppercase tracking-wider text-amber-400 font-mono">
          Executive Takeaways
        </h3>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {takeaways.map((point, idx) => (
          <li key={idx} className="flex items-start space-x-3 text-sm text-slate-200">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span className="leading-snug">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
