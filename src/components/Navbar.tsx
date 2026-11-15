"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Menu,
  X,
  Shield,
  TrendingUp,
  Rss,
  ExternalLink,
  LogOut,
  Sliders,
} from "lucide-react";

const CATEGORIES = [
  { name: "AI & Tech", slug: "ai-tech", color: "#00f0ff" },
  { name: "Crypto & Web3", slug: "crypto-web3", color: "#10b981" },
  { name: "Global Finance", slug: "global-finance", color: "#f59e0b" },
  { name: "Startups & Business", slug: "startups-business", color: "#f43f5e" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";
  const isAdminDashboard = pathname === "/admin";
  const isAdminArea = pathname.startsWith("/admin");

  useEffect(() => {
    setIsNavigating(false);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Handle Escape key to close mobile drawers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsNavigating(true);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
      setIsSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Non-blocking
    }
    router.push("/admin/login");
    router.refresh();
  };

  const handleBureauClick = (e: React.MouseEvent) => {
    if (isLoginPage) {
      e.preventDefault();
      const input = document.getElementById("bureau-password-input") as HTMLInputElement;
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      setIsNavigating(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#08090d]/95 backdrop-blur-md">
      {/* Top micro progress bar for instantaneous navigation feedback */}
      {isNavigating && (
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 animate-pulse z-50 shadow-[0_0_10px_rgba(245,158,11,0.9)]" />
      )}

      {/* ========================================================
          CASE 1: PRIVATE OPERATOR HEADER (When in /admin area)
          Removes public categories, search, RSS and presents
          a dedicated restricted bureau operator interface
         ======================================================== */}
      {isAdminArea ? (
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-2.5 sm:px-6 sm:py-3 lg:px-8">
          {/* Private Bureau Brand */}
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <Link
              href={isAdminDashboard ? "/admin" : "/"}
              prefetch={false}
              onClick={() => setIsNavigating(true)}
              className="group flex items-center space-x-2 shrink-0"
              aria-label="TrendIntel Bureau Terminal"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white transition group-hover:text-amber-400 font-mono">
                TRENDINTEL <span className="text-amber-400">BUREAU</span>
              </span>
            </Link>

            <span className="hidden sm:inline-block rounded px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
              {isLoginPage ? "RESTRICTED CHECKPOINT" : "OPERATOR CONTROL"}
            </span>
          </div>

          {/* Private Center Status / Diagnostics */}
          <nav className="hidden items-center space-x-3 lg:flex" aria-label="Bureau Operator Navigation">
            {isAdminDashboard ? (
              <div className="flex items-center space-x-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-1.5 text-xs font-mono text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold uppercase tracking-wider">Authenticated Operator Session</span>
                <span className="text-emerald-500/50">•</span>
                <span className="text-slate-400">Autopilot Active (50/day)</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 rounded-lg border border-amber-500/30 bg-amber-950/20 px-3.5 py-1.5 text-xs font-mono text-amber-300">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Restricted Editorial Terminal • Credentials Required</span>
              </div>
            )}
          </nav>

          {/* Private Right Side Navigation Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* View Live Public Site */}
            <Link
              href="/"
              prefetch={false}
              onClick={() => setIsNavigating(true)}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-mono font-semibold text-slate-300 hover:border-amber-400 hover:text-white transition shadow-sm"
              title="Exit Bureau and view public website"
            >
              <span>View Live Site</span>
              <ExternalLink className="h-3.5 w-3.5 text-amber-400" />
            </Link>

            {isAdminDashboard && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 rounded-lg border border-rose-500/30 bg-rose-950/20 px-3 py-1.5 text-xs font-mono font-bold text-rose-300 hover:bg-rose-900/30 transition"
                title="Logout of Bureau Session"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            {/* Mobile menu button for Bureau */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 lg:hidden transition"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-bureau-drawer"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================
            CASE 2: PUBLIC SITE HEADER (For all public readers)
            Displays categories, search bar, RSS wire, Trends Hub
           ======================================================== */
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-2.5 sm:px-6 sm:py-3 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 sm:space-x-6 min-w-0">
            <Link
              href="/"
              prefetch={false}
              onClick={() => setIsNavigating(true)}
              className="group flex items-center space-x-2 shrink-0"
              aria-label="TrendIntel Home"
            >
              <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-base sm:text-xl font-black tracking-tight text-white transition group-hover:text-amber-400 font-mono">
                TRENDINTEL<span className="text-amber-400">.BLOG</span>
              </span>
            </Link>

            {/* Desktop Categories */}
            <nav className="hidden items-center space-x-1 lg:flex" aria-label="Primary Navigation">
              {CATEGORIES.map((cat) => {
                const isActive = pathname === `/category/${cat.slug}`;
                return (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    prefetch={false}
                    onClick={() => setIsNavigating(true)}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                      isActive
                        ? "bg-white/10 text-white font-bold shadow-sm"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </Link>
                );
              })}

              {/* Trends Hub Link */}
              <Link
                href="/trends"
                prefetch={false}
                onClick={() => setIsNavigating(true)}
                aria-current={pathname.startsWith("/trends") ? "page" : undefined}
                className={`flex items-center space-x-1 rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition hover:bg-white/5 ${
                  pathname.startsWith("/trends")
                    ? "bg-amber-400/10 text-amber-300 font-bold border border-amber-500/30"
                    : "text-amber-400"
                }`}
              >
                <TrendingUp className="h-3 w-3" />
                <span>Trends Hub</span>
              </Link>
            </nav>
          </div>

          {/* Right Side Search & Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search intelligence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-36 lg:w-48 rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 pl-8 text-xs text-white placeholder-slate-400 outline-none transition focus:w-56 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-sans"
              />
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            </form>

            {/* Mobile Search Icon Toggle */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 transition"
              aria-label="Toggle search input"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* RSS Feed Icon */}
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              title="RSS 2.0 Wire Feed"
              className="hidden items-center rounded-md border border-slate-700/60 bg-slate-900/60 p-1.5 text-slate-400 transition hover:border-amber-500/50 hover:text-amber-400 sm:flex"
            >
              <Rss className="h-3.5 w-3.5" />
            </a>

            {/* Bureau Access Button */}
            <Link
              href="/admin/login"
              prefetch={false}
              onClick={() => setIsNavigating(true)}
              title="Editorial Bureau Control Panel"
              className="hidden items-center space-x-1 rounded-md border border-slate-700/60 bg-slate-900/60 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-amber-500/50 hover:text-amber-300 transition sm:flex"
            >
              <Shield className="h-3 w-3 text-amber-400" />
              <span>Bureau</span>
            </Link>

            {/* Mobile Hamburger / Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 lg:hidden transition"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Inline Search Bar Dropdown (Only for public view) */}
      {!isAdminArea && isSearchOpen && (
        <div className="border-t border-slate-800 bg-[#0c0e15] px-4 py-3 md:hidden animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              autoFocus
              placeholder="Search news, topics, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-amber-400/50 bg-slate-900 px-3 py-2 pl-9 pr-8 text-sm text-white placeholder-slate-400 outline-none focus:border-amber-400"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-amber-400" />
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Overlay Backdrop */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 top-[53px] sm:top-[57px] bg-black/75 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div
          id={isAdminArea ? "mobile-bureau-drawer" : "mobile-nav-drawer"}
          className="relative z-50 border-b border-slate-800 bg-[#0d0f16] px-4 py-4 lg:hidden max-h-[calc(100dvh-60px)] overflow-y-auto shadow-2xl"
        >
          {isAdminArea ? (
            /* ========================================================
               PRIVATE BUREAU MOBILE MENU
               Shows only operator actions and controls
               ======================================================== */
            <div className="flex flex-col space-y-2 font-mono">
              <div className="px-1 pb-1 pt-1 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Editorial Bureau Control Options
              </div>

              <Link
                href="/admin"
                prefetch={false}
                onClick={() => {
                  setIsNavigating(true);
                  setIsMenuOpen(false);
                }}
                className="flex min-h-[44px] items-center space-x-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-sm font-semibold text-amber-300"
              >
                <Shield className="h-4 w-4 text-amber-400" />
                <span>Bureau Terminal Overview</span>
              </Link>

              <Link
                href="/"
                prefetch={false}
                onClick={() => {
                  setIsNavigating(true);
                  setIsMenuOpen(false);
                }}
                className="flex min-h-[44px] items-center space-x-3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm font-semibold text-slate-200 hover:text-white"
              >
                <ExternalLink className="h-4 w-4 text-slate-400" />
                <span>Exit to Live Public Website</span>
              </Link>

              {isAdminDashboard && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex min-h-[44px] items-center space-x-3 rounded-lg border border-rose-500/30 bg-rose-950/20 px-3 py-2.5 text-sm font-semibold text-rose-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout Bureau Session</span>
                </button>
              )}

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                <span>trendintel.blog Bureau Security Layer</span>
              </div>
            </div>
          ) : (
            /* ========================================================
               PUBLIC MOBILE MENU
               ======================================================== */
            <>
              {/* Quick Search inside Drawer */}
              <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search news, topics, keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 pl-9 text-sm text-white placeholder-slate-400 outline-none focus:border-amber-400 font-sans"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </form>

              <div className="flex flex-col space-y-1">
                <div className="px-1 pb-1 pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                  Intelligence Desks
                </div>
                {CATEGORIES.map((cat) => {
                  const isActive = pathname === `/category/${cat.slug}`;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      prefetch={false}
                      onClick={() => {
                        setIsNavigating(true);
                        setIsMenuOpen(false);
                      }}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex min-h-[44px] items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                        isActive
                          ? "bg-white/10 text-white font-bold"
                          : "text-slate-200 hover:bg-slate-800/80 hover:text-white"
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.name}</span>
                    </Link>
                  );
                })}

                <div className="pt-2 border-t border-slate-800/80 my-2">
                  <Link
                    href="/trends"
                    prefetch={false}
                    onClick={() => {
                      setIsNavigating(true);
                      setIsMenuOpen(false);
                    }}
                    aria-current={pathname.startsWith("/trends") ? "page" : undefined}
                    className="flex min-h-[44px] items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-amber-400 hover:bg-slate-800 transition"
                  >
                    <TrendingUp className="h-4 w-4 shrink-0" />
                    <span>Topic & Trend Hubs Directory</span>
                  </Link>
                </div>

                {/* Mobile Footer Links inside Drawer */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <Link
                    href="/editorial-policy"
                    prefetch={false}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-slate-400 hover:text-white py-1"
                  >
                    Editorial Policy
                  </Link>
                  <a
                    href="/feed.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline flex items-center space-x-1 py-1"
                  >
                    <Rss className="h-3 w-3" />
                    <span>RSS Wire</span>
                  </a>
                  <Link
                    href="/admin/login"
                    prefetch={false}
                    onClick={() => {
                      setIsNavigating(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-amber-300 font-semibold"
                  >
                    <Shield className="h-3.5 w-3.5 text-amber-400" />
                    <span>Admin Bureau</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
