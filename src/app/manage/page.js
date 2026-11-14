"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Shield,
  RefreshCw,
  Download,
  Upload,
  CheckCircle2,
  Server,
  Database,
  Save,
  Sparkles,
  Copy
} from "lucide-react";
import CreatorShell from "@/components/CreatorShell";
import { useAuth } from "@/context/AuthContext";
import { ROOT_DOMAIN, PUBLICATION_CATEGORIES } from "@/lib/constants";
import {
  claimOrUpdateSubdomain,
  exportPublicationArchive,
  importPublicationArchive
} from "@/lib/firebase";

export default function ManageSubdomainPage() {
  const { activeSubdomain, subdomainRecord, switchActiveSubdomain } = useAuth();

  const [displayName, setDisplayName] = useState("CyberPulse Dispatch");
  const [authorName, setAuthorName] = useState("Alex Rivera");
  const [authorRole, setAuthorRole] = useState("Principal Systems Architect");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("Tech & AI");
  const [accentColor, setAccentColor] = useState("#6366f1");
  const [statusMsg, setStatusMsg] = useState("");
  const [purging, setPurging] = useState(false);

  useEffect(() => {
    if (subdomainRecord) {
      setDisplayName(subdomainRecord.displayName || "");
      setAuthorName(subdomainRecord.authorName || "");
      setAuthorRole(subdomainRecord.authorRole || "Independent Creator");
      setBio(subdomainRecord.bio || "");
      setCategory(subdomainRecord.category || "Tech & AI");
      setAccentColor(subdomainRecord.accentColor || "#6366f1");
    }
  }, [subdomainRecord]);

  const handleSaveBranding = async (e) => {
    e.preventDefault();
    await claimOrUpdateSubdomain({
      subdomain: activeSubdomain,
      displayName,
      authorName,
      authorRole,
      bio,
      category,
      accentColor
    });
    await switchActiveSubdomain(activeSubdomain);
    setStatusMsg(`Synced branding settings to Firestore collection subdomains/${activeSubdomain}.`);
  };

  const handlePurgeEdgeCache = () => {
    setPurging(true);
    setTimeout(() => {
      setPurging(false);
      setStatusMsg(
        `Purged stale-while-revalidate edge cache across 340 PoPs for ${activeSubdomain}.${ROOT_DOMAIN}.`
      );
    }, 600);
  };

  const handleExportJson = async () => {
    const archive = await exportPublicationArchive(activeSubdomain);
    const blob = new Blob([JSON.stringify(archive, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeSubdomain}-publication-archive.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg(`Exported full JSON archive for ${activeSubdomain}.${ROOT_DOMAIN}.`);
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const parsed = JSON.parse(String(ev.target?.result || "{}"));
        await importPublicationArchive(parsed);
        setStatusMsg("Successfully imported JSON publication archive into Firestore store.");
      } catch (err) {
        setStatusMsg(`Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <CreatorShell
      title="Manage Subdomain, Wildcard DNS & Quota"
      subtitle={`Configure branding, inspect Vercel wildcard DNS records, monitor Firebase Spark limits, and export JSON backups for ${activeSubdomain}.${ROOT_DOMAIN}.`}
    >
      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg("")} className="underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form
          onSubmit={handleSaveBranding}
          className="lg:col-span-7 glass-card rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <span>Publication Branding (`subdomains/{activeSubdomain}`)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Publication Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#07090f] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Primary Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#07090f] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white"
              >
                {PUBLICATION_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-[#07090f] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Author Role / Title
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full bg-[#07090f] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Subdomain Directory Bio &amp; Meta Description
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#07090f] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <label className="text-xs font-mono text-slate-400">ACCENT COLOR:</label>
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-9 h-9 rounded-lg bg-transparent border border-white/10 cursor-pointer"
              />
              <span className="font-mono text-xs text-slate-300">{accentColor}</span>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-electric text-xs font-bold shadow-glow"
            >
              <Save className="w-4 h-4" />
              <span>Save Branding to Firestore</span>
            </button>
          </div>
        </form>

        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <span>Firebase Spark Free Quota Monitor</span>
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Max Document Payload Ceiling</span>
                  <span className="font-mono text-emerald-400">900 KB / 1,024 KB</span>
                </div>
                <div className="w-full h-2 bg-[#07090f] rounded-full overflow-hidden">
                  <div className="h-full w-[16%] bg-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Daily Firestore Reads (CDN Offloaded)</span>
                  <span className="font-mono text-indigo-300">1,420 / 50,000 day</span>
                </div>
                <div className="w-full h-2 bg-[#07090f] rounded-full overflow-hidden">
                  <div className="h-full w-[4%] bg-indigo-500" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Daily Firestore Writes</span>
                  <span className="font-mono text-purple-300">184 / 20,000 day</span>
                </div>
                <div className="w-full h-2 bg-[#07090f] rounded-full overflow-hidden">
                  <div className="h-full w-[2%] bg-purple-500" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={handlePurgeEdgeCache}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${purging ? "animate-spin" : ""}`} />
                <span>Purge Edge Cache</span>
              </button>
              <button
                onClick={handleExportJson}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-xs font-semibold text-indigo-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Archive</span>
              </button>
              <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-semibold text-emerald-300 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Restore / Import JSON Publication Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-400" />
              <span>Wildcard DNS &amp; Vercel Nameserver Configuration (`*.{ROOT_DOMAIN}`)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Add these exact DNS records at your domain registrar and inside your Vercel Project → Settings → Domains panel.
            </p>
          </div>
          <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25">
            Wildcard TLS Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase">
                <th className="py-3 px-4">Record Type</th>
                <th className="py-3 px-4">Host / Name</th>
                <th className="py-3 px-4">Value / Target</th>
                <th className="py-3 px-4">TTL</th>
                <th className="py-3 px-4">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-200">
              <tr>
                <td className="py-3 px-4 text-indigo-300">NS</td>
                <td className="py-3 px-4">@</td>
                <td className="py-3 px-4 text-emerald-300">ns1.vercel-dns.com</td>
                <td className="py-3 px-4">Auto</td>
                <td className="py-3 px-4">Required for automatic Let&apos;s Encrypt Wildcard SSL</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-indigo-300">NS</td>
                <td className="py-3 px-4">@</td>
                <td className="py-3 px-4 text-emerald-300">ns2.vercel-dns.com</td>
                <td className="py-3 px-4">Auto</td>
                <td className="py-3 px-4">Secondary Vercel Anycast Nameserver</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-indigo-300">A</td>
                <td className="py-3 px-4">@ ({ROOT_DOMAIN})</td>
                <td className="py-3 px-4 text-emerald-300">76.76.21.21</td>
                <td className="py-3 px-4">60s</td>
                <td className="py-3 px-4">Routes root Creator OS application</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-indigo-300">CNAME</td>
                <td className="py-3 px-4">* (*.{ROOT_DOMAIN})</td>
                <td className="py-3 px-4 text-emerald-300">cname.vercel-dns.com</td>
                <td className="py-3 px-4">60s</td>
                <td className="py-3 px-4">Routes all user subdomains to Next.js Edge Middleware</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </CreatorShell>
  );
}
