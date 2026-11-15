"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, AlertTriangle, Building, PhoneCall } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message.");
      }

      setStatus({
        type: "success",
        message: "Your message has been logged in our editorial registry. We will review your inquiry promptly.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-white/10 pb-8 mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
          EDITORIAL DESK COMMUNICATIONS
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-white">
          Contact TrendIntel Bureau
        </h1>
        <p className="mt-3 text-base text-slate-300 leading-relaxed">
          Submit press releases, confidential tips, syndicate proposals, or editorial corrections directly to our newsroom.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Form (8 cols) */}
        <div className="md:col-span-8 rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {status.type && (
              <div
                className={`flex items-start space-x-3 rounded-xl p-4 text-xs font-mono ${
                  status.type === "success"
                    ? "border border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
                    : "border border-rose-500/40 bg-rose-950/20 text-rose-300"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Elena Vance"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="elena@domain.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Press Release / Editorial Inquiry / Correction"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                Detailed Message / Dispatch *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Provide full context, article references, or press details..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 rounded-xl bg-amber-400 px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-black transition hover:bg-amber-300 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "TRANSMITTING..." : "TRANSMIT DISPATCH"}</span>
            </button>
          </form>
        </div>

        {/* Sidebar Info (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-6 text-xs text-slate-400 space-y-3 font-mono">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm flex items-center space-x-2">
              <Mail className="h-4 w-4 text-amber-400" />
              <span>Direct Bureaus</span>
            </h3>
            <p>
              <strong className="text-slate-200">Press & Tips:</strong><br />
              press@trendintel.blog
            </p>
            <p>
              <strong className="text-slate-200">Editorial Desk:</strong><br />
              editor@trendintel.blog
            </p>
            <p>
              <strong className="text-slate-200">Legal & Privacy:</strong><br />
              legal@trendintel.blog
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0f1118] p-6 text-xs text-slate-400 space-y-2">
            <h3 className="text-white font-bold font-mono uppercase tracking-wider text-sm flex items-center space-x-2">
              <Building className="h-4 w-4 text-cyan-400" />
              <span>Operational Registry</span>
            </h3>
            <p className="leading-relaxed">
              TrendIntel Blog Network<br />
              Hostinger Infrastructure Node<br />
              Autonomous Newsroom Runtime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
