"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Mail,
  Download,
  Copy,
  Check,
  Plus,
  Search
} from "lucide-react";
import CreatorShell from "@/components/CreatorShell";
import { useAuth } from "@/context/AuthContext";
import { ROOT_DOMAIN } from "@/lib/constants";
import { listSubscribers, addSubscriber } from "@/lib/firebase";

export default function AudienceCrmPage() {
  const { activeSubdomain } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [search, setSearch] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const loadSubs = async () => {
    const list = await listSubscribers(activeSubdomain);
    setSubscribers(list);
  };

  useEffect(() => {
    loadSubs();
  }, [activeSubdomain]);

  const handleAddSubscriber = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    await addSubscriber({
      email: newEmail.trim(),
      subdomain: activeSubdomain,
      channel: "Manual Studio Entry"
    });
    setNewEmail("");
    await loadSubs();
  };

  const embedSnippet = `<form action="https://${ROOT_DOMAIN}/audience" method="GET" style="background:#0d111c;padding:20px;border-radius:14px;border:1px solid rgba(255,255,255,0.1);">
  <h4 style="color:#fff;margin:0 0 8px;font-family:sans-serif;">Subscribe to ${activeSubdomain}.${ROOT_DOMAIN}</h4>
  <input type="hidden" name="sub" value="${activeSubdomain}" />
  <input type="email" name="email" required placeholder="reader@domain.com" style="padding:10px;border-radius:8px;border:1px solid #334155;background:#07090f;color:#fff;" />
  <button type="submit" style="padding:10px 16px;border-radius:8px;background:#6366f1;color:#fff;border:0;font-weight:bold;">Subscribe</button>
</form>`;

  const copyEmbedCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(embedSnippet);
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 1800);
    }
  };

  const exportSubscribersCsv = () => {
    const rows = [
      ["Email", "Subdomain", "Channel", "Status", "JoinedAt", "ReadsCount"],
      ...subscribers.map((s) => [s.email, s.subdomain, s.channel, s.status, s.joinedAt, s.readsCount])
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeSubdomain}-subscribers.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = subscribers.filter(
    (s) => !search.trim() || s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CreatorShell
      title="Audience & Subscriber CRM"
      subtitle={`Direct reader relationships, acquisition attribution, and embeddable HTML newsletter forms for ${activeSubdomain}.${ROOT_DOMAIN}.`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">
              Verified Subscriber Directory ({filtered.length})
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#07090f] border border-white/10 rounded-xl px-3 py-1.5">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter email..."
                  className="bg-transparent text-xs text-white focus:outline-none"
                />
              </div>
              <button
                onClick={exportSubscribersCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleAddSubscriber} className="flex gap-2">
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Add subscriber email (e.g. researcher@mit.edu)..."
              className="flex-1 bg-[#07090f] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-electric text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subscriber</span>
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono uppercase">
                  <th className="py-3 pr-3">Subscriber Email</th>
                  <th className="py-3 px-3">Channel</th>
                  <th className="py-3 px-3">Joined</th>
                  <th className="py-3 pl-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 pr-3 font-mono text-white">{s.email}</td>
                    <td className="py-3 px-3 text-slate-300">{s.channel}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{s.joinedAt}</td>
                    <td className="py-3 pl-3 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-[10px]">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-5 glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Embeddable HTML5 Signup Snippet
            </h2>
            <button
              onClick={copyEmbedCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-200 text-xs font-mono"
            >
              {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEmbed ? "Copied" : "Copy HTML"}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Paste this standalone HTML snippet into any custom <code className="text-indigo-300">index.html</code> page to capture subscribers directly into your MyfaPost CRM.
          </p>
          <pre className="p-4 rounded-xl bg-[#05070c] border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto">
            {embedSnippet}
          </pre>
        </div>
      </div>
    </CreatorShell>
  );
}
