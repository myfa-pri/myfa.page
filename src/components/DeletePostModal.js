"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, X, ShieldAlert, Globe } from "lucide-react";
import { ROOT_DOMAIN } from "@/lib/constants";

export default function DeletePostModal({ post, isOpen, onClose, onConfirmDelete }) {
  const [confirmed, setConfirmed] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !post) return null;

  const fullUrl =
    post.slug === "index"
      ? `https://${post.subdomain}.${ROOT_DOMAIN}`
      : `https://${post.subdomain}.${ROOT_DOMAIN}/${post.slug}`;

  const handleExecuteDelete = async () => {
    if (!confirmed) return;
    setDeleting(true);
    try {
      await onConfirmDelete(post);
      setConfirmed(false);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0d111c] border border-rose-500/35 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 bg-rose-500/10 border-b border-rose-500/25 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>Irreversible Action — Delete Article Permanently?</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-[#07090f] border border-white/10 space-y-1.5">
            <div className="text-xs font-mono text-slate-400">TARGET DOCUMENT KEY: {post.subdomain}__{post.slug}</div>
            <div className="text-base font-bold text-white">{post.title}</div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-indigo-300 break-all">
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span>{fullUrl}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
              <div className="font-semibold text-rose-300">CDN Edge Purge</div>
              <div className="text-slate-400 mt-0.5">
                Immediately purges cached HTML across all 340 edge locations.
              </div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="font-semibold text-amber-300">Telemetry Loss Alert</div>
              <div className="text-slate-400 mt-0.5">
                Permanently erases {(post.views || 0).toLocaleString()} views and {(post.claps || 0).toLocaleString()} claps.
              </div>
            </div>
          </div>

          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-rose-500 rounded"
            />
            <span className="text-xs text-slate-200 leading-relaxed">
              I understand this article will be permanently removed from my subdomain and cannot be recovered.
            </span>
          </label>
        </div>

        <div className="px-6 py-4 bg-[#07090f] border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
          >
            Cancel
          </button>
          <button
            disabled={!confirmed || deleting}
            onClick={handleExecuteDelete}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition ${
              confirmed
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30"
                : "bg-rose-950/40 text-rose-300/40 cursor-not-allowed"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{deleting ? "Purging Edge Node..." : "Delete Post Now"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
