"use client";

import React from "react";
import { ShieldCheck, Lock, FileCode, AlertOctagon } from "lucide-react";
import { ROOT_DOMAIN, RESERVED_SUBDOMAINS } from "@/lib/constants";

export default function SecurityModelPage() {
  return (
    <main className="min-h-screen obsidian-radial-bg py-14 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            PRIVACY SHIELD &amp; MULTI-TENANT ISOLATION
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Origin Sandboxing &amp; Firestore Ownership Rules
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-3xl">
            How MyfaPost Creator OS isolates untrusted tenant HTML5/JS pages from the control-plane authentication session and enforces strict UID document ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-400" />
              <span>Host-Only Authentication Scope</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Firebase Authentication tokens are stored strictly inside IndexedDB on the apex <code className="font-mono text-indigo-300">{ROOT_DOMAIN}</code> origin. No wildcard <code className="font-mono text-rose-300">Domain=.{ROOT_DOMAIN}</code> cookies are ever issued, ensuring tenant scripts on <code className="font-mono text-emerald-300">*.{ROOT_DOMAIN}</code> have zero access to creator credentials.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Per-Subdomain Browser SOP Sandbox</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Under the browser Same-Origin Policy (SOP), <code className="font-mono text-emerald-300">hacker.{ROOT_DOMAIN}</code> and <code className="font-mono text-indigo-300">cyberpulse.{ROOT_DOMAIN}</code> are distinct security origins. Custom JavaScript inside a user&apos;s <code className="font-mono">index.html</code> is completely sandboxed to its own subdomain.
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">
            Reserved System Namespace Registry ({RESERVED_SUBDOMAINS.length} Protected Handles)
          </h2>
          <p className="text-xs text-slate-400">
            The following system handles are blocked at both the Next.js Edge Middleware layer and inside <code className="font-mono text-indigo-300">firestore.rules</code>:
          </p>
          <div className="flex flex-wrap gap-2">
            {RESERVED_SUBDOMAINS.map((name) => (
              <span
                key={name}
                className="px-2.5 py-1 rounded-lg bg-[#07090f] border border-white/10 font-mono text-xs text-slate-300"
              >
                {name}.{ROOT_DOMAIN}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
