"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Globe,
  FileText,
  BookOpen,
  Code2,
  Shield,
  BarChart3,
  Layers,
  Terminal,
  X,
  ArrowRight
} from "lucide-react";
import { STARTER_TEMPLATES } from "@/lib/starterTemplates";
import { CREATOR_LESSONS } from "@/lib/lessonsData";

const PAGES_INDEX = [
  { title: "Home & Subdomain Showcase", path: "/", category: "Core Platform", desc: "Live availability checker, telemetry & architecture overview" },
  { title: "Sign Up, Login & Claim Subdomain", path: "/auth", category: "Core Platform", desc: "2-step account creation & subdomain reservation" },
  { title: "Creator OS Dashboard", path: "/dashboard", category: "Workspace", desc: "Audience pulse chart, KPIs, leaderboard & edge health" },
  { title: "My Posts Inventory & Delete Flow", path: "/posts", category: "Workspace", desc: "Filter dispatches, export CSV, duplicate or purge posts" },
  { title: "Studio Editor — Create New Post", path: "/posts/new", category: "Workspace", desc: "Dual Raw HTML5 & Markdown studio with live iframe preview" },
  { title: "Edit Existing Post Studio", path: "/posts/webassembly-cloudflare-edge/edit", category: "Workspace", desc: "Modify existing post HTML, slug, schedule & SEO metadata" },
  { title: "Manage Subdomain, DNS & Backups", path: "/manage", category: "Workspace", desc: "Wildcard DNS records, Spark quota monitor & JSON export" },
  { title: "Creator Academy (8 Technical Lessons)", path: "/lessons", category: "Education", desc: "Interactive curriculum on edge routing, SEO & security" },
  { title: "HTML5 Starter Templates Gallery", path: "/templates", category: "Studio Assets", desc: "6 standalone HTML5 templates with code viewer & download" },
  { title: "Audience & Subscriber CRM", path: "/audience", category: "Workspace", desc: "Subscriber growth, embeddable HTML form & CSV export" },
  { title: "Deep Edge Analytics & Core Web Vitals", path: "/analytics", category: "Workspace", desc: "HTTP/3 status codes, LCP/TTFB telemetry & bandwidth calculator" },
  { title: "Global Subdomain Showcase Directory", path: "/showcase", category: "Network", desc: "Explore live publications hosted on *.myfa.page" },
  { title: "Global Edge Network Status", path: "/status", category: "Network", desc: "340+ CDN edge PoPs, 90-day uptime & incident history" },
  { title: "Serverless Architecture Whitepaper", path: "/whitepaper", category: "Documentation", desc: "Zero-VPS request lifecycle & O(1) Firestore key math" },
  { title: "Privacy Shield & Multi-Tenant Security", path: "/security", category: "Documentation", desc: "Origin isolation, Public Suffix List & Firestore rules" },
  { title: "Creator OS Changelog & Roadmap", path: "/changelog", category: "Documentation", desc: "v3.4 Production release notes & upcoming milestones" }
];

export default function CommandPalette({ isOpen, onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedPages = PAGES_INDEX.filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );

  const matchedTemplates = STARTER_TEMPLATES.filter(
    (t) =>
      q &&
      (t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q))
  );

  const matchedLessons = CREATOR_LESSONS.filter(
    (l) =>
      q &&
      (l.title.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q))
  );

  const navigateTo = (path) => {
    onClose();
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 backdrop-blur-md pt-20 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0d111c] border border-white/15 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to any of the 16 pages, HTML5 templates, or Creator Academy lessons..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-3 space-y-4">
          <div>
            <div className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Platform Pages ({matchedPages.length})
            </div>
            <div className="mt-1 space-y-1">
              {matchedPages.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-indigo-500/15 text-left group transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-indigo-300">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-400">{item.desc}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                      {item.path}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {matchedTemplates.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                HTML5 Templates ({matchedTemplates.length})
              </div>
              <div className="mt-1 space-y-1">
                {matchedTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => navigateTo(`/posts/new?template=${tpl.id}`)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-emerald-500/15 text-left transition"
                  >
                    <div className="flex items-center gap-3">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">{tpl.name}</div>
                        <div className="text-xs text-slate-400">{tpl.description}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-300">{tpl.sizeKb}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedLessons.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-purple-400">
                Creator Academy Lessons ({matchedLessons.length})
              </div>
              <div className="mt-1 space-y-1">
                {matchedLessons.map((les) => (
                  <button
                    key={les.id}
                    onClick={() => navigateTo("/lessons")}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-purple-500/15 text-left transition"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Lesson {les.number}: {les.title}
                        </div>
                        <div className="text-xs text-slate-400">{les.summary}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-purple-300">{les.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-[#07090f] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Press ESC to close</span>
          <span className="font-mono text-indigo-400">MyfaPost Command OS v3.4</span>
        </div>
      </div>
    </div>
  );
}
