"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Eye,
  Download,
  Copy,
  Check,
  Sparkles,
  X
} from "lucide-react";
import CreatorShell from "@/components/CreatorShell";
import { STARTER_TEMPLATES } from "@/lib/starterTemplates";

export default function TemplatesGalleryPage() {
  const [selectedTpl, setSelectedTpl] = useState(null);
  const [viewMode, setViewMode] = useState("preview");
  const [copiedId, setCopiedId] = useState(null);

  const handleCopySource = (tpl) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(tpl.htmlContent);
      setCopiedId(tpl.id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  const handleDownloadHtml = (tpl) => {
    const blob = new Blob([tpl.htmlContent], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tpl.recommendedSlug || tpl.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <CreatorShell
      title="HTML5 Starter Templates Gallery"
      subtitle="Production-ready standalone index.html templates under 20 KB. Preview live, inspect source code, download .html, or open directly in the Studio Editor."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STARTER_TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold">
                  {tpl.category}
                </span>
                <span className="font-mono text-emerald-400">{tpl.sizeKb}</span>
              </div>

              <h3 className="text-lg font-bold text-white">{tpl.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{tpl.description}</p>

              <div className="font-mono text-[11px] text-indigo-300 bg-[#07090f] px-3 py-1.5 rounded-lg border border-white/10">
                Recommended Slug: /{tpl.recommendedSlug}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setSelectedTpl(tpl);
                    setViewMode("preview");
                  }}
                  className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => handleCopySource(tpl)}
                  className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white"
                >
                  {copiedId === tpl.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span>{copiedId === tpl.id ? "Copied" : "Copy"}</span>
                </button>
                <button
                  onClick={() => handleDownloadHtml(tpl)}
                  className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>.HTML</span>
                </button>
              </div>

              <Link
                href={`/posts/new?template=${tpl.id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl btn-electric text-xs font-bold shadow-glow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open in Studio Editor</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {selectedTpl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-5xl rounded-2xl bg-[#0d111c] border border-white/15 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-[#07090f] border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{selectedTpl.name}</h3>
                <div className="text-xs font-mono text-slate-400">
                  Slug: /{selectedTpl.recommendedSlug} · {selectedTpl.sizeKb}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("preview")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    viewMode === "preview" ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400"
                  }`}
                >
                  Rendered Preview
                </button>
                <button
                  onClick={() => setViewMode("source")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    viewMode === "source" ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400"
                  }`}
                >
                  Raw HTML5 Source
                </button>
                <button
                  onClick={() => setSelectedTpl(null)}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#05070c]">
              {viewMode === "preview" ? (
                <iframe
                  title={selectedTpl.name}
                  srcDoc={selectedTpl.htmlContent}
                  className="w-full h-[520px] rounded-xl border border-white/10 bg-[#07090f]"
                />
              ) : (
                <pre className="w-full h-[520px] overflow-auto p-4 rounded-xl bg-[#07090f] border border-white/10 font-mono text-xs text-emerald-300">
                  {selectedTpl.htmlContent}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </CreatorShell>
  );
}
