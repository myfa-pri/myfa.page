"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Search,
  ExternalLink,
  Sparkles,
  Users
} from "lucide-react";
import {
  ROOT_DOMAIN,
  PUBLICATION_CATEGORIES,
  INITIAL_DEMO_SUBDOMAINS
} from "@/lib/constants";
import { listAllSubdomains } from "@/lib/firebase";

export default function ShowcaseDirectoryPage() {
  const [subdomains, setSubdomains] = useState(INITIAL_DEMO_SUBDOMAINS);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    listAllSubdomains().then((res) => {
      if (Array.isArray(res) && res.length) setSubdomains(res);
    });
  }, []);

  const filtered = subdomains.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.subdomain.toLowerCase().includes(q) ||
        item.displayName.toLowerCase().includes(q) ||
        (item.bio || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <main className="min-h-screen obsidian-radial-bg py-14 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
              GLOBAL SUBDOMAIN DIRECTORY (*.{ROOT_DOMAIN})
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              Independent Publications on MyfaPost
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
              Explore live tenant publications powered by wildcard edge routing and deterministic O(1) Firestore storage.
            </p>
          </div>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl btn-electric text-xs font-bold shadow-glow"
          >
            <Sparkles className="w-4 h-4" />
            <span>Claim Your Subdomain</span>
          </Link>
        </div>

        <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                category === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              All Nodes ({subdomains.length})
            </button>
            {PUBLICATION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  category === cat.id
                    ? "bg-indigo-600 text-white"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-[#07090f] border border-white/10 rounded-xl px-3.5 py-2 w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subdomain or title..."
              className="bg-transparent text-xs text-white focus:outline-none w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sub) => (
            <div
              key={sub.subdomain}
              className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {sub.subdomain}.{ROOT_DOMAIN}
                  </span>
                  <span className="text-slate-400">{sub.category}</span>
                </div>
                <h2 className="text-xl font-bold text-white">{sub.displayName}</h2>
                <p className="text-xs text-slate-300 leading-relaxed">{sub.bio}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">{sub.authorName}</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {(sub.subscribersCount || 1200).toLocaleString()} subscribers
                  </div>
                </div>
                <Link
                  href={`/?preview_sub=${sub.subdomain}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 font-mono text-xs"
                >
                  <span>Open Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
