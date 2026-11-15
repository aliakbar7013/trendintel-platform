"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Layers,
  FileText,
  Rss,
  Clock,
  Eye,
  Play,
  RotateCw,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  X,
  Plus,
  LogOut,
  Mail,
  Search,
  Sparkles,
  Link2,
  Share2,
  Copy,
  Send,
  Globe,
  Radio,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Sliders,
  Check,
  Zap,
  Cpu,
  Target,
  BookOpen,
  TrendingUp,
} from "lucide-react";

interface AdminDashboardProps {
  initialStats: {
    totalArticles: number;
    totalViews: number;
    totalCategories: number;
    totalFeeds: number;
    latestCron: any;
    topReferrals: any[];
  };
  initialSettings?: {
    adsEnabled: boolean;
    adsenseClientId: string;
    autoPilotEnabled?: boolean;
    targetDailyArticles?: number;
    articlesPerRun?: number;
    cronIntervalMinutes?: number;
  };
}

export default function AdminDashboard({ initialStats, initialSettings }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "articles" | "feeds" | "backlinks" | "cron-logs" | "messages" | "monetization" | "blueprint"
  >("overview");
  const [stats, setStats] = useState(initialStats);
  const router = useRouter();

  // Monetization & Google AdSense state
  const [adsEnabled, setAdsEnabled] = useState(initialSettings?.adsEnabled ?? false);
  const [adsenseClientId, setAdsenseClientId] = useState(initialSettings?.adsenseClientId ?? "ca-pub-XXXXXXXXXXXXXXXX");
  const [isUpdatingAds, setIsUpdatingAds] = useState(false);
  const [adsSavedNotice, setAdsSavedNotice] = useState(false);

  // 50 Blogs/Day Auto-Pilot state
  const [autoPilotActive, setAutoPilotActive] = useState(initialSettings?.autoPilotEnabled ?? true);
  const [targetDailyArticles, setTargetDailyArticles] = useState(initialSettings?.targetDailyArticles ?? 50);
  const [articlesPerRun, setArticlesPerRun] = useState(initialSettings?.articlesPerRun ?? 2);
  const [cronIntervalMinutes, setCronIntervalMinutes] = useState(initialSettings?.cronIntervalMinutes ?? 30);
  const [isUpdatingAutoPilot, setIsUpdatingAutoPilot] = useState(false);

  // Auto-Publisher state
  const [isRunningPublisher, setIsRunningPublisher] = useState(false);
  const [publisherResult, setPublisherResult] = useState<any>(null);

  // Articles state
  const [articles, setArticles] = useState<any[]>([]);
  const [articlesSearch, setArticlesSearch] = useState("");
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);

  // Outreach Pitch Modal state
  const [outreachModalArticle, setOutreachModalArticle] = useState<any | null>(null);
  const [outreachLoading, setOutreachLoading] = useState(false);
  const [pitchContent, setPitchContent] = useState<string>("");
  const [pitchCopied, setPitchCopied] = useState(false);

  // Feeds & Categories state
  const [categories, setCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newFeedName, setNewFeedName] = useState("");
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [selectedFeedCatId, setSelectedFeedCatId] = useState("");

  // Cron logs state
  const [cronLogs, setCronLogs] = useState<any[]>([]);

  // Messages state
  const [messages, setMessages] = useState<any[]>([]);

  // Feedback notification
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);

  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  };

  const fetchStats = async () => {
    setIsRefreshingStats(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch {
      // Non-blocking
    } finally {
      setIsRefreshingStats(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        setAdsEnabled(Boolean(data.settings.adsEnabled));
        if (data.settings.adsenseClientId) {
          setAdsenseClientId(data.settings.adsenseClientId);
        }
        if (typeof data.settings.autoPilotEnabled === "boolean") {
          setAutoPilotActive(data.settings.autoPilotEnabled);
        }
        if (typeof data.settings.targetDailyArticles === "number") {
          setTargetDailyArticles(data.settings.targetDailyArticles);
        }
        if (typeof data.settings.articlesPerRun === "number") {
          setArticlesPerRun(data.settings.articlesPerRun);
        }
        if (typeof data.settings.cronIntervalMinutes === "number") {
          setCronIntervalMinutes(data.settings.cronIntervalMinutes);
        }
      }
    } catch {
      // Non-blocking
    }
  };

  const handleToggleAutoPilot = async (targetState?: boolean) => {
    const nextVal = targetState !== undefined ? targetState : !autoPilotActive;
    setIsUpdatingAutoPilot(true);
    try {
      const res = await fetch("/api/admin/auto-pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: nextVal ? "start" : "stop",
          intervalMinutes: cronIntervalMinutes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle auto-pilot");
      setAutoPilotActive(nextVal);
      showNotice(
        "success",
        nextVal
          ? "50 Blogs/Day Auto-Pilot is now ACTIVE (Publishing automatically)"
          : "Auto-Pilot paused"
      );
    } catch (err: any) {
      showNotice("error", err.message || "Failed to toggle auto-pilot");
    } finally {
      setIsUpdatingAutoPilot(false);
    }
  };

  const handleSaveAutoPilotConfig = async () => {
    setIsUpdatingAutoPilot(true);
    try {
      const res = await fetch("/api/admin/auto-pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_config",
          intervalMinutes: cronIntervalMinutes,
          articlesPerRun,
          targetDailyArticles,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update configuration");
      showNotice("success", "Auto-Pilot parameters saved successfully!");
    } catch (err: any) {
      showNotice("error", err.message || "Failed to save configuration");
    } finally {
      setIsUpdatingAutoPilot(false);
    }
  };

  const handleToggleAds = async (targetState?: boolean) => {
    const nextVal = targetState !== undefined ? targetState : !adsEnabled;
    setIsUpdatingAds(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adsEnabled: nextVal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update ad state");
      setAdsEnabled(nextVal);
      showNotice(
        "success",
        `Google AdSense is now ${nextVal ? "ON (Live Ads Active)" : "OFF (Hidden for AdSense Approval)"}`
      );
    } catch (err: any) {
      showNotice("error", err.message || "Failed to toggle ads");
    } finally {
      setIsUpdatingAds(false);
    }
  };

  const handleSaveAdsenseId = async () => {
    setIsUpdatingAds(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adsenseClientId: adsenseClientId.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update publisher ID");
      setAdsSavedNotice(true);
      setTimeout(() => setAdsSavedNotice(false), 3000);
      showNotice("success", "AdSense Publisher ID saved successfully!");
    } catch (err: any) {
      showNotice("error", err.message || "Failed to save ID");
    } finally {
      setIsUpdatingAds(false);
    }
  };

  useEffect(() => {
    if (activeTab === "articles") {
      fetchArticles();
    } else if (activeTab === "feeds") {
      fetchCategories();
    } else if (activeTab === "cron-logs") {
      fetchCronLogs();
    } else if (activeTab === "messages") {
      fetchMessages();
    } else if (activeTab === "monetization") {
      fetchSettings();
    }
  }, [activeTab]);

  const fetchArticles = async (query = "") => {
    setArticlesLoading(true);
    try {
      const res = await fetch(`/api/admin/articles?q=${encodeURIComponent(query)}&limit=30`);
      const data = await res.json();
      if (data.articles) setArticles(data.articles);
    } catch {
      showNotice("error", "Failed to load articles");
    } finally {
      setArticlesLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
        if (data.categories.length > 0 && !selectedFeedCatId) {
          setSelectedFeedCatId(data.categories[0].id);
        }
      }
    } catch {
      showNotice("error", "Failed to load categories");
    }
  };

  const fetchCronLogs = async () => {
    try {
      const res = await fetch("/api/admin/cron-logs");
      const data = await res.json();
      if (data.logs) setCronLogs(data.logs);
    } catch {
      showNotice("error", "Failed to load logs");
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch {
      showNotice("error", "Failed to load messages");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleRunPublisher = async () => {
    setIsRunningPublisher(true);
    setPublisherResult(null);
    try {
      const res = await fetch("/api/admin/publish-now", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Execution failed");
      setPublisherResult(data.result);
      showNotice("success", `Auto-publisher finished: Published ${data.result.articlesPublished} stories!`);
      await fetchStats();
      if (activeTab === "articles") fetchArticles();
      if (activeTab === "cron-logs") fetchCronLogs();
      router.refresh();
    } catch (err: any) {
      showNotice("error", err.message || "Auto-publisher execution failed");
    } finally {
      setIsRunningPublisher(false);
    }
  };

  const handleGenerateOutreach = async (article: any) => {
    setOutreachModalArticle(article);
    setOutreachLoading(true);
    setPitchContent("");
    setPitchCopied(false);

    try {
      const res = await fetch("/api/admin/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: article.id, articleSlug: article.slug }),
      });
      const data = await res.json();
      if (data.pitchText) {
        setPitchContent(data.pitchText);
      } else {
        showNotice("error", "Failed to generate outreach pitch");
      }
    } catch (err: any) {
      showNotice("error", err.message || "Pitch generation error");
    } finally {
      setOutreachLoading(false);
    }
  };

  const handleCopyPitch = async () => {
    try {
      await navigator.clipboard.writeText(pitchContent);
      setPitchCopied(true);
      setTimeout(() => setPitchCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Article Actions
  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this intelligence article?")) return;
    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles(articles.filter((a) => a.id !== id));
        showNotice("success", "Article deleted from database");
      }
    } catch {
      showNotice("error", "Failed to delete article");
    }
  };

  const handleToggleBreaking = async (article: any) => {
    try {
      const res = await fetch("/api/admin/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: article.id, isBreaking: !article.isBreaking }),
      });
      if (res.ok) {
        setArticles(
          articles.map((a) =>
            a.id === article.id ? { ...a, isBreaking: !a.isBreaking } : a
          )
        );
        showNotice("success", `Updated breaking status for ${article.title.slice(0, 30)}...`);
      }
    } catch {
      showNotice("error", "Failed to update article");
    }
  };

  const handleSaveEditArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    try {
      const res = await fetch("/api/admin/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingArticle),
      });
      if (res.ok) {
        setArticles(
          articles.map((a) => (a.id === editingArticle.id ? editingArticle : a))
        );
        setEditingArticle(null);
        showNotice("success", "Article modifications saved");
      }
    } catch {
      showNotice("error", "Failed to save article");
    }
  };

  // Category & Feed Actions
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName,
          slug: newCatSlug,
          description: newCatDesc,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotice("success", `Category "${newCatName}" registered`);
        setNewCatName("");
        setNewCatSlug("");
        setNewCatDesc("");
        fetchCategories();
      } else {
        showNotice("error", data.error || "Failed to create category");
      }
    } catch {
      showNotice("error", "Failed to create category");
    }
  };

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedName || !newFeedUrl || !selectedFeedCatId) return;
    try {
      const res = await fetch("/api/admin/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFeedName,
          url: newFeedUrl,
          categoryId: selectedFeedCatId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotice("success", `Feed "${newFeedName}" registered`);
        setNewFeedName("");
        setNewFeedUrl("");
        fetchCategories();
      } else {
        showNotice("error", data.error || "Failed to add feed");
      }
    } catch {
      showNotice("error", "Failed to add feed");
    }
  };

  const handleToggleFeed = async (feedId: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin/feeds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: feedId, isActive: !currentActive }),
      });
      if (res.ok) {
        fetchCategories();
        showNotice("success", "Feed status toggled");
      }
    } catch {
      showNotice("error", "Failed to toggle feed");
    }
  };

  const handleDeleteFeed = async (feedId: string) => {
    if (!confirm("Are you sure you want to remove this RSS feed?")) return;
    try {
      const res = await fetch(`/api/admin/feeds?id=${feedId}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories();
        showNotice("success", "Feed removed");
      }
    } catch {
      showNotice("error", "Failed to remove feed");
    }
  };

  const siteUrl = "https://trendintel.blog";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Notice Banner */}
      {notice && (
        <div
          className={`mb-6 flex items-center justify-between rounded-xl p-4 font-mono text-xs ${
            notice.type === "success"
              ? "border border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
              : "border border-rose-500/40 bg-rose-950/20 text-rose-300"
          }`}
        >
          <div className="flex items-center space-x-2">
            {notice.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            )}
            <span>{notice.text}</span>
          </div>
          <button onClick={() => setNotice(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Admin Bureau Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-amber-400">
            <Shield className="h-4 w-4 shrink-0" />
            <span className="font-bold uppercase tracking-wider">
              BUREAU CONTROL CENTER • TRENDINTEL.BLOG
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white">
            Editorial Automation Bureau
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={fetchStats}
            disabled={isRefreshingStats}
            title="Refresh Bureau Metrics"
            className="flex items-center space-x-1.5 rounded-xl border border-white/10 bg-[#0f1118] px-3 py-2 text-xs font-mono text-slate-300 hover:border-amber-500/50 hover:text-white transition disabled:opacity-50 min-h-[38px]"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isRefreshingStats ? "animate-spin text-amber-400" : ""}`} />
            <span className="hidden sm:inline">Refresh Stats</span>
          </button>

          <button
            onClick={handleRunPublisher}
            disabled={isRunningPublisher}
            className="flex items-center space-x-2 rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-mono font-bold uppercase text-black shadow-lg shadow-amber-500/10 transition hover:bg-amber-300 disabled:opacity-50 min-h-[38px]"
          >
            {isRunningPublisher ? (
              <>
                <RotateCw className="h-3.5 w-3.5 animate-spin shrink-0" />
                <span>Executing Pipeline (~15s)...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current shrink-0" />
                <span>Run Publisher</span>
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-slate-300 hover:border-slate-500 hover:text-white min-h-[38px]"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation - Horizontal swipeable on mobile, wrap on desktop */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap border-b border-white/10 mb-8">
        {[
          { id: "overview", label: "Dashboard", icon: Layers },
          { id: "blueprint", label: "50 Blogs/Day Blueprint", icon: Cpu },
          { id: "articles", label: "Articles", icon: FileText },
          { id: "feeds", label: "Feeds & Categories", icon: Rss },
          { id: "backlinks", label: "Backlinks & Syndication", icon: Link2 },
          { id: "cron-logs", label: "Cron Logs", icon: Clock },
          { id: "messages", label: "Inquiries", icon: Mail },
          { id: "monetization", label: "Monetization & Ads", icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`shrink-0 flex items-center space-x-2 rounded-lg px-3 sm:px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition min-h-[38px] ${
                isActive
                  ? "bg-white text-black shadow-lg"
                  : "border border-white/5 bg-[#0f1118] text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Total Published Articles
              </span>
              <div className="mt-2 text-3xl font-black text-white font-mono">
                {stats.totalArticles}
              </div>
              <div className="mt-1 text-xs text-emerald-400 font-mono">
                Active in database
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Cumulative Article Views
              </span>
              <div className="mt-2 text-3xl font-black text-amber-400 font-mono">
                {stats.totalViews.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-slate-400 font-mono">
                Verified reader impressions
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Monitored RSS Feeds
              </span>
              <div className="mt-2 text-3xl font-black text-cyan-400 font-mono">
                {stats.totalFeeds}
              </div>
              <div className="mt-1 text-xs text-slate-400 font-mono">
                Across {stats.totalCategories} intelligence desks
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Last Ingestion Run
              </span>
              <div className="mt-2 flex items-center space-x-2">
                <span
                  className={`inline-block h-3 w-3 rounded-full ${
                    stats.latestCron?.status === "SUCCESS"
                      ? "bg-emerald-400"
                      : stats.latestCron?.status === "ERROR"
                      ? "bg-rose-400"
                      : stats.latestCron?.status === "PARTIAL"
                      ? "bg-amber-400"
                      : "bg-slate-500"
                  }`}
                />
                <span className="text-xl font-bold text-white font-mono uppercase">
                  {stats.latestCron?.status || "STANDBY"}
                </span>
              </div>
              <div className="mt-1 text-xs text-slate-400 font-mono">
                {stats.latestCron?.createdAt
                  ? new Date(stats.latestCron.createdAt).toLocaleTimeString()
                  : "No executions yet"}
              </div>
            </div>
          </div>

          {/* Quick Monetization & Google AdSense Control Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    adsEnabled
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}
                >
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                      Google AdSense Monetization Engine
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                        adsEnabled
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {adsEnabled ? "STATUS: ON (LIVE)" : "STATUS: OFF (SAFE FOR APPROVAL)"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 max-w-2xl font-mono leading-relaxed">
                    {adsEnabled
                      ? "Live Google AdSense units are actively displaying across home, category, and article pages."
                      : "Ad units and placeholders are 100% hidden. Editorial layout is clean and pristine for Google AdSense site approval."}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleAds(!adsEnabled)}
                  disabled={isUpdatingAds}
                  className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition shadow-lg disabled:opacity-50 ${
                    adsEnabled
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
                      : "bg-emerald-400 text-black hover:bg-emerald-300"
                  }`}
                >
                  {adsEnabled ? (
                    <>
                      <ToggleRight className="h-4 w-4" />
                      <span>{isUpdatingAds ? "UPDATING..." : "Turn Ads OFF"}</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-4 w-4" />
                      <span>{isUpdatingAds ? "UPDATING..." : "Turn Ads ON"}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("monetization")}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-mono text-slate-300 hover:border-slate-500 hover:text-white transition"
                  title="Configure AdSense Client ID & placements"
                >
                  <Sliders className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 50 Blogs/Day Autonomous Auto-Pilot Controller Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    autoPilotActive
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                      50 Blogs/Day Autonomous Auto-Pilot
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                        autoPilotActive
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {autoPilotActive ? "AUTO-PILOT: ACTIVE (48-52 POSTS/DAY)" : "AUTO-PILOT: PAUSED"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 max-w-2xl font-mono leading-relaxed">
                    Continuously samples 29 competitor RSS feeds across AI, Crypto, Finance & Startups. Synthesizes 100% plagiarism-free reports with structured tables and Google Discover 1200px imagery every {cronIntervalMinutes} minutes ({articlesPerRun} articles/cycle).
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleAutoPilot(!autoPilotActive)}
                  disabled={isUpdatingAutoPilot}
                  className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition shadow-lg disabled:opacity-50 ${
                    autoPilotActive
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30"
                      : "bg-cyan-400 text-black hover:bg-cyan-300"
                  }`}
                >
                  {autoPilotActive ? (
                    <>
                      <ToggleRight className="h-4 w-4" />
                      <span>{isUpdatingAutoPilot ? "SAVING..." : "Pause Auto-Pilot"}</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-4 w-4" />
                      <span>{isUpdatingAutoPilot ? "SAVING..." : "Start Auto-Pilot"}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("blueprint")}
                  className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-mono text-slate-300 hover:border-slate-500 hover:text-white transition"
                  title="View the 50 Blogs/Day Blueprint & Strategy Guide"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Guide</span>
                </button>
              </div>
            </div>
          </div>

          {publisherResult && (
            <div className="rounded-2xl border border-amber-500/40 bg-[#07080c] p-6 shadow-2xl font-mono">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs text-amber-400">
                <span className="font-bold uppercase tracking-wider">
                  PUBLISHER PIPELINE EXECUTION REPORT
                </span>
                <span>{publisherResult.durationMs}ms</span>
              </div>
              <div className="mt-4 space-y-2 text-xs text-slate-300">
                <p>
                  <strong className="text-white">Status:</strong>{" "}
                  <span className="text-emerald-400 font-bold">
                    {publisherResult.status}
                  </span>
                </p>
                <p>
                  <strong className="text-white">Feeds Scanned:</strong>{" "}
                  {publisherResult.feedsScanned}
                </p>
                <p>
                  <strong className="text-white">Articles Published:</strong>{" "}
                  <span className="text-amber-400 font-bold">
                    {publisherResult.articlesPublished}
                  </span>
                </p>
                <p>
                  <strong className="text-white">Articles Skipped:</strong>{" "}
                  {publisherResult.articlesSkipped}
                </p>

                {publisherResult.publishedTitles?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <span className="text-xs font-bold text-white uppercase">
                      New Published Stories:
                    </span>
                    <ul className="mt-1 list-disc list-inside text-emerald-300 space-y-1">
                      {publisherResult.publishedTitles.map(
                        (t: string, i: number) => (
                          <li key={i}>{t}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-8">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Hostinger Node.js Web Hosting Integration</span>
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed max-w-2xl">
              TrendIntel runs self-contained on Node.js 22 LTS + Hostinger MySQL. To schedule the auto-blogging engine every 30 minutes, enter this command in the Hostinger Cron Jobs manager:
            </p>

            <div className="mt-4 rounded-xl border border-slate-800 bg-[#07080c] p-4 font-mono text-xs text-amber-300 overflow-x-auto">
              curl -s &quot;https://trendintel.blog/api/cron/publish?key=YOUR_CRON_SECRET&quot; &gt; /dev/null
            </div>
          </div>
        </div>
      )}

      {/* TAB: 50 BLOGS/DAY BLUEPRINT */}
      {activeTab === "blueprint" && (
        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Cpu className="h-4 w-4" />
              <span>Operational Blueprint & Technical Guide</span>
            </div>
            <h2 className="mt-1 text-xl font-black font-mono uppercase tracking-wider text-white">
              50 Blogs/Day Autonomous Publishing Architecture
            </h2>
            <p className="mt-1 text-xs text-slate-400 font-mono leading-relaxed max-w-3xl">
              How TrendIntel continuously ingests breaking stories from 29 competitor feeds, synthesizes 100% plagiarism-free reports with zero AI detection footprint, and optimizes for Google Discover and Google AdSense revenue.
            </p>
          </div>

          {/* Quick Stats & Math Card */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono">
            <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-5">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Daily Target Volume</span>
              <div className="mt-2 text-3xl font-black text-cyan-400 font-mono">{targetDailyArticles}</div>
              <div className="mt-1 text-xs text-slate-400">Plagiarism-free articles/day</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-5">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Publication Cadence</span>
              <div className="mt-2 text-3xl font-black text-amber-400 font-mono">Every {cronIntervalMinutes}m</div>
              <div className="mt-1 text-xs text-slate-400">{articlesPerRun} articles per cycle</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-5">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Monitored Sources</span>
              <div className="mt-2 text-3xl font-black text-emerald-400 font-mono">29 Feeds</div>
              <div className="mt-1 text-xs text-slate-400">Across 4 intelligence desks</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-5">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Estimated API Cost</span>
              <div className="mt-2 text-3xl font-black text-white font-mono">$0.00</div>
              <div className="mt-1 text-xs text-emerald-400">3.3% of free Gemini quota</div>
            </div>
          </div>

          {/* Configuration Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-8 space-y-5 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  <span>Autonomous Auto-Pilot Parameters</span>
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Configure execution frequency and batch size to govern publication pacing.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveAutoPilotConfig}
                disabled={isUpdatingAutoPilot}
                className="flex items-center space-x-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold uppercase text-black hover:bg-cyan-300 transition disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                <span>Save Parameters</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
                  Target Daily Volume
                </label>
                <input
                  type="number"
                  min="10"
                  max="150"
                  value={targetDailyArticles}
                  onChange={(e) => setTargetDailyArticles(parseInt(e.target.value, 10) || 50)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                />
                <span className="mt-1 block text-[11px] text-slate-500">Default: 50 articles / 24h</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
                  Articles Per Cycle
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={articlesPerRun}
                  onChange={(e) => setArticlesPerRun(parseInt(e.target.value, 10) || 2)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                />
                <span className="mt-1 block text-[11px] text-slate-500">2 articles every 30m = 96 capacity</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
                  Cycle Interval (Minutes)
                </label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={cronIntervalMinutes}
                  onChange={(e) => setCronIntervalMinutes(parseInt(e.target.value, 10) || 30)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                />
                <span className="mt-1 block text-[11px] text-slate-500">Hostinger cron & internal timer</span>
              </div>
            </div>
          </div>

          {/* Strategic Pillar 1: Zero Plagiarism & Bypassing AI Detectors */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-8 space-y-4 font-mono">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Pillar 1: Bypassing Google SpamBrain & Zero-Plagiarism Architecture</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google algorithms (SpamBrain and Helpful Content System) aggressively penalize spun text, sentence-by-sentence rewrites, and generic AI answers. TrendIntel defeats this via four architectural barriers:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-white/5 bg-[#090b10] p-4 text-xs space-y-2">
                <span className="font-bold text-amber-300 uppercase">1. Fact-Extraction Separation</span>
                <p className="text-slate-400 leading-relaxed">
                  Competitor articles are never translated or paraphrased line-by-line. The engine extracts strictly factual entities: dates, numbers, valuations, executive names, and benchmarks, and entirely discards the competitor&apos;s original sentence structure.
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#090b10] p-4 text-xs space-y-2">
                <span className="font-bold text-cyan-300 uppercase">2. Banned Robotic Clichés</span>
                <p className="text-slate-400 leading-relaxed">
                  The system prompt and quality gate actively censor 25+ telltale AI markers (<code className="text-rose-300">&quot;delve&quot;</code>, <code className="text-rose-300">&quot;tapestry&quot;</code>, <code className="text-rose-300">&quot;testament&quot;</code>, <code className="text-rose-300">&quot;in conclusion&quot;</code>, <code className="text-rose-300">&quot;game-changer&quot;</code>), enforcing high human sentence burstiness.
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#090b10] p-4 text-xs space-y-2">
                <span className="font-bold text-emerald-300 uppercase">3. High Information Gain (Tables)</span>
                <p className="text-slate-400 leading-relaxed">
                  Every published story includes an HTML comparison table comparing metrics, dates, and capital allocations. Google rewards pages that provide proprietary tabular data with featured snippet carousels.
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#090b10] p-4 text-xs space-y-2">
                <span className="font-bold text-purple-300 uppercase">4. Internal Link Equity Distribution</span>
                <p className="text-slate-400 leading-relaxed">
                  Before saving, the automated linker injects 2 to 3 contextual internal links pointing to related published stories within the same intelligence desk, creating an authoritative topical cluster graph.
                </p>
              </div>
            </div>
          </div>

          {/* Strategic Pillar 2: Google Discover Eligibility */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-8 space-y-4 font-mono">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              <span>Pillar 2: Google Discover Carousel Domination</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Discover drives 10x higher click volumes than traditional search. The platform implements all four mandatory Google Discover technical prerequisites automatically:
            </p>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start space-x-3">
                <span className="text-amber-400 font-bold shrink-0">✓</span>
                <span>
                  <strong className="text-white">Strict 1200px+ Landscape Images:</strong> Pexels and curated visual pipelines strictly filter for <code className="text-amber-400">width &gt;= 1200</code> landscape photography. Google Discover explicitly blocks articles with low-resolution or portrait imagery from large thumbnail cards.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-amber-400 font-bold shrink-0">✓</span>
                <span>
                  <strong className="text-white">Global Discover Meta Directive:</strong> The root layout enforces <code className="text-cyan-300">max-image-preview:large, max-snippet:-1, max-video-preview:-1</code> across all page routes.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-amber-400 font-bold shrink-0">✓</span>
                <span>
                  <strong className="text-white">48-Hour Google News Sitemap:</strong> <code className="text-amber-400">/news-sitemap.xml</code> automatically outputs articles published within the last 48 hours using the official <code className="text-slate-400">&lt;news:news&gt;</code> XML schema for rapid discovery.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-amber-400 font-bold shrink-0">✓</span>
                <span>
                  <strong className="text-white">Direct Answer (TL;DR) Lede:</strong> Every article opens with a 45–60 word Direct Answer paragraph right below the H1, optimized for Google Featured Snippets and AI Overviews.
                </span>
              </li>
            </ul>
          </div>

          {/* Strategic Pillar 3: Zero-Interference Hostinger Cron Setup */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-8 space-y-4 font-mono">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>Pillar 3: Autonomous Operation & Hostinger Cron Setup</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              To run the system 100% autonomously without human intervention, configure a scheduled job in your hosting control panel:
            </p>

            <div className="space-y-3 pt-2">
              <div className="rounded-xl border border-slate-800 bg-[#07080c] p-4 text-xs">
                <span className="text-slate-400 block mb-1">Hostinger Cron Job Command (Every 30 Minutes):</span>
                <code className="text-amber-300 break-all select-all">
                  curl -s &quot;https://trendintel.blog/api/cron/publish?key=trendintel_cron_secure_token_change_in_production_894172&quot; &gt; /dev/null
                </code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
                <div className="rounded-lg border border-white/5 bg-[#090b10] p-3">
                  <strong className="text-white block mb-1">Hostinger Frequency:</strong>
                  <span>Every 30 minutes (<code className="text-cyan-300">*/30 * * * *</code>)</span>
                </div>
                <div className="rounded-lg border border-white/5 bg-[#090b10] p-3">
                  <strong className="text-white block mb-1">Internal Auto-Pilot:</strong>
                  <span>Node.js background timer runs in parallel as a secondary autonomous driver</span>
                </div>
                <div className="rounded-lg border border-white/5 bg-[#090b10] p-3">
                  <strong className="text-white block mb-1">Deduplication Guard:</strong>
                  <span>SHA-256 content hashing guarantees zero duplicate articles across cycles</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Pillar 4: Google AdSense Approval Sequence */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-8 space-y-4 font-mono">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span>Pillar 4: Google AdSense Approval Sequence (Zero-Risk Monetization)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google AdSense reviewers reject websites displaying empty ad spaces or developer placeholders. Follow this exact sequence to ensure immediate domain approval:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border border-white/5 bg-[#090b10] p-4 space-y-2">
                <span className="text-amber-400 font-bold">STAGE 1</span>
                <p className="text-white font-bold">Keep Ads OFF</p>
                <p className="text-slate-400 leading-relaxed">
                  Ads are currently DISABLED. The frontend renders zero empty containers, zero dashed boxes, and zero ad scripts.
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#090b10] p-4 space-y-2">
                <span className="text-amber-400 font-bold">STAGE 2</span>
                <p className="text-white font-bold">Publish 50–100 Stories</p>
                <p className="text-slate-400 leading-relaxed">
                  Allow the auto-pilot to run for 24–48 hours to accumulate an authoritative library of indexed dispatches across all 4 desks.
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#090b10] p-4 space-y-2">
                <span className="text-amber-400 font-bold">STAGE 3</span>
                <p className="text-white font-bold">Submit Domain to AdSense</p>
                <p className="text-slate-400 leading-relaxed">
                  Submit <code className="text-amber-300">trendintel.blog</code> to Google AdSense. Reviewers see a clean, high-authority newsroom with no ad clutter.
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#090b10] p-4 space-y-2">
                <span className="text-emerald-400 font-bold">STAGE 4</span>
                <p className="text-white font-bold">One-Click Revenue ON</p>
                <p className="text-slate-400 leading-relaxed">
                  Once approval arrives, navigate to <strong className="text-white">&quot;Monetization &amp; Ads&quot;</strong>, paste your Publisher ID, and click <strong className="text-emerald-400">&quot;SWITCH ADS ON&quot;</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === "articles" && (
        <div className="space-y-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search articles in MySQL database..."
                value={articlesSearch}
                onChange={(e) => {
                  setArticlesSearch(e.target.value);
                  fetchArticles(e.target.value);
                }}
                className="w-full rounded-xl border border-slate-700 bg-[#0f1118] px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 font-mono"
              />
              <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-500" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0f1118]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-white/10 bg-[#0c0e14] text-slate-400 uppercase">
                <tr>
                  <th className="px-4 py-3">Title / Desk</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3 max-w-md">
                      <div className="font-bold text-white hover:text-amber-400">
                        <Link href={`/article/${art.slug}`} target="_blank">
                          {art.title}
                        </Link>
                      </div>
                      <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-400">
                        <span
                          className="rounded px-1.5 py-0.2 text-black font-bold uppercase"
                          style={{
                            backgroundColor: art.category?.color || "#f59e0b",
                          }}
                        >
                          {art.category?.name || "General"}
                        </span>
                        <span>
                          {new Date(art.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {art.sourceName}
                    </td>
                    <td className="px-4 py-3 font-bold text-white">
                      {art.views}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleBreaking(art)}
                        className={`rounded px-2 py-0.5 text-[10px] uppercase font-bold transition ${
                          art.isBreaking
                            ? "bg-rose-500 text-white"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {art.isBreaking ? "Breaking" : "Standard"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right space-x-1.5">
                      <button
                        onClick={() => handleGenerateOutreach(art)}
                        className="inline-flex items-center space-x-1 rounded bg-amber-400/10 border border-amber-500/30 px-2 py-1 text-[11px] text-amber-300 hover:bg-amber-400 hover:text-black transition"
                        title="Generate Email Pitch to Journalists"
                      >
                        <Send className="h-3 w-3" />
                        <span>Pitch</span>
                      </button>

                      <Link
                        href={`/article/${art.slug}`}
                        target="_blank"
                        className="inline-flex rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                        title="View on site"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>

                      <button
                        onClick={() => setEditingArticle(art)}
                        className="inline-flex rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-amber-400"
                        title="Edit article"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="inline-flex rounded p-1.5 text-slate-400 hover:bg-rose-900/40 hover:text-rose-400"
                        title="Delete article"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Modal */}
          {editingArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0f1118] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <h3 className="font-bold text-white font-mono uppercase text-sm">
                    Edit Intelligence Article
                  </h3>
                  <button onClick={() => setEditingArticle(null)}>
                    <X className="h-4 w-4 text-slate-400 hover:text-white" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditArticle} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingArticle.title}
                      onChange={(e) =>
                        setEditingArticle({ ...editingArticle, title: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Excerpt / Meta Description</label>
                    <textarea
                      rows={2}
                      value={editingArticle.excerpt}
                      onChange={(e) =>
                        setEditingArticle({ ...editingArticle, excerpt: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">HTML Content Body</label>
                    <textarea
                      rows={8}
                      value={editingArticle.content}
                      onChange={(e) =>
                        setEditingArticle({ ...editingArticle, content: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditingArticle(null)}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-amber-400 px-4 py-2 font-bold text-black hover:bg-amber-300"
                    >
                      Save Modifications
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* AI Outreach Pitch Generator Modal */}
          {outreachModalArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="w-full max-w-2xl rounded-2xl border border-amber-500/30 bg-[#0f1118] p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold uppercase">
                    <Send className="h-4 w-4" />
                    <span>AI Outreach Pitch Generator</span>
                  </div>
                  <button onClick={() => setOutreachModalArticle(null)}>
                    <X className="h-4 w-4 text-slate-400 hover:text-white" />
                  </button>
                </div>

                <div className="text-xs font-mono">
                  <p className="text-slate-400">
                    Ready-to-send personalized email pitch for journalists, newsletters, and bloggers covering:
                  </p>
                  <p className="mt-1 font-bold text-white">
                    {outreachModalArticle.title}
                  </p>

                  <div className="mt-4 relative rounded-xl border border-slate-800 bg-[#07080c] p-4 text-slate-300 min-h-[160px]">
                    {outreachLoading ? (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <RotateCw className="h-6 w-6 animate-spin text-amber-400 mb-2" />
                        <span>Synthesizing high-impact editorial pitch...</span>
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-200">
                        {pitchContent}
                      </pre>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-[11px] text-slate-500">
                      Copy into your email client to contact relevant reporters.
                    </span>

                    <button
                      onClick={handleCopyPitch}
                      disabled={outreachLoading || !pitchContent}
                      className="flex items-center space-x-1.5 rounded-lg bg-amber-400 px-4 py-2 font-bold text-black hover:bg-amber-300 disabled:opacity-50"
                    >
                      {pitchCopied ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-black" />
                          <span>Copied Pitch!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Pitch</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FEEDS & CATEGORIES */}
      {activeTab === "feeds" && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              Configured Intelligence Categories & Assigned Wire Feeds
            </h2>

            {categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl border border-white/10 bg-[#0f1118] p-5"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: cat.color || "#f59e0b" }}
                    />
                    <h3 className="font-bold text-white font-mono uppercase text-sm">
                      {cat.name} ({cat.slug})
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {cat.feeds?.length || 0} Feeds Registered
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {cat.feeds && cat.feeds.length > 0 ? (
                    cat.feeds.map((feed: any) => (
                      <div
                        key={feed.id}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-[#090b10] px-3.5 py-2.5 text-xs font-mono"
                      >
                        <div className="truncate max-w-sm sm:max-w-md">
                          <span className="font-bold text-white">{feed.name}</span>
                          <span className="ml-2 text-slate-500 truncate block sm:inline">
                            {feed.url}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => handleToggleFeed(feed.id, feed.isActive)}
                            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase transition ${
                              feed.isActive
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-slate-800 text-slate-500"
                            }`}
                          >
                            {feed.isActive ? "ACTIVE" : "PAUSED"}
                          </button>

                          <button
                            onClick={() => handleDeleteFeed(feed.id)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                            title="Delete Feed"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 font-mono italic">
                      No RSS feeds assigned yet to this category.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-5">
              <h3 className="font-bold font-mono text-white text-xs uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <Plus className="h-4 w-4 text-amber-400" />
                <span>Add RSS Wire Feed</span>
              </h3>

              <form onSubmit={handleAddFeed} className="space-y-3 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 mb-1">Target Category</label>
                  <select
                    value={selectedFeedCatId}
                    onChange={(e) => setSelectedFeedCatId(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Feed Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bloomberg Tech RSS"
                    value={newFeedName}
                    onChange={(e) => setNewFeedName(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">RSS / Atom URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://domain.com/rss"
                    value={newFeedUrl}
                    onChange={(e) => setNewFeedUrl(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-amber-400 py-2 font-bold text-black hover:bg-amber-300"
                >
                  Register Feed
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-5">
              <h3 className="font-bold font-mono text-white text-xs uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <Plus className="h-4 w-4 text-cyan-400" />
                <span>Add Intelligence Category</span>
              </h3>

              <form onSubmit={handleAddCategory} className="space-y-3 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Energy & Defense"
                    value={newCatName}
                    onChange={(e) => {
                      setNewCatName(e.target.value);
                      setNewCatSlug(
                        e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                      );
                    }}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    placeholder="energy-defense"
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description for SEO meta..."
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-white py-2 font-bold text-black hover:bg-slate-200"
                >
                  Create Desk
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BACKLINKS & SYNDICATION */}
      {activeTab === "backlinks" && (
        <div className="space-y-8">
          {/* Syndication Links Quick Bar */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-8">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <Radio className="h-4 w-4 text-emerald-400" />
              <span>Verified Syndication & Ingestion Endpoints</span>
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Submit these permanent feeds to news aggregators and directories to automate backlink acquisition:
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="rounded-xl border border-slate-800 bg-[#07080c] p-4">
                <span className="text-[10px] text-amber-400 uppercase font-bold block mb-1">
                  RSS 2.0 Feed
                </span>
                <span className="text-slate-300 break-all">{siteUrl}/feed.xml</span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#07080c] p-4">
                <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">
                  JSON Feed 1.1
                </span>
                <span className="text-slate-300 break-all">{siteUrl}/feed.json</span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#07080c] p-4">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">
                  XML Sitemap
                </span>
                <span className="text-slate-300 break-all">{siteUrl}/sitemap.xml</span>
              </div>
            </div>
          </div>

          {/* Incoming Referral Backlink Traffic */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-cyan-400" />
                  <span>Incoming Referral Backlink Traffic</span>
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  External domains actively routing visitors to TrendIntel articles:
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-white/10 text-slate-500 uppercase">
                  <tr>
                    <th className="py-2.5">Referring Domain</th>
                    <th className="py-2.5">Landing Article</th>
                    <th className="py-2.5">Inbound Hits</th>
                    <th className="py-2.5 text-right">Last Detected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {stats.topReferrals && stats.topReferrals.length > 0 ? (
                    stats.topReferrals.map((ref: any, idx: number) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="py-2.5 font-bold text-amber-400">
                          {ref.domain}
                        </td>
                        <td className="py-2.5 max-w-xs truncate text-slate-300">
                          <Link href={ref.targetPath} target="_blank" className="hover:underline">
                            {ref.targetPath}
                          </Link>
                        </td>
                        <td className="py-2.5 font-bold text-white">
                          {ref.count}
                        </td>
                        <td className="py-2.5 text-right text-slate-500">
                          {new Date(ref.lastSeenAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500">
                        No external referral traffic recorded yet. Referral visits will appear automatically as blogs backlink to your articles.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* High-DA Aggregator & Directory Submission Checklist */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-8">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <Share2 className="h-4 w-4 text-amber-400" />
              <span>High-DA Directory & Syndication Checklist</span>
            </h3>
            <p className="mt-1 text-xs text-slate-400 mb-6">
              Submit your RSS feed to these platforms to establish authoritative backlinks and automated news indexing:
            </p>

            <div className="space-y-4 font-mono text-xs">
              {[
                {
                  name: "Google News Publisher Center",
                  url: "https://publishercenter.google.com/",
                  description: "Submit trendintel.blog and your /feed.xml to be indexed directly in Google News and Discover.",
                  action: "Submit Publication",
                },
                {
                  name: "Bing News PubHub",
                  url: "https://www.bing.com/pubhub/",
                  description: "Ingests RSS feeds for syndication across MSN News and Microsoft Edge Start feeds.",
                  action: "Submit RSS Feed",
                },
                {
                  name: "Flipboard Magazine Curator",
                  url: "https://flipboard.com/",
                  description: "Create a curated magazine powered by https://trendintel.blog/feed.xml to tap into mobile news traffic.",
                  action: "Connect Feed",
                },
                {
                  name: "Hacker News & IndieHackers",
                  url: "https://news.ycombinator.com/",
                  description: "Share breaking deep-dives on sovereign AI compute and venture data rounds.",
                  action: "Share Dispatch",
                },
                {
                  name: "Feedspot Tech & Finance Directory",
                  url: "https://www.feedspot.com/",
                  description: "Submit /feed.xml to top industry blog rankings to gain high-authority permanent directory backlinks.",
                  action: "Submit Blog",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/5 bg-[#090b10] p-4"
                >
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.name}</h4>
                    <p className="mt-1 text-xs text-slate-400 font-sans">{item.description}</p>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-amber-400 hover:bg-slate-700 hover:text-white transition shrink-0"
                  >
                    <span>{item.action}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CRON LOGS */}
      {activeTab === "cron-logs" && (
        <div className="space-y-6">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
            Historical Cron Ingestion & Publishing Logs
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0f1118]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-white/10 bg-[#0c0e14] text-slate-400 uppercase">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Trigger</th>
                  <th className="px-4 py-3">Feeds Scanned</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Diagnostics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {cronLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 uppercase text-slate-400">
                      {log.triggeredBy}
                    </td>
                    <td className="px-4 py-3">{log.feedsScanned}</td>
                    <td className="px-4 py-3 font-bold text-amber-400">
                      {log.articlesPublished}
                    </td>
                    <td className="px-4 py-3">{log.durationMs}ms</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] uppercase font-bold ${
                          log.status === "SUCCESS"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : log.status === "PARTIAL"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                      {log.errors || "Clean execution"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: MESSAGES */}
      {activeTab === "messages" && (
        <div className="space-y-6">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
            Incoming Dispatches & Contact Registry
          </h2>

          <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#0f1118]">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="p-5 font-mono text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2 mb-3">
                    <span className="font-bold text-white text-sm">
                      {msg.subject || "No Subject"}
                    </span>
                    <span className="text-slate-500">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                  <div className="mt-3 text-slate-400">
                    From: <strong className="text-white">{msg.name}</strong> (
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-amber-400 underline"
                    >
                      {msg.email}
                    </a>
                    )
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                No reader dispatches or inquiries logged in MySQL yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: MONETIZATION & ADS */}
      {activeTab === "monetization" && (
        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              <DollarSign className="h-4 w-4" />
              <span>Ad Revenue & Policy Compliance Center</span>
            </div>
            <h2 className="mt-1 text-xl font-black font-mono uppercase tracking-wider text-white">
              Google AdSense Monetization Controls
            </h2>
            <p className="mt-1 text-xs text-slate-400 font-mono">
              Toggle live advertising and manage AdSense Publisher credentials across trendintel.blog.
            </p>
          </div>

          {/* Master Toggle Card */}
          <div
            className={`rounded-2xl border p-6 sm:p-8 transition-all ${
              adsEnabled
                ? "border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-[#0f1118] to-[#0f1118]"
                : "border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-[#0f1118] to-[#0f1118]"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider ${
                      adsEnabled
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        adsEnabled ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                      }`}
                    />
                    <span>{adsEnabled ? "ADSENSE ACTIVE (ON)" : "ADSENSE DISABLED (OFF)"}</span>
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {adsEnabled ? "Live Ad Units Serving" : "AdSense Approval Safe Mode"}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-mono text-white">
                  {adsEnabled
                    ? "Live Advertising Units Enabled"
                    : "Zero-Footprint Mode: Ad Units Completely Hidden"}
                </h3>

                <p className="text-xs text-slate-400 font-mono leading-relaxed max-w-2xl">
                  {adsEnabled
                    ? "Google AdSense script is injected and live advertisement banners are rendering on the homepage, category desks, and inside article bodies."
                    : "All ad containers, borders, dashed boxes, and scripts are strictly removed (component returns null). This ensures Google AdSense reviewers inspect 100% genuine content without encountering empty boxes."}
                </p>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleAds(!adsEnabled)}
                  disabled={isUpdatingAds}
                  className={`flex items-center space-x-3 rounded-xl px-6 py-4 text-xs font-mono font-bold uppercase tracking-wider transition shadow-2xl disabled:opacity-50 ${
                    adsEnabled
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
                      : "bg-emerald-400 text-black hover:bg-emerald-300 shadow-emerald-500/20"
                  }`}
                >
                  {adsEnabled ? (
                    <>
                      <ToggleRight className="h-5 w-5" />
                      <span>{isUpdatingAds ? "UPDATING..." : "SWITCH ADS OFF"}</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-5 w-5" />
                      <span>{isUpdatingAds ? "UPDATING..." : "SWITCH ADS ON (APPROVED)"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Configuration Card: Client ID */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center space-x-2">
              <Sliders className="h-4 w-4 text-amber-400" />
              <span>Google AdSense Publisher Credentials</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Enter your Google AdSense Publisher ID (e.g., <code className="text-amber-400">ca-pub-1234567890123456</code>). This ID is used for ad injection and script verification.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                type="text"
                value={adsenseClientId}
                onChange={(e) => setAdsenseClientId(e.target.value)}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
              />
              <button
                type="button"
                onClick={handleSaveAdsenseId}
                disabled={isUpdatingAds}
                className="flex items-center justify-center space-x-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-black transition hover:bg-amber-300 disabled:opacity-50 shrink-0"
              >
                {adsSavedNotice ? (
                  <>
                    <Check className="h-4 w-4 text-black" />
                    <span>SAVED!</span>
                  </>
                ) : (
                  <span>SAVE PUBLISHER ID</span>
                )}
              </button>
            </div>
          </div>

          {/* Ad Placement Inventory */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center space-x-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Registered Ad Placements Inventory</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              The following placement zones are configured across trendintel.blog.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-[#090b10] p-4 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-white/5 pb-2 mb-2">
                  <span className="font-bold text-white">Homepage Leaderboard</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                      adsEnabled ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {adsEnabled ? "ACTIVE" : "HIDDEN"}
                  </span>
                </div>
                <div className="text-slate-400 space-y-1 text-[11px]">
                  <p>Slot ID: <code className="text-amber-400">trendintel-home-leaderboard</code></p>
                  <p>Placement: Below hero grid</p>
                  <p>Format: Horizontal Leaderboard (728x90)</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5">
                  <Link
                    href="/"
                    target="_blank"
                    className="inline-flex items-center space-x-1 text-[11px] text-amber-400 hover:text-amber-300"
                  >
                    <span>Inspect Homepage</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#090b10] p-4 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-white/5 pb-2 mb-2">
                  <span className="font-bold text-white">Category Banner</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                      adsEnabled ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {adsEnabled ? "ACTIVE" : "HIDDEN"}
                  </span>
                </div>
                <div className="text-slate-400 space-y-1 text-[11px]">
                  <p>Slot ID: <code className="text-amber-400">trendintel-cat-[category]</code></p>
                  <p>Placement: Top of category intelligence desks</p>
                  <p>Format: Responsive Horizontal Banner</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5">
                  <Link
                    href="/category/global-finance"
                    target="_blank"
                    className="inline-flex items-center space-x-1 text-[11px] text-amber-400 hover:text-amber-300"
                  >
                    <span>Inspect Global Finance</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#090b10] p-4 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-white/5 pb-2 mb-2">
                  <span className="font-bold text-white">In-Article Content Ad</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                      adsEnabled ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {adsEnabled ? "ACTIVE" : "HIDDEN"}
                  </span>
                </div>
                <div className="text-slate-400 space-y-1 text-[11px]">
                  <p>Slot ID: <code className="text-amber-400">trendintel-article-mid-1</code></p>
                  <p>Placement: Embedded midway in article text</p>
                  <p>Format: Responsive Content Unit</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5">
                  <Link
                    href="/trends/artificial-intelligence"
                    target="_blank"
                    className="inline-flex items-center space-x-1 text-[11px] text-amber-400 hover:text-amber-300"
                  >
                    <span>Inspect AI Trend Hub</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* AdSense Domain Approval Strategy Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-8 space-y-4 font-mono">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Google AdSense Approval Blueprint & Best Practices</span>
            </h3>
            <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
              <div className="flex items-start space-x-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px]">
                  1
                </span>
                <p>
                  <strong className="text-white">Why keep ads OFF right now:</strong> Google AdSense uses automated crawlers and human quality raters. If they detect empty ad frames, dashed placeholder boxes, or &quot;Ad Slot Here&quot; banners, your site will be rejected under Google&apos;s &quot;Site Behavior: Navigation / Valuable Inventory&quot; rule.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px]">
                  2
                </span>
                <p>
                  <strong className="text-white">Submit Clean Site to AdSense:</strong> Submit <code className="text-amber-400">https://trendintel.blog</code> to Google AdSense. Google reviewers will review clean, professional articles with zero intrusive or empty elements.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px]">
                  3
                </span>
                <p>
                  <strong className="text-white">Instant 1-Click Activation:</strong> Once Google approves your site, return to this panel, paste your approved Publisher ID, and click <strong className="text-emerald-400">&quot;SWITCH ADS ON&quot;</strong>. Live ads immediately begin monetizing all current and future traffic.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
