import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | TrendIntel",
  description:
    "Terms and conditions governing the use of TrendIntel's digital news publication and syndicated data services.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-white/10 pb-8 mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
          LEGAL & REGULATORY AGREEMENT
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-white">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-slate-400 font-mono">
          Last Updated: Current Year • trendintel.blog
        </p>
      </div>

      <div className="prose prose-invert prose-slate max-w-none text-slate-300">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By visiting, accessing, or reading TrendIntel (&quot;we,&quot; &quot;our,&quot; or &quot;the publication&quot;) at <code>trendintel.blog</code>, you agree to comply with and be bound by these Terms of Service. If you do not accept these terms, please discontinue using the service.
        </p>

        <h2>2. Informational & Editorial Disclaimer</h2>
        <p>
          The content published on TrendIntel is provided strictly for educational, informational, and news analysis purposes. <strong>Nothing published on this website constitutes financial, investment, legal, or tax advice.</strong> Neither TrendIntel nor its contributing authors recommend purchasing or selling any specific equity, cryptocurrency, digital asset, or venture instrument.
        </p>

        <h2>3. Intellectual Property & Syndication</h2>
        <p>
          TrendIntel respects intellectual property rights. All original analysis, syntheses, executive takeaways, and compilation arrangements are the property of TrendIntel. External trademarks, corporate logos, and primary news dispatches cited or linked remain the property of their respective owners under Fair Use journalistic doctrine.
        </p>

        <h2>4. Prohibited Usage</h2>
        <p>
          You agree not to use automated scripts, denial-of-service tools, or malicious scrapers to disrupt the operational availability of TrendIntel servers or bypass rate limits.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          In no event shall TrendIntel, its owners, or infrastructure operators be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the publications or information presented on the platform.
        </p>
      </div>
    </div>
  );
}
