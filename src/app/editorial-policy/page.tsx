import type { Metadata } from "next";
import { CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial & Verification Policy | TrendIntel",
  description:
    "TrendIntel's comprehensive editorial standards, AI-assisted news synthesis framework, source attribution rules, and corrections policy.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-white/10 pb-8 mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
          EDITORIAL STANDARDS & METHODOLOGY
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-white">
          Editorial & Verification Policy
        </h1>
        <p className="mt-3 text-base text-slate-300 leading-relaxed">
          TrendIntel adheres to strict journalistic principles regarding algorithmic synthesis, transparent source attribution, factual verification, and intellectual property respect.
        </p>
      </div>

      <div className="prose prose-invert prose-slate max-w-none text-slate-300">
        <h2>1. Algorithmic Ingestion & News Curation</h2>
        <p>
          TrendIntel continuously monitors trusted, verified RSS wire channels representing authoritative primary publications—including global news agencies, official regulatory bodies, corporate investor relations portals, and established technology bureaus.
        </p>
        <p>
          Our automated ingestion engine performs deduplication using SHA-256 cryptographic hashing to ensure that repeating dispatches or syndicated duplicates are eliminated before processing.
        </p>

        <h2>2. Full-Text Extraction & Paywall Respect</h2>
        <p>
          Our extraction layer leverages Mozilla Readability and DOM parsing to isolate the core factual reporting of an event. In strict accordance with web scraping ethics and digital copyright protections:
        </p>
        <ul>
          <li>TrendIntel never attempts to bypass access controls, subscription paywalls, or bot mitigation challenges.</li>
          <li>Any content requiring paid authorization or indicating a subscriber barrier is immediately skipped by the pipeline.</li>
          <li>Dispatches containing insufficient textual detail (fewer than 250 characters) are rejected to prevent hallucination or context distortion.</li>
        </ul>

        <h2>3. AI-Assisted Synthesis & Originality Mandate</h2>
        <p>
          The core analysis published on TrendIntel is synthesized using frontier large language models (Google Gemini 2.5 Flash). The prompt architecture enforces strict journalistic tenets:
        </p>
        <ul>
          <li><strong>No Verbatim Copying:</strong> The engine is explicitly prohibited from copying sentences or phrasing verbatim from source materials. All analysis is reframed through an analytical, second-order perspective.</li>
          <li><strong>Contextual Value-Add:</strong> Articles are enriched with structured <em>What Happened</em>, <em>Why It Matters</em>, and <em>Market Impact</em> sections, along with 4 executive takeaways and 3 reader FAQs.</li>
          <li><strong>Quality Gates:</strong> Every synthesized dispatch passes through an automated validation gate requiring a minimum of 450 words, non-empty metadata, and zero conversational AI boilerplate before publication.</li>
        </ul>

        <h2>4. Transparent Source Attribution</h2>
        <p>
          TrendIntel believes in giving full, undeniable credit to original reporters and publishers who break news on the ground. Every article published on our platform includes a dedicated <strong>Original Source Attribution</strong> box featuring:
        </p>
        <ul>
          <li>The clear name of the primary reporting outlet (e.g., TechCrunch, The Verge, CoinDesk, Yahoo Finance, etc.).</li>
          <li>A direct, outbound hyperlink with <code>rel=&quot;nofollow noopener&quot;</code> pointing to the original story for reader exploration.</li>
          <li>The timestamp and date of primary reporting synthesis.</li>
        </ul>

        <h2>5. Corrections & Dispute Resolution</h2>
        <p>
          If an original publisher, corporate entity, or reader identifies an error, mischaracterization, or intellectual property concern in any TrendIntel article:
        </p>
        <ol>
          <li>Submit a formal inquiry via our <a href="/contact" className="text-amber-400">Contact Portal</a> or email <code>editor@trendintel.blog</code> with the subject line <em>&quot;Correction Request&quot;</em>.</li>
          <li>Include the specific article URL and supporting documentation.</li>
          <li>Our editorial desk reviews and remedies verified inaccuracies within 24 business hours. If an article does not meet our accuracy thresholds, it will be amended or permanently removed from our MySQL archives.</li>
        </ol>
      </div>
    </div>
  );
}
