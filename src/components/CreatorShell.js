"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FilePlus2,
  Code2,
  Users,
  BarChart3,
  Settings,
  BookOpen,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Shield,
  Activity,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROOT_DOMAIN, INITIAL_DEMO_SUBDOMAINS } from "@/lib/constants";

const SIDEBAR_ITEMS = [
  { href: "/dashboard", label: "Creator Dashboard", icon: LayoutDashboard },
  { href: "/posts", label: "My Posts Inventory", icon: FileText },
  { href: "/posts/new", label: "Studio Editor (New)", icon: FilePlus2 },
  { href: "/templates", label: "HTML5 Templates", icon: Code2 },
  { href: "/audience", label: "Audience & CRM", icon: Users },
  { href: "/analytics", label: "Edge Analytics", icon: BarChart3 },
  { href: "/manage", label: "Manage Subdomain", icon: Settings },
  { href: "/lessons", label: "Creator Academy", icon: BookOpen },
  { href: "/showcase", label: "Global Showcase", icon: Globe },
  { href: "/security", label: "Security & Rules", icon: Shield },
  { href: "/status", label: "Network Status", icon: Activity }
];

export default function CreatorShell({ children, title, subtitle, actions }) {
  const pathname = usePathname();
  const { activeSubdomain, switchActiveSubdomain, subdomainRecord } = useAuth();
  const [copied, setCopied] = useState(false);

  const fullUrl = `https://${activeSubdomain}.${ROOT_DOMAIN}`;

  const copySubdomainLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen obsidian-radial-bg flex flex-col lg:flex-row">
      <aside className="w-full lg:w-64 bg-[#0a0d16] border-b lg:border-b-0 lg:border-r border-white/10 shrink-0 flex flex-col justify-between p-4">
        <div className="space-y-5">
          <div className="p-3.5 rounded-2xl bg-[#0d111c] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE INSTANCE
              </span>
              <span className="text-[10px] font-mono text-slate-400">SSL VALID</span>
            </div>
            <div className="font-mono text-xs font-bold text-white truncate">
              {activeSubdomain}.{ROOT_DOMAIN}
            </div>
            <div className="flex items-center gap-1.5">
              <select
                value={activeSubdomain}
                onChange={(e) => switchActiveSubdomain(e.target.value)}
                className="w-full bg-[#07090f] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              >
                {INITIAL_DEMO_SUBDOMAINS.map((s) => (
                  <option key={s.subdomain} value={s.subdomain}>
                    {s.subdomain}.{ROOT_DOMAIN}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={copySubdomainLink}
                className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-200 transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy URL"}</span>
              </button>
              <Link
                href={`/?preview_sub=${activeSubdomain}`}
                className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-[11px] text-indigo-200 transition"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-white border border-indigo-500/40"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:block mt-6 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/50 to-slate-900/80 border border-indigo-500/25 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-white">
            <span>Firebase Spark Tier</span>
            <span className="font-mono text-emerald-400">$0/mo</span>
          </div>
          <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
            <div className="h-full w-1/4 bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" />
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Doc Limit: 900 KB / 1 MiB Max
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="border-b border-white/10 bg-[#07090f]/60 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
              <span>WORKSPACE: {(subdomainRecord?.displayName || activeSubdomain).toUpperCase()}</span>
              <span>•</span>
              <span>{activeSubdomain}.{ROOT_DOMAIN}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {actions || (
              <>
                <Link
                  href={`/?preview_sub=${activeSubdomain}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200"
                >
                  <span>Visit Live Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/posts/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-electric text-xs font-bold shadow-glow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Write New Post</span>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto space-y-8">{children}</div>
      </div>
    </div>
  );
}
