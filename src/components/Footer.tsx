import Link from "next/link";
import { ShieldCheck, Rss, ArrowUpRight, TrendingUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#06070a] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Bureau Mission */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center space-x-2 font-mono text-lg font-black text-white">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>TRENDINTEL<span className="text-amber-400">.BLOG</span></span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-slate-400 max-w-sm">
              Continuous algorithmic intelligence and deep analytical journalism monitoring frontier artificial intelligence, digital assets, sovereign finance, and high-growth venture ecosystems.
            </p>
            <div className="mt-4 flex items-center space-x-2 text-[11px] text-emerald-400/90 font-mono">
              <ShieldCheck className="h-4 w-4" />
              <span>Strict Editorial Transparency & Full Source Attribution</span>
            </div>
          </div>

          {/* Intelligence Desks */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Intelligence Desks
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/category/ai-tech" className="hover:text-amber-400 transition">
                  AI & Enterprise Tech
                </Link>
              </li>
              <li>
                <Link href="/category/crypto-web3" className="hover:text-amber-400 transition">
                  Crypto & Web3 Markets
                </Link>
              </li>
              <li>
                <Link href="/category/global-finance" className="hover:text-amber-400 transition">
                  Global Macro Finance
                </Link>
              </li>
              <li>
                <Link href="/category/startups-business" className="hover:text-amber-400 transition">
                  Startups & Venture Capital
                </Link>
              </li>
              <li>
                <Link href="/trends" className="text-amber-400 hover:underline flex items-center space-x-1 font-semibold">
                  <TrendingUp className="h-3 w-3" />
                  <span>Topic & Trend Hubs Directory</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Trust & Legal
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Bureau
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-white transition">
                  Editorial Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact & Press
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Syndication & Backlink Feeds */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
              <Rss className="h-3.5 w-3.5 text-amber-400" />
              <span>Syndication & Feeds</span>
            </h3>
            <ul className="mt-3 space-y-2 text-xs font-mono">
              <li>
                <Link href="/feed.xml" target="_blank" className="flex items-center space-x-1 hover:text-amber-400">
                  <span>RSS 2.0 Full Wire</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/feed.json" target="_blank" className="flex items-center space-x-1 hover:text-amber-400">
                  <span>JSON Feed 1.1</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" target="_blank" className="flex items-center space-x-1 hover:text-amber-400">
                  <span>XML Sitemap</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-500 hover:text-amber-400">
                  Admin Bureau Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} TrendIntel Bureau (trendintel.blog). All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Automated Internal Link Graph & Webmention Syndication Active</p>
        </div>
      </div>
    </footer>
  );
}
