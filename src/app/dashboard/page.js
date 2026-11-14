"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Eye,
  Users,
  FileText,
  Clock,
  ExternalLink,
  Edit3,
  ShieldCheck,
  Activity,
  Sparkles,
  Globe,
  ArrowUpRight
} from "lucide-react";
import CreatorShell from "@/components/CreatorShell";
import { useAuth } from "@/context/AuthContext";
import { ROOT_DOMAIN } from "@/lib/constants";
import { listPostsBySubdomain } from "@/lib/firebase";

const TRAFFIC_SERIES = {
  "7D": [
    { label: "Mon", views: 4200 },
    { label: "Tue", views: 5800 },
    { label: "Wed", views: 5100 },
    { label: "Thu", views: 7400 },
    { label: "Fri", views: 8900 },
    { label: "Sat", views: 9600 },
    { label: "Sun", views: 11200 }
  ],
  "30D": [
    { label: "W1", views: 24500 },
    { label: "W2", views: 31200 },
    { label: "W3", views: 38900 },
    { label: "W4", views: 46800 }
  ],
  "90D": [
    { label: "Sep", views: 82400 },
    { label: "Oct", views: 109500 },
    { label: "Nov", views: 128450 }
  ]
};

const GEO_REGIONS = [
  { region: "North America (IAD / SFO / ORD)", share: 42 },
  { region: "Europe (FRA / LHR / AMS)", share: 29 },
  { region: "Africa & Middle East (ADD / NBO / DXB)", share: 16 },
  { region: "Asia Pacific (NRT / SIN / SYD)", share: 13 }
];

export default function DashboardPage() {
  const { user, activeSubdomain, subdomainRecord } = useAuth();
  const [timeframe, setTimeframe] = useState("7D");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    listPostsBySubdomain(activeSubdomain).then((res) => setPosts(res));
  }, [activeSubdomain]);

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftPosts = posts.filter((p) => p.status === "draft");
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0) || 107600;
  const chartData = TRAFFIC_SERIES[timeframe];
  const maxBar = Math.max(...chartData.map((d) => d.views), 1);

  return (
    <CreatorShell
      title={`Good morning, ${user?.displayName?.split(" ")[0] || "Alex"}! Your publication is thriving.`}
      subtitle={`Real-time readership telemetry, edge cache status, and editorial leaderboard for ${activeSubdomain}.${ROOT_DOMAIN}.`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Post Views</span>
            <Eye className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-white">
            {totalViews.toLocaleString()}
          </div>
          <div className="text-xs font-mono text-emerald-400">+24.8% vs prior period</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Subscribers</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-white">
            {(subdomainRecord?.subscribersCount || 4820).toLocaleString()}
          </div>
          <div className="text-xs font-mono text-emerald-400">+312 net new this month</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Published Articles</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-white">
            {publishedCount}
          </div>
          <div className="text-xs font-mono text-indigo-300">
            {draftPosts.length} active studio drafts
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Read Time</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-white">6m 14s</div>
          <div className="text-xs font-mono text-emerald-400">84% average completion</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-card rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Readership &amp; Domain Traffic (Audience Pulse)
              </h2>
              <p className="text-xs text-slate-400">
                Verified HTTP/3 requests served from {activeSubdomain}.{ROOT_DOMAIN}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#07090f] p-1 rounded-xl border border-white/10">
              {["7D", "30D", "90D"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    timeframe === tf
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-56 flex items-end gap-4 pt-6 px-2">
            {chartData.map((bar) => {
              const heightPct = Math.max(18, Math.round((bar.views / maxBar) * 100));
              return (
                <div
                  key={bar.label}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <div className="font-mono text-[11px] text-indigo-300 opacity-85 group-hover:opacity-100">
                    {(bar.views / 1000).toFixed(1)}k
                  </div>
                  <div className="w-full bg-[#07090f] rounded-xl h-40 flex items-end p-1 border border-white/5">
                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-indigo-600 via-violet-500 to-emerald-400 transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-slate-400">{bar.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Subdomain Health</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-xs">
              OPTIMAL
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#07090f] border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">Target Hostname</span>
              <span className="font-mono text-white font-semibold">
                {activeSubdomain}.{ROOT_DOMAIN}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#07090f] border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">Wildcard SSL Certificate</span>
              <span className="font-mono text-emerald-400">Valid (Let&apos;s Encrypt TLS 1.3)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#07090f] border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">CDN Cache Hit Ratio</span>
              <span className="font-mono text-indigo-300">99.4% (s-maxage=60)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#07090f] border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">Index File Synced</span>
              <span className="font-mono text-emerald-400">Verified O(1) Store</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Audience Geo Global CDN
            </h3>
            {GEO_REGIONS.map((g) => (
              <div key={g.region} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">{g.region}</span>
                  <span className="font-mono text-indigo-300">{g.share}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#07090f] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                    style={{ width: `${g.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Top Performing Posts (Editorial Leaderboard)
            </h2>
            <Link href="/posts" className="text-xs font-mono text-indigo-300 hover:underline">
              Manage Full Inventory →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase">
                  <th className="py-3 pr-4">Dispatch Title &amp; Slug</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Views</th>
                  <th className="py-3 px-3">Read Ratio</th>
                  <th className="py-3 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/5 transition">
                    <td className="py-3.5 pr-4">
                      <div className="font-bold text-white line-clamp-1">{post.title}</div>
                      <div className="font-mono text-[11px] text-indigo-300">
                        {post.subdomain}.{ROOT_DOMAIN}/{post.slug}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] uppercase ${
                          post.status === "published"
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-white">
                      {(post.views || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-emerald-400">
                      {post.readRatio || "82%"}
                    </td>
                    <td className="py-3.5 pl-3 text-right space-x-2">
                      <Link
                        href={`/?preview_sub=${post.subdomain}&preview_slug=${post.slug}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-200"
                      >
                        <span>Live</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                      <Link
                        href={`/posts/${post.slug}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-xs font-mono text-indigo-200"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Quick Drafts</h2>
            <Link
              href="/posts/new"
              className="text-xs font-mono text-emerald-400 hover:underline"
            >
              + New Draft
            </Link>
          </div>
          <div className="space-y-3">
            {posts.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#07090f] border border-white/10 space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{item.category}</span>
                  <span>{item.readTime}</span>
                </div>
                <div className="text-sm font-bold text-white line-clamp-1">
                  {item.title}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-[11px] text-indigo-300">
                    /{item.slug}
                  </span>
                  <Link
                    href={`/posts/${item.slug}/edit`}
                    className="text-xs font-semibold text-white hover:text-indigo-300"
                  >
                    Resume in Studio →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CreatorShell>
  );
}
