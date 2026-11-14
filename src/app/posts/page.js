"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  FilePlus2,
  ExternalLink,
  Edit3,
  Copy,
  Trash2,
  Eye,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import CreatorShell from "@/components/CreatorShell";
import DeletePostModal from "@/components/DeletePostModal";
import { useAuth } from "@/context/AuthContext";
import { ROOT_DOMAIN, PUBLICATION_CATEGORIES } from "@/lib/constants";
import {
  listPostsBySubdomain,
  savePostDocument,
  deletePostDocument
} from "@/lib/firebase";

export default function PostsInventoryPage() {
  const { activeSubdomain } = useAuth();
  const [posts, setPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [postToDelete, setPostToDelete] = useState(null);
  const [bannerMsg, setBannerMsg] = useState("");

  const refreshPosts = async () => {
    const data = await listPostsBySubdomain(activeSubdomain);
    setPosts(data);
  };

  useEffect(() => {
    refreshPosts();
  }, [activeSubdomain]);

  const filteredPosts = posts.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (p.title || "").toLowerCase().includes(q);
      const matchSlug = (p.slug || "").toLowerCase().includes(q);
      if (!matchTitle && !matchSlug) return false;
    }
    return true;
  });

  const handleDuplicateAsDraft = async (post) => {
    const newSlug = `${post.slug}-copy-${Math.floor(Math.random() * 900 + 100)}`;
    await savePostDocument({
      ...post,
      slug: newSlug,
      title: `${post.title} (Draft Copy)`,
      status: "draft",
      views: 0,
      claps: 0
    });
    setBannerMsg(`Duplicated "${post.title}" as draft (/${newSlug}).`);
    await refreshPosts();
  };

  const handleDeleteConfirmed = async (target) => {
    await deletePostDocument(target.subdomain, target.slug);
    setBannerMsg(`Permanently deleted ${target.subdomain}__${target.slug} and purged edge cache.`);
    await refreshPosts();
  };

  const handleExportCsv = () => {
    const headers = ["ID", "Subdomain", "Slug", "Title", "Category", "Status", "Views", "Claps", "PublishedAt"];
    const rows = filteredPosts.map((p) => [
      p.id,
      p.subdomain,
      p.slug,
      `"${(p.title || "").replace(/"/g, '""')}"`,
      `"${p.category || ""}"`,
      p.status,
      p.views || 0,
      p.claps || 0,
      p.publishedAt || ""
    ]);
    const csvString = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeSubdomain}-posts-inventory.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <CreatorShell
      title="My Posts & Articles Inventory"
      subtitle={`Manage standalone index.html dispatches, filter by publication status, duplicate drafts, or purge edge routes on ${activeSubdomain}.${ROOT_DOMAIN}.`}
      actions={
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV</span>
          </button>
          <Link
            href="/posts/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-electric text-xs font-bold shadow-glow"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>+ Create New Post</span>
          </Link>
        </div>
      }
    >
      {bannerMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300">
          <span>{bannerMsg}</span>
          <button onClick={() => setBannerMsg("")} className="underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 bg-[#07090f] p-1.5 rounded-xl border border-white/10">
          {[
            { id: "all", label: `All (${posts.length})` },
            {
              id: "published",
              label: `Published (${posts.filter((p) => p.status === "published").length})`
            },
            {
              id: "draft",
              label: `Drafts (${posts.filter((p) => p.status === "draft").length})`
            },
            {
              id: "scheduled",
              label: `Scheduled (${posts.filter((p) => p.status === "scheduled").length})`
            }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === tab.id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#07090f] border border-white/10 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title or slug..."
              className="bg-transparent text-xs text-white focus:outline-none w-48"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#07090f] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200"
          >
            <option value="all">All Categories</option>
            {PUBLICATION_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold">
                  {post.category}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] uppercase ${
                    post.status === "published"
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {post.status}
                </span>
                <span className="font-mono text-slate-400">
                  https://{post.subdomain}.{ROOT_DOMAIN}/{post.slug === "index" ? "" : post.slug}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{post.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-2">{post.excerpt}</p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-mono text-slate-400">
                <span>{(post.views || 0).toLocaleString()} views</span>
                <span>•</span>
                <span>{(post.claps || 0).toLocaleString()} claps</span>
                <span>•</span>
                <span>{post.readTime || "5 min read"}</span>
                <span>•</span>
                <span>Key: {post.id}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href={`/?preview_sub=${post.subdomain}&preview_slug=${post.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-emerald-300"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Live</span>
              </Link>

              <Link
                href={`/posts/${post.slug}/edit`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-xs font-semibold text-indigo-200"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>

              <button
                onClick={() => handleDuplicateAsDraft(post)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Duplicate</span>
              </button>

              <button
                onClick={() => setPostToDelete(post)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold text-rose-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <DeletePostModal
        post={postToDelete}
        isOpen={Boolean(postToDelete)}
        onClose={() => setPostToDelete(null)}
        onConfirmDelete={handleDeleteConfirmed}
      />
    </CreatorShell>
  );
}
