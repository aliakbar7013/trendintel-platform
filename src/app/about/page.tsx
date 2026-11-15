import type { Metadata } from "next";
import { ShieldCheck, Cpu, Globe, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "About TrendIntel | Editorial Bureau & Architecture",
  description:
    "Learn about TrendIntel's automated intelligence bureau, technology architecture, editorial standards, and investigative mission.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-white/10 pb-8 mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
          EDITORIAL BUREAU DOSSIER
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-white">
          About TrendIntel.blog
        </h1>
        <p className="mt-3 text-base text-slate-300 leading-relaxed">
          TrendIntel is an algorithmic news intelligence publication engineered to ingest, verify, analyze, and synthesize planetary-scale developments in artificial intelligence, digital assets, central banking macroeconomics, and venture capital.
        </p>
      </div>

      <div className="prose prose-invert prose-slate max-w-none text-slate-300">
        <h2>1. The Editorial Mission</h2>
        <p>
          In an era saturated with fragmented soundbites and speculative commentary, enterprise operators, founders, and asset managers face acute signal-to-noise deficits. TrendIntel was founded on a singular premise: to deliver continuous, high-signal, deeply contextualized news synthesis at the speed of modern digital infrastructure.
        </p>
        <p>
          We operate around the clock, continuously monitoring high-authority international wire feeds, regulatory filings, corporate releases, and academic research papers across four dedicated desks: <strong>AI & Enterprise Tech</strong>, <strong>Crypto & Web3 Markets</strong>, <strong>Global Macro Finance</strong>, and <strong>Startups & Venture Capital</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 not-prose">
          <div className="rounded-xl border border-white/10 bg-[#0f1118] p-5">
            <Cpu className="h-6 w-6 text-cyan-400 mb-2" />
            <h3 className="text-sm font-bold text-white font-mono uppercase">AI-Augmented Synthesis</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Synthesizing complex multi-source dispatches into structured, readable executive takeaways using state-of-the-art neural reasoning.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0f1118] p-5">
            <ShieldCheck className="h-6 w-6 text-emerald-400 mb-2" />
            <h3 className="text-sm font-bold text-white font-mono uppercase">Original Attribution</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Every synthesized dispatch attributes the original publisher and links to the primary source for full investigative transparency.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0f1118] p-5">
            <Globe className="h-6 w-6 text-amber-400 mb-2" />
            <h3 className="text-sm font-bold text-white font-mono uppercase">Zero Latency Indexing</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Built on Next.js Server-Side Rendering and Hostinger MySQL architecture for rapid distribution and instant search visibility.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0f1118] p-5">
            <Scale className="h-6 w-6 text-rose-400 mb-2" />
            <h3 className="text-sm font-bold text-white font-mono uppercase">Strict Quality Gates</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Automated algorithmic verification ensures minimum length, structured takeaways, FAQs, and factual integrity before publication.
            </p>
          </div>
        </div>

        <h2>2. Architecture & Infrastructure</h2>
        <p>
          TrendIntel runs entirely self-contained on <strong>Hostinger Node.js Web Hosting + Hostinger MySQL</strong>, orchestrated via the Next.js App Router. By eliminating external daemon dependencies such as Redis or detached message queues, the entire ingestion, synthesis, validation, and publishing loop is unified within a secure, high-performance runtime.
        </p>

        <h2>3. Transparency & Disclosures</h2>
        <p>
          TrendIntel utilizes advanced AI synthesis models (including Google Gemini 2.5) to analyze raw news events and format them into readable journalistic intelligence. All synthesized reporting is anchored to verified external source reporting, clearly cited in the <em>Original Source Attribution</em> section of every article.
        </p>
        <p>
          For corrections, inquiries, or syndicated press dispatches, contact our bureau directly at{" "}
          <a href="/contact" className="text-amber-400 font-mono">press@trendintel.blog</a>.
        </p>
      </div>
    </div>
  );
}
