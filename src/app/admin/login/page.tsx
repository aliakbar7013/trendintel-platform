"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight, AlertCircle, KeyRound, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const performLogin = async (passToUse: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passToUse }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid administrator credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(password);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-3.5 py-6 sm:py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1118] p-5 sm:p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-black font-mono uppercase tracking-wider text-white">
            Editorial Bureau Terminal
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-mono">
            Authenticated Access for trendintel.blog Operators
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center space-x-2 rounded-xl border border-rose-500/40 bg-rose-950/20 p-3 text-xs text-rose-300 font-mono">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
              Bureau Security Key
            </label>
            <div className="relative">
              <input
                id="bureau-password-input"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter ADMIN_PASSWORD..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 pl-11 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
              />
              <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-amber-400 py-3 text-xs font-mono font-bold uppercase tracking-wider text-black transition hover:bg-amber-300 disabled:opacity-50 shadow-lg shadow-amber-500/10"
          >
            <span>{loading ? "AUTHENTICATING..." : "ENTER BUREAU PANEL"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 border-t border-white/5 pt-4 text-center">
          <p className="text-[11px] text-slate-500 font-mono">
            Credentials configured via server environment variable <code className="text-slate-400">ADMIN_PASSWORD</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
