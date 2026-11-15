"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Code2,
  FileText,
  Upload,
  Monitor,
  Smartphone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Globe,
  Tag,
  History,
  RotateCcw,
  ExternalLink,
  Trash2,
  Eye,
  Save,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Quote,
  List,
  Link2,
  Minus
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  ROOT_DOMAIN,
  PUBLICATION_CATEGORIES,
  MAX_HTML_BYTES
} from "@/lib/constants";
import {
  slugifyInput,
  calculateReadingStats,
  analyzeSeoScore,
  compileStandaloneHtmlDocument
} from "@/lib/htmlCompiler";
import { savePostDocument, deletePostDocument } from "@/lib/firebase";
import { STARTER_TEMPLATES } from "@/lib/starterTemplates";
import DeletePostModal from "./DeletePostModal";

export default function PostStudioEditor({ initialPost = null, templateId = null }) {
  const router = useRouter();
  const { activeSubdomain, subdomainRecord, user } = useAuth();

  const [editorMode, setEditorMode] = useState(initialPost?.editorMode || "markdown");
  const [title, setTitle] = useState(
    initialPost?.title ||
      "The Architectural Shift: How Next-Gen Subdomain Publishing Replaces Legacy CMS"
  );
  const [slug, setSlug] = useState(
    initialPost?.slug || "architectural-shift-subdomain-publishing"
  );
  const [excerpt, setExcerpt] = useState(
    initialPost?.excerpt ||
      "How wildcard DNS host inspection, deterministic O(1) Firestore keys, and standalone HTML5 payloads deliver 0.18s global TTFB at $0 infrastructure cost."
  );
  const [category, setCategory] = useState(initialPost?.category || "Tech & AI");
  const [tags, setTags] = useState(
    initialPost?.tags || ["Architecture", "EdgeCompute", "Subdomains", "HTML5"]
  );
  const [tagInput, setTagInput] = useState("");
  const [publishMode, setPublishMode] = useState(
    initialPost?.status === "scheduled" ? "schedule" : "immediate"
  );
  const [scheduledDate, setScheduledDate] = useState(
    initialPost?.scheduledFor || "2026-12-01T09:00"
  );
  const [viewport, setViewport] = useState("desktop");
  const [markdownBody, setMarkdownBody] = useState(
    initialPost?.markdownBody ||
      `# The Architectural Shift: How Next-Gen Subdomain Publishing Replaces Legacy CMS

Traditional content management systems execute dozens of database joins on every request. **MyfaPost Creator OS** flips this model: your article is compiled into a self-contained \`index.html\` payload and stored under a deterministic key (\`{subdomain}__{slug}\`).

## Deterministic Edge Resolution

When a reader visits your custom subdomain, Next.js Edge Middleware inspects the \`Host\` header and rewrites directly to the edge route handler with \`Cache-Control: public, s-maxage=60, stale-while-revalidate=300\`.

- **Subdomain Root Override**: Set the slug to \`index\` to serve this page as your root homepage at \`https://${activeSubdomain}.${ROOT_DOMAIN}\`.
- **900 KB Spark Ceiling**: Validated in real time to stay strictly inside Cloud Firestore's 1 MiB limit.
- **Zero Lock-In**: Export or edit the raw HTML5 source code at any time.

\`\`\`javascript
const docId = \`\${subdomain}__\${slug || "index"}\`;
const snapshot = await getDoc(doc(db, "posts", docId));
\`\`\`

> "Independent technical writers deserve sovereign infrastructure that runs free forever."`
  );

  const [rawHtmlContent, setRawHtmlContent] = useState(
    initialPost?.htmlContent || STARTER_TEMPLATES[0].htmlContent
  );

  const [snapshots, setSnapshots] = useState([
    {
      id: "snap-init",
      label: "Initial Studio Buffer",
      timestamp: "Just now",
      title: initialPost?.title || "The Architectural Shift: How Next-Gen Subdomain Publishing Replaces Legacy CMS",
      markdownBody: initialPost?.markdownBody || "",
      rawHtmlContent: initialPost?.htmlContent || STARTER_TEMPLATES[0].htmlContent
    }
  ]);

  const [savingStatus, setSavingStatus] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (templateId) {
      const found = STARTER_TEMPLATES.find((t) => t.id === templateId);
      if (found) {
        setEditorMode("html");
        setTitle(found.name);
        setSlug(found.recommendedSlug);
        setExcerpt(found.description);
        setCategory(found.category);
        setTags(found.tags);
        setRawHtmlContent(found.htmlContent);
      }
    }
  }, [templateId]);

  const effectiveHtml = useMemo(() => {
    if (editorMode === "html") {
      return rawHtmlContent;
    }
    return compileStandaloneHtmlDocument({
      subdomain: activeSubdomain,
      publicationName: subdomainRecord?.displayName || `${activeSubdomain} Dispatch`,
      authorName: user?.displayName || "Alex Rivera",
      authorRole: subdomainRecord?.authorRole || "Principal Systems Architect",
      title,
      excerpt,
      slug: slugifyInput(slug) || "index",
      category,
      tags,
      publishedAt: new Date().toISOString(),
      markdownBody,
      accentColor: subdomainRecord?.accentColor || "#6366f1"
    });
  }, [
    editorMode,
    rawHtmlContent,
    activeSubdomain,
    subdomainRecord,
    user,
    title,
    excerpt,
    slug,
    category,
    tags,
    markdownBody
  ]);

  const readingStats = useMemo(
    () => calculateReadingStats(editorMode === "html" ? rawHtmlContent : markdownBody),
    [editorMode, rawHtmlContent, markdownBody]
  );

  const seoReport = useMemo(
    () =>
      analyzeSeoScore({
        title,
        excerpt,
        slug,
        htmlContent: effectiveHtml,
        tags
      }),
    [title, excerpt, slug, effectiveHtml, tags]
  );

  const insertMarkdownSyntax = (prefix, suffix = "") => {
    setMarkdownBody((prev) => `${prev}\n${prefix}Section Text${suffix}`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_HTML_BYTES) {
      setSavingStatus("Error: File exceeds 900 KB Firestore document limit.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = String(ev.target?.result || "");
      setEditorMode("html");
      setRawHtmlContent(content);
      const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        setTitle(titleMatch[1].split("|")[0].trim());
      }
      setSavingStatus(`Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    };
    reader.readAsText(file);
  };

  const addTagChip = (e) => {
    e.preventDefault();
    const clean = tagInput.trim().replace(/^#/, "");
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput("");
  };

  const removeTagChip = (t) => {
    setTags(tags.filter((item) => item !== t));
  };

  const captureSnapshot = () => {
    const newSnap = {
      id: `snap-${Date.now()}`,
      label: `Revision #${snapshots.length + 1} (${editorMode.toUpperCase()})`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      title,
      markdownBody,
      rawHtmlContent
    };
    setSnapshots((prev) => [newSnap, ...prev.slice(0, 5)]);
    setSavingStatus("Snapshot captured in local studio history.");
  };

  const restoreSnapshot = (snap) => {
    setTitle(snap.title);
    if (snap.markdownBody) setMarkdownBody(snap.markdownBody);
    if (snap.rawHtmlContent) setRawHtmlContent(snap.rawHtmlContent);
    setSavingStatus(`Restored ${snap.label}`);
  };

  const handleSave = async (targetStatus) => {
    const cleanSlug = slugifyInput(slug) || "index";
    setSavingStatus("Compiling & syncing to Firestore Edge...");
    try {
      const saved = await savePostDocument({
        subdomain: activeSubdomain,
        slug: cleanSlug,
        title,
        excerpt,
        category,
        tags,
        status: targetStatus,
        scheduledFor: publishMode === "schedule" ? scheduledDate : null,
        readTime: readingStats.readTimeLabel,
        userId: user?.uid || "demo-user-alex",
        authorName: user?.displayName || "Alex Rivera",
        editorMode,
        markdownBody,
        htmlContent: effectiveHtml
      });
      captureSnapshot();
      setSavingStatus(
        targetStatus === "published"
          ? `Published live at https://${saved.subdomain}.${ROOT_DOMAIN}/${saved.slug === "index" ? "" : saved.slug}`
          : `Saved as ${targetStatus.toUpperCase()} (${saved.subdomain}__${saved.slug})`
      );
    } catch (err) {
      setSavingStatus(`Error: ${err.message}`);
    }
  };

  const handleConfirmDelete = async (postToDelete) => {
    await deletePostDocument(postToDelete.subdomain, postToDelete.slug);
    router.push("/posts");
  };

  const livePreviewUrl =
    slugifyInput(slug) === "index"
      ? `/?preview_sub=${activeSubdomain}`
      : `/?preview_sub=${activeSubdomain}&preview_slug=${slugifyInput(slug)}`;

  return (
    <div className="min-h-screen obsidian-radial-bg p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <span>STUDIO EDITOR v3.4</span>
              <span>•</span>
              <span>TARGET KEY: {activeSubdomain}__{slugifyInput(slug) || "index"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {initialPost ? `Editing: ${initialPost.title}` : "Create & Deploy Standalone Dispatch"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={captureSnapshot}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200"
            >
              <History className="w-3.5 h-3.5 text-indigo-400" />
              <span>Snapshot</span>
            </button>

            <Link
              href={livePreviewUrl}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-emerald-300"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Edge Route</span>
            </Link>

            <button
              onClick={() => handleSave("draft")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            <button
              onClick={() =>
                handleSave(publishMode === "schedule" ? "scheduled" : "published")
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-electric text-xs font-bold shadow-glow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {publishMode === "schedule" ? "Schedule Release" : "Publish to Subdomain"}
              </span>
            </button>

            {initialPost && (
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold text-rose-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {savingStatus && (
          <div className="px-4 py-3 rounded-xl bg-indigo-500/15 border border-indigo-500/35 flex items-center justify-between text-xs text-indigo-200 font-mono">
            <span>{savingStatus}</span>
            <Link href={livePreviewUrl} className="underline text-emerald-300">
              Inspect Live Edge Output →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditorMode("markdown")}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                      editorMode === "markdown"
                        ? "btn-electric shadow-glow"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Rich Markdown Compiler</span>
                  </button>
                  <button
                    onClick={() => setEditorMode("html")}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                      editorMode === "html"
                        ? "btn-electric shadow-glow"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Raw index.html Studio</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-400">{readingStats.words} words</span>
                  <span>•</span>
                  <span className="text-indigo-300">{readingStats.readTimeLabel}</span>
                  <span>•</span>
                  <span
                    className={
                      readingStats.withinSparkLimit ? "text-emerald-400" : "text-rose-400"
                    }
                  >
                    {readingStats.kbSize} KB / 900 KB Max
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Article Headline (H1 &amp; Title Tag)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#07090f] border border-white/10 rounded-xl px-4 py-2.5 text-base font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Executive Summary / Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full bg-[#07090f] border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {editorMode === "markdown" ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-[#07090f] border border-white/10">
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax("# ")}
                      className="p-2 rounded-lg hover:bg-white/10 text-slate-300"
                      title="Heading 1"
                    >
                      <Heading1 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax("## ")}
                      className="p-2 rounded-lg hover:bg-white/10 text-slate-300"
                      title="Heading 2"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax("**", "**")}
                      className="p-2 rounded-lg hover:bg-white/10 text-slate-300"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax("*", "*")}
                      className="p-2 rounded-lg hover:bg-white/10 text-slate-300"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax("> ")}
                      className="p-2 rounded-lg hover:bg-white/10 text-slate-300"
                      title="Quote"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax("- ")}
                      className="p-2 rounded-lg hover:bg-white/10 text-slate-300"
                      title="Bullet List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax("[Link Text](https://myfa.page)")}
                      className="p-2 rounded-lg hover:bg-white/10 text-slate-300"
                      title="Hyperlink"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax("```javascript\n", "\n```")}
                      className="p-2 rounded-lg hover:bg-white/10 text-slate-300"
                      title="Code Block"
                    >
                      <Code2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax("\n---\n")}
                      className="p-2 rounded-lg hover:bg-white/10 text-slate-300"
                      title="Divider"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    rows={14}
                    value={markdownBody}
                    onChange={(e) => setMarkdownBody(e.target.value)}
                    className="w-full bg-[#05070c] border border-white/10 rounded-xl p-4 font-mono text-sm text-slate-100 leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#07090f] border border-white/10">
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-xs font-semibold text-indigo-200 cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload .html / .htm File</span>
                        <input
                          type="file"
                          accept=".html,.htm"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <select
                        onChange={(e) => {
                          const tpl = STARTER_TEMPLATES.find((t) => t.id === e.target.value);
                          if (tpl) {
                            setRawHtmlContent(tpl.htmlContent);
                            setSlug(tpl.recommendedSlug);
                          }
                        }}
                        className="bg-[#0d111c] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                      >
                        <option value="">Load Starter HTML5 Template...</option>
                        {STARTER_TEMPLATES.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.sizeKb})
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      Full Standalone HTML5 / CSS / JS Enabled
                    </span>
                  </div>

                  <textarea
                    rows={15}
                    value={rawHtmlContent}
                    onChange={(e) => setRawHtmlContent(e.target.value)}
                    className="w-full bg-[#05070c] border border-white/10 rounded-xl p-4 font-mono text-xs text-emerald-200 leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    Live Sandboxed Subdomain Output Preview
                  </h3>
                  <span className="font-mono text-xs text-slate-400">
                    https://{activeSubdomain}.{ROOT_DOMAIN}/{slugifyInput(slug) === "index" ? "" : slugifyInput(slug)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-[#07090f] p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setViewport("desktop")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      viewport === "desktop"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setViewport("mobile")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      viewport === "mobile"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile (390px)</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#05070c] border border-white/10 rounded-2xl p-3 flex justify-center">
                <iframe
                  title="Live Subdomain HTML5 Preview"
                  srcDoc={effectiveHtml}
                  className={`rounded-xl border border-white/10 bg-[#07090f] transition-all duration-300 ${
                    viewport === "mobile" ? "w-[390px] h-[560px]" : "w-full h-[540px]"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Publishing Schedule &amp; Canonical Slug</span>
              </h3>

              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#07090f] border border-white/10">
                <button
                  type="button"
                  onClick={() => setPublishMode("immediate")}
                  className={`py-1.5 rounded-lg text-xs font-semibold ${
                    publishMode === "immediate"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Immediate Edge Push
                </button>
                <button
                  type="button"
                  onClick={() => setPublishMode("schedule")}
                  className={`py-1.5 rounded-lg text-xs font-semibold ${
                    publishMode === "schedule"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Schedule Release
                </button>
              </div>

              {publishMode === "schedule" && (
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Target UTC Release Timestamp
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-[#07090f] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-slate-400">CANONICAL SLUG</span>
                  <button
                    type="button"
                    onClick={() => setSlug("index")}
                    className="font-mono text-[11px] text-emerald-400 hover:underline"
                  >
                    Use &quot;index&quot; for Root Homepage
                  </button>
                </div>
                <div className="flex items-center bg-[#07090f] border border-white/10 rounded-xl overflow-hidden">
                  <span className="px-3 py-2 text-xs font-mono text-slate-400 bg-white/5 border-r border-white/10">
                    {activeSubdomain}.{ROOT_DOMAIN}/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="top-hack-now or index"
                    className="w-full bg-transparent px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-400" />
                <span>Categories &amp; Tags</span>
              </h3>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Primary Section Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#07090f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {PUBLICATION_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <form onSubmit={addTagChip} className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag (e.g. WebAssembly)..."
                    className="flex-1 bg-[#07090f] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-xs font-semibold text-indigo-200"
                  >
                    + Add
                  </button>
                </form>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tags.map((t) => (
                    <span
                      key={t}
                      onClick={() => removeTagChip(t)}
                      className="cursor-pointer px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 border border-white/10 text-xs font-mono text-slate-300"
                    >
                      #{t} ×
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">SEO Configuration</h3>
                <span
                  className={`font-mono text-sm font-extrabold px-2.5 py-0.5 rounded-full ${
                    seoReport.score >= 80
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {seoReport.score}/100
                </span>
              </div>

              <div className="w-full h-2 bg-[#07090f] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all"
                  style={{ width: `${seoReport.score}%` }}
                />
              </div>

              <div className="space-y-1.5">
                {seoReport.checks.map((chk, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    {chk.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    <span className={chk.passed ? "text-slate-300" : "text-slate-400"}>
                      {chk.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-[#07090f] border border-white/10 space-y-1">
                <div className="text-[11px] font-mono text-emerald-400 truncate">
                  https://{activeSubdomain}.{ROOT_DOMAIN}/{slugifyInput(slug) === "index" ? "" : slugifyInput(slug)}
                </div>
                <div className="text-sm font-bold text-indigo-300 line-clamp-1">
                  {title}
                </div>
                <div className="text-xs text-slate-400 line-clamp-2">{excerpt}</div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">Social Card Preview</h3>
              <div className="rounded-xl overflow-hidden border border-white/10 bg-[#07090f]">
                <div className="h-28 bg-gradient-to-br from-indigo-900/60 via-slate-900 to-emerald-900/40 p-4 flex flex-col justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                    {activeSubdomain}.{ROOT_DOMAIN}
                  </span>
                  <div className="text-xs font-bold text-white line-clamp-2">{title}</div>
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-[11px] font-mono text-slate-400">
                    {category} · {readingStats.readTimeLabel}
                  </div>
                  <div className="text-xs text-slate-300 line-clamp-2">{excerpt}</div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-400" />
                  <span>Local History Snapshots</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {snapshots.length}/6 slots
                </span>
              </div>
              <div className="space-y-2">
                {snapshots.map((snap) => (
                  <div
                    key={snap.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#07090f] border border-white/10 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{snap.label}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {snap.timestamp}
                      </div>
                    </div>
                    <button
                      onClick={() => restoreSnapshot(snap)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-indigo-300 font-mono text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeletePostModal
        post={
          initialPost || {
            subdomain: activeSubdomain,
            slug: slugifyInput(slug) || "index",
            title,
            views: 0,
            claps: 0
          }
        }
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
