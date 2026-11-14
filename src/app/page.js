"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Globe,
  Terminal,
  ShieldCheck,
  Zap,
  Code2,
  Users,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Layers,
  Cpu,
  Activity,
  Lock
} from "lucide-react";
import {
  ROOT_DOMAIN,
  PLATFORM_TELEMETRY,
  INITIAL_DEMO_SUBDOMAINS
} from "@/lib/constants";
import {
  checkSubdomainAvailability,
  listAllSubdomains
} from "@/lib/firebase";

const ARCHITECTURE_PILLARS = [
  {
    title: "Instant Subdomain Creation",
    badge: "*.myfa.page Wildcard Edge",
    desc: "Claim your custom subdomain handle in seconds. Next.js Edge Middleware inspects the Host header and routes traffic globally without cPanel or VPS provisioning.",
    metrics: "0.18s Global TTFB · Automatic Wildcard TLS"
  },
  {
    title: "Single-File Index Engine",
    badge: "O(1) Firestore Key Lookup",
    desc: "Every article or standalone page is compiled into a self-contained HTML5 payload up to 900 KB and stored at posts/{subdomain}__{slug} for constant-time retrieval.",
    metrics: "Zero SQL Joins · Root 'index' Homepage Override"
  },
  {
    title: "Rich Visual & Raw HTML Studio",
    badge: "Dual-Mode Compiler",
    desc: "Write in our distraction-free Markdown compiler or upload custom standalone index.html files with live desktop/mobile iframe preview and 0-100 SEO scoring.",
    metrics: "6 Local Snapshots · OpenGraph Card Generator"
  },
  {
    title: "Audience & Monetization",
    badge: "Sovereign Subscriber CRM",
    desc: "Capture email subscribers directly from your subdomain pages, inspect HTTP/3 Core Web Vitals, and export your complete JSON or CSV publication archive anytime.",
    metrics: "100% Data Ownership · $0 Infrastructure Forever"
  }
];

const HOME_FAQS = [
  {
    q: "How does *.myfa.page wildcard subdomain routing work without a VPS or cPanel?",
    a: "You point myfa.page and *.myfa.page to Vercel's Anycast DNS (ns1.vercel-dns.com / ns2.vercel-dns.com). Incoming requests hit src/middleware.js at the edge, which extracts the subdomain from the Host header and internally rewrites to /sites/[subdomain]/[slug] while keeping the reader's browser URL unchanged."
  },
  {
    q: "Why does MyfaPost store HTML inside Cloud Firestore instead of Firebase Cloud Storage?",
    a: "Firebase Cloud Storage requires upgrading to a paid Blaze billing plan. Cloud Firestore on the Spark Free Tier includes 1 GiB of storage, 50,000 reads/day, and 20,000 writes/day 100% free forever without a credit card. Each HTML document is validated under 900 KB to stay well inside Firestore's 1 MiB document ceiling."
  },
  {
    q: "How can I replace my subdomain's root homepage with a custom index.html design?",
    a: "In the Studio Editor, set the Canonical Slug field to 'index'. When a visitor requests https://yourname.myfa.page, the edge route handler checks for {subdomain}__index first and serves your custom HTML5 homepage directly. If no 'index' post exists, it automatically renders a dark-glassmorphic directory of all your published dispatches."
  },
  {
    q: "How does edge caching multiply the Firebase Spark 50,000 daily read quota?",
    a: "Every subdomain route returns Cache-Control: public, s-maxage=60, stale-while-revalidate=300. Vercel's 340+ global edge PoPs serve cached HTML directly from RAM for 60 seconds and revalidate asynchronously—meaning 100,000 viral readers can view your post while consuming fewer than 1,500 Firestore reads."
  },
  {
    q: "Are tenant subdomains isolated from my Creator OS authentication session?",
    a: "Yes. Firebase Authentication runs strictly on the apex myfa.page origin using host-only IndexedDB storage. Tenant subdomains (*.myfa.page) run on separate browser origins under the Same-Origin Policy and never receive session cookies or auth tokens."
  },
  {
    q: "Can I upload my own hand-crafted HTML, CSS, and interactive JavaScript visualizations?",
    a: "Absolutely. Switch the Studio Editor to Raw index.html Mode to drag-and-drop any .html or .htm file up to 900 KB or load one of our 6 production HTML5 starter templates."
  },
  {
    q: "How do I test wildcard subdomains on localhost or a *.vercel.app preview URL?",
    a: "Our middleware supports both native *.localhost hostnames (such as http://hacker.localhost:3000) and instant query overrides (?preview_sub=hacker&preview_slug=top-hack-now) so you can test every tenant route anywhere."
  },
  {
    q: "Can I export my entire publication if I want an offline backup?",
    a: "Yes. Visit the Manage Subdomain workspace to download a 1-click Full JSON Publication Archive containing your subdomain profile, all HTML/Markdown posts, and subscriber list, or export your inventory as CSV from My Posts."
  }
];

export default function HomePage() {
  const router = useRouter();
  const [desiredSub, setDesiredSub] = useState("cyberpulse-lab");
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);
  const [mockTab, setMockTab] = useState("tech-radar");
  const [liveSubdomains, setLiveSubdomains] = useState(INITIAL_DEMO_SUBDOMAINS);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    listAllSubdomains().then((list) => {
      if (Array.isArray(list) && list.length) {
        setLiveSubdomains(list);
      }
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!desiredSub.trim()) {
        setAvailability(null);
        return;
      }
      setChecking(true);
      const res = await checkSubdomainAvailability(desiredSub);
      setAvailability(res);
      setChecking(false);
    }, 220);
    return () => clearTimeout(timer);
  }, [desiredSub]);

  const handleInstantClaim = (e) => {
    e.preventDefault();
    const target = availability?.subdomain || desiredSub.toLowerCase().replace(/[^a-z0-9-]/g, "");
    router.push(`/auth?claim=${encodeURIComponent(target)}`);
  };

  return (
    <main className="obsidian-radial-bg">
      <section className="relative pt-14 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>WILDCARD *.MYFA.PAGE ENGINE · V3.4 PRODUCTION</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
              Claim Your Subdomain.{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-300 bg-clip-text text-transparent">
                Publish News in Seconds.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Launch a sovereign technical publication or deploy standalone{" "}
              <code className="font-mono text-indigo-300 bg-white/5 px-1.5 py-0.5 rounded">
                index.html
              </code>{" "}
              dispatches on your own custom{" "}
              <code className="font-mono text-emerald-300 bg-white/5 px-1.5 py-0.5 rounded">
                yourname.{ROOT_DOMAIN}
              </code>{" "}
              subdomain—100% free forever on Vercel Edge and Firebase Spark.
            </p>

            <form
              onSubmit={handleInstantClaim}
              className="glass-card rounded-2xl p-3 sm:p-4 max-w-2xl space-y-3 border border-indigo-500/30 shadow-glow"
            >
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="flex-1 flex items-center bg-[#07090f] border border-white/15 rounded-xl px-3.5 py-3">
                  <Globe className="w-4 h-4 text-indigo-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={desiredSub}
                    onChange={(e) => setDesiredSub(e.target.value)}
                    placeholder="yourname"
                    className="w-full bg-transparent font-mono text-sm text-white focus:outline-none"
                  />
                  <span className="font-mono text-xs text-slate-400 pl-2 border-l border-white/10">
                    .{ROOT_DOMAIN}
                  </span>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl btn-electric font-bold text-sm flex items-center justify-center gap-2 shrink-0 shadow-glow"
                >
                  <span>Claim Subdomain</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {availability && (
                <div className="flex items-center justify-between px-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    {checking ? (
                      <span className="text-slate-400">Querying Firestore Edge Index...</span>
                    ) : availability.available ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300">{availability.reason}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-300">{availability.reason}</span>
                      </>
                    )}
                  </div>
                  <span className="text-slate-400 hidden sm:inline">O(1) Key Verified</span>
                </div>
              )}
            </form>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
              <span>Instant Live Demos:</span>
              <Link
                href="/?preview_sub=cyberpulse"
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-indigo-300 border border-white/10"
              >
                cyberpulse.{ROOT_DOMAIN} ↗
              </Link>
              <Link
                href="/?preview_sub=hacker&preview_slug=top-hack-now"
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-emerald-300 border border-white/10"
              >
                hacker.{ROOT_DOMAIN}/top-hack-now ↗
              </Link>
              <Link
                href="/?preview_sub=tech-radar"
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-500/20 text-purple-300 border border-white/10"
              >
                tech-radar.{ROOT_DOMAIN} ↗
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-card rounded-2xl border border-white/15 overflow-hidden shadow-2xl">
              <div className="bg-[#05070c] px-4 py-3 border-b border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex-1 mx-2 px-3 py-1 rounded-lg bg-[#0d111c] border border-white/10 font-mono text-[11px] text-emerald-300 truncate text-center">
                  {mockTab === "tech-radar"
                    ? `https://tech-radar.${ROOT_DOMAIN}/silicon-super-cycle`
                    : `https://hacker.${ROOT_DOMAIN}/top-hack-now`}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMockTab("tech-radar")}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      mockTab === "tech-radar"
                        ? "bg-indigo-600 text-white"
                        : "bg-white/5 text-slate-400"
                    }`}
                  >
                    TechRadar
                  </button>
                  <button
                    onClick={() => setMockTab("hacker")}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      mockTab === "hacker"
                        ? "bg-emerald-600 text-white"
                        : "bg-white/5 text-slate-400"
                    }`}
                  >
                    RootShell
                  </button>
                </div>
              </div>

              {mockTab === "tech-radar" ? (
                <div className="p-6 space-y-4 bg-gradient-to-b from-[#0d111c] to-[#07090f]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                      TechRadar Dispatch
                    </span>
                    <span className="font-mono text-emerald-400">TTFB: 0.16s · HIT</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white leading-snug">
                    The Next Silicon Super-Cycle: Micro-Kernels Rebuilding Edge Compute
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    How deterministic single-file edge payloads and zero-cold-start micro-kernels are replacing legacy container orchestration across 340 global PoPs.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="p-2.5 rounded-xl bg-[#07090f] border border-white/10">
                      <div className="font-mono text-sm font-bold text-indigo-300">52.1k</div>
                      <div className="text-[10px] text-slate-400">Verified Views</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#07090f] border border-white/10">
                      <div className="font-mono text-sm font-bold text-emerald-400">86%</div>
                      <div className="text-[10px] text-slate-400">Read Ratio</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#07090f] border border-white/10">
                      <div className="font-mono text-sm font-bold text-purple-300">14.2 KB</div>
                      <div className="text-[10px] text-slate-400">HTML Payload</div>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">By Elena Rostova · Silicon Columnist</span>
                    <Link
                      href="/?preview_sub=tech-radar&preview_slug=silicon-super-cycle"
                      className="font-mono text-indigo-400 hover:underline"
                    >
                      Open Live Subdomain →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-4 bg-gradient-to-b from-[#081210] to-[#07090f]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                      ADVISORY: MYFA-SEC-2026
                    </span>
                    <span className="font-mono text-emerald-400">SOP SANDBOXED</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white leading-snug">
                    Zero-Click Subdomain Isolation &amp; Origin Sandboxing on Multi-Tenant Edge Networks
                  </h3>
                  <pre className="p-3 rounded-xl bg-black/70 border border-emerald-500/30 font-mono text-[11px] text-emerald-300 overflow-x-auto">
{`GET /top-hack-now HTTP/3
Host: hacker.myfa.page
Cache-Control: public, s-maxage=60, stale-while-revalidate=300`}
                  </pre>
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="text-slate-400">By Kaelen Vance · Offensive Security Lead</span>
                    <Link
                      href="/?preview_sub=hacker&preview_slug=top-hack-now"
                      className="font-mono text-emerald-400 hover:underline"
                    >
                      Open Live Advisory →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-y border-white/10 bg-[#05070c]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {PLATFORM_TELEMETRY.map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-2xl bg-[#0d111c] border border-white/10 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-white">
                  {item.value}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                  {item.delta}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-200">{item.label}</div>
              <div className="text-[11px] text-slate-400">{item.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="font-mono text-xs uppercase tracking-widest text-indigo-400">
            SOVEREIGN PUBLICATION ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Everything You Need to Run a Sovereign Digital Publication
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Engineered from first principles to run 100% free on GitHub, Vercel Hobby, and Firebase Spark without sacrificing global speed or developer control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARCHITECTURE_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="glass-card glass-card-hover rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 font-mono text-xs text-indigo-300">
                  {pillar.badge}
                </span>
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{pillar.desc}</p>
              <div className="pt-2 border-t border-white/10 font-mono text-xs text-emerald-400">
                {pillar.metrics}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-[#05070c]/70 border-y border-white/10">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                LIVE TENANT DIRECTORY
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-1">
                Trending On MyfaPost Subdomains
              </h2>
            </div>
            <Link
              href="/showcase"
              className="inline-flex items-center gap-2 text-xs font-mono text-indigo-300 hover:text-white"
            >
              <span>Explore All Claimed Subdomains</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveSubdomains.slice(0, 6).map((sub) => (
              <div
                key={sub.subdomain}
                className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {sub.subdomain}.{ROOT_DOMAIN}
                    </span>
                    <span className="text-xs text-slate-400">{sub.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{sub.displayName}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {sub.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">{sub.authorName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {(sub.subscribersCount || 1200).toLocaleString()} subscribers
                    </div>
                  </div>
                  <Link
                    href={`/?preview_sub=${sub.subdomain}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 font-mono text-xs"
                  >
                    <span>Visit Node</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-indigo-400">
              ZERO-FRICTION DEPLOYMENT PIPELINE
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              From Thought to Global CDN in Three Taps
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0d111c] border border-white/10">
                <div className="font-mono text-xs text-indigo-400 mb-1">STEP 01 · CLAIM NAMESPACE</div>
                <div className="text-base font-bold text-white">Reserve yourname.{ROOT_DOMAIN}</div>
                <p className="text-xs text-slate-400 mt-1">
                  Instant Firestore uniqueness check locks your subdomain handle and binds ownership to your Firebase Auth UID.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#0d111c] border border-white/10">
                <div className="font-mono text-xs text-emerald-400 mb-1">STEP 02 · COMPILE OR UPLOAD HTML5</div>
                <div className="text-base font-bold text-white">Write in Markdown or Drop Raw index.html</div>
                <p className="text-xs text-slate-400 mt-1">
                  Our client-side compiler injects responsive typography, canonical tags, and OpenGraph cards—or preserves your custom HTML5 verbatim.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#0d111c] border border-white/10">
                <div className="font-mono text-xs text-purple-400 mb-1">STEP 03 · EDGE CACHE BROADCAST</div>
                <div className="text-base font-bold text-white">Serve Globally with s-maxage=60</div>
                <p className="text-xs text-slate-400 mt-1">
                  Readers hit your custom subdomain URL and receive raw HTML from the nearest Vercel Edge PoP in 180ms.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-[#05070c] border border-white/15 overflow-hidden shadow-2xl">
              <div className="px-4 py-3 bg-[#0d111c] border-b border-white/10 flex items-center justify-between font-mono text-xs">
                <span className="text-indigo-300">article-compiler.worker.ts</span>
                <span className="text-emerald-400">STATUS: READY (0ms COLD BOOT)</span>
              </div>
              <pre className="p-5 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
{`[00:00.012] Inspecting Host header: hacker.myfa.page
[00:00.018] Edge Rewrite -> /sites/hacker/top-hack-now
[00:00.044] Deterministic Key: posts/hacker__top-hack-now
[00:00.089] Payload Size: 15.8 KB (Spark Limit: 900.0 KB)
[00:00.112] Injecting Security Headers:
            Content-Type: text/html; charset=utf-8
            Cache-Control: public, s-maxage=60, stale-while-revalidate=300
            X-Content-Type-Options: nosniff
[00:00.145] Edge Response 200 OK streamed to reader.`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-[#05070c]/80 border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-indigo-400">
              ARCHITECTURAL BENCHMARK
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Why Creators Choose MyfaPost Over Legacy Hosting
            </h2>
          </div>

          <div className="overflow-x-auto glass-card rounded-2xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 font-mono text-xs uppercase text-slate-300">
                  <th className="py-4 px-5">Capability / Metric</th>
                  <th className="py-4 px-5 text-indigo-300">MyfaPost Creator OS (*.myfa.page)</th>
                  <th className="py-4 px-5 text-slate-400">Traditional cPanel / VPS</th>
                  <th className="py-4 px-5 text-slate-400">Closed Blogging Silos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">Monthly Infrastructure Cost</td>
                  <td className="py-3.5 px-5 font-mono text-emerald-400 font-bold">$0.00 Free Forever</td>
                  <td className="py-3.5 px-5 text-slate-400">$12 – $48 / month + SSL fees</td>
                  <td className="py-3.5 px-5 text-slate-400">$10/mo paywalls or 10% revenue cut</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">Custom Standalone index.html</td>
                  <td className="py-3.5 px-5 text-emerald-300">Full Raw HTML5 / CSS / JS Support</td>
                  <td className="py-3.5 px-5 text-slate-400">Manual FTP / SFTP uploads</td>
                  <td className="py-3.5 px-5 text-rose-400">Blocked (Locked WYSIWYG only)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">Wildcard Subdomain Provisioning</td>
                  <td className="py-3.5 px-5 text-emerald-300">Instant O(1) Edge Claim</td>
                  <td className="py-3.5 px-5 text-slate-400">Manual Apache/Nginx vhost reload</td>
                  <td className="py-3.5 px-5 text-slate-400">Paid custom domain add-on</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">Global Edge Caching</td>
                  <td className="py-3.5 px-5 text-emerald-300">340+ PoPs (s-maxage=60)</td>
                  <td className="py-3.5 px-5 text-slate-400">Single-region origin server</td>
                  <td className="py-3.5 px-5 text-slate-400">Opaque platform CDN</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-white">Archive Portability</td>
                  <td className="py-3.5 px-5 text-emerald-300">1-Click Full JSON &amp; CSV Export</td>
                  <td className="py-3.5 px-5 text-slate-400">Manual mysqldump + tarballs</td>
                  <td className="py-3.5 px-5 text-slate-400">Partial RSS export only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-indigo-400">
            TECHNICAL SPECIFICATION FAQ
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Frequently Asked Engineering Questions
          </h2>
        </div>

        <div className="space-y-3">
          {HOME_FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl overflow-hidden border border-white/10"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm sm:text-base text-white hover:bg-white/5 transition"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
