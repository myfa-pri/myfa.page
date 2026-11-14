"use client";

import React from "react";
import { Sparkles, CheckCircle2, Rocket } from "lucide-react";

const RELEASES = [
  {
    version: "v3.4.0 — Production Creator OS",
    date: "November 2026",
    badge: "CURRENT RELEASE",
    highlights: [
      "Complete 16-page Creator OS workspace matching the Obsidian & Electric Indigo design system.",
      "Dual-mode Studio Editor supporting Raw index.html file uploads (up to 900 KB) and Rich Markdown compilation.",
      "Root homepage override via the reserved 'index' slug plus automatic dark-glassmorphic directory fallback.",
      "Global Command Palette (Cmd+K / Ctrl+K), 8-module Creator Academy, and 6 production HTML5 starter templates."
    ]
  },
  {
    version: "v3.0.0 — Wildcard Edge Middleware Engine",
    date: "October 2026",
    badge: "EDGE CORE",
    highlights: [
      "Zero-VPS Next.js Edge Middleware routing *.myfa.page and ?preview_sub= overrides.",
      "Deterministic O(1) Cloud Firestore composite keys ({subdomain}__{slug}) with stale-while-revalidate caching."
    ]
  },
  {
    version: "v2.4.0 — Sovereign Archive & Security Shield",
    date: "September 2026",
    badge: "SECURITY",
    highlights: [
      "Production firestore.rules enforcing strict UID ownership and 900 KB document ceiling.",
      "1-Click Full JSON Publication Archive export/restore and CSV inventory exports."
    ]
  }
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen obsidian-radial-bg py-14 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-indigo-400">
            PLATFORM CHANGELOG &amp; ROADMAP
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            MyfaPost Creator OS Release History
          </h1>
        </div>

        <div className="space-y-6">
          {RELEASES.map((rel) => (
            <div key={rel.version} className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-white">{rel.version}</h2>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-400">{rel.date}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {rel.badge}
                  </span>
                </div>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {rel.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
