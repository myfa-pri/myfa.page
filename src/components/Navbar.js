"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  Terminal,
  Sparkles,
  Search,
  LayoutDashboard,
  FilePlus2,
  BookOpen,
  Code2,
  ShieldCheck,
  Activity,
  Menu,
  X,
  ExternalLink,
  Layers
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROOT_DOMAIN } from "@/lib/constants";
import CommandPalette from "./CommandPalette";

const PRIMARY_LINKS = [
  { href: "/showcase", label: "Showcase" },
  { href: "/templates", label: "HTML5 Templates" },
  { href: "/lessons", label: "Academy" },
  { href: "/whitepaper", label: "Whitepaper" },
  { href: "/security", label: "Security" },
  { href: "/status", label: "Edge Status" },
  { href: "/dashboard", label: "Creator OS" }
];

export default function Navbar() {
  const pathname = usePathname();
  const { activeSubdomain, isFirebaseConfigured } = useAuth();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="bg-[#05070c] border-b border-white/10 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-emerald-400 font-semibold">
              ZERO-COST STACK ACTIVE
            </span>
            <span className="hidden sm:inline text-slate-400">
              GitHub → Vercel Hobby + Firebase Spark ({isFirebaseConfigured ? "Live Firebase Connected" : "Instant Local + Edge Simulation Ready"})
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/?preview_sub=${activeSubdomain}`}
              className="font-mono text-[11px] text-indigo-300 hover:text-white flex items-center gap-1"
            >
              <span>Live Node: {activeSubdomain}.{ROOT_DOMAIN}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/changelog"
              className="hidden md:inline-block font-mono text-[11px] px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
            >
              v3.4 Production
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#07090f]/85 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl btn-electric flex items-center justify-center shadow-glow">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-white">
                    MyfaPost
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    .{ROOT_DOMAIN}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono -mt-0.5">
                  SOVEREIGN CREATOR OS
                </div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {PRIMARY_LINKS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      active
                        ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCmdOpen(true)}
              className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0d111c] border border-white/10 text-xs text-slate-300 hover:border-indigo-500/40 transition"
            >
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span>Quick Jump...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px] text-slate-400">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/posts/new"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition"
            >
              <FilePlus2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>New Post</span>
            </Link>

            <Link
              href="/auth"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-electric text-xs font-bold shadow-glow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Claim Subdomain</span>
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-[#0d111c] border-b border-white/10 px-4 py-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {PRIMARY_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg bg-white/5 text-sm text-slate-200 hover:bg-indigo-500/20"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/posts"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg bg-white/5 text-sm text-slate-200"
              >
                My Posts
              </Link>
              <Link
                href="/manage"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg bg-white/5 text-sm text-slate-200"
              >
                Manage DNS
              </Link>
            </div>
          </div>
        )}
      </header>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
}
