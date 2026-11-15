import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-6">
        <AlertCircle className="h-8 w-8" />
      </div>

      <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
        404 • DISPATCH NOT FOUND
      </span>

      <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl font-mono">
        Intelligence Record Missing
      </h1>

      <p className="mt-3 max-w-md text-sm text-slate-400 leading-relaxed">
        The requested analysis or category slug does not exist or has been re-indexed. Return to the main intelligence wire or search the archive.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="flex items-center space-x-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-mono font-bold uppercase text-black hover:bg-amber-300 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Front Page</span>
        </Link>
        <Link
          href="/search"
          className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs font-mono font-bold uppercase text-slate-300 hover:border-slate-500 hover:text-white transition"
        >
          Search Bureau Archive
        </Link>
      </div>
    </div>
  );
}
