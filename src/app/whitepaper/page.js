"use client";

import React from "react";
import Link from "next/link";
import { Cpu, Layers, Database, Globe, ArrowRight } from "lucide-react";
import { ROOT_DOMAIN } from "@/lib/constants";

export default function ArchitectureWhitepaperPage() {
  return (
    <main className="min-h-screen obsidian-radial-bg py-14 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-widest text-indigo-400">
            TECHNICAL ARCHITECTURE MONOGRAPH · REV 3.4
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Zero-VPS Multi-Tenant Wildcard Subdomain Publishing on Serverless Edge Infrastructure
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            How MyfaPost Creator OS achieves sub-200ms global HTML5 delivery across unlimited *.{ROOT_DOMAIN} subdomains at $0.00 marginal infrastructure cost.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">
            1. Host-Header Inspection &amp; Internal Edge Rewriting
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Instead of provisioning virtual private servers or reloading Nginx virtual hosts when a user claims a new subdomain, MyfaPost points a single wildcard DNS record (<code className="font-mono text-emerald-300">*.{ROOT_DOMAIN} CNAME cname.vercel-dns.com</code>) to Vercel&apos;s Anycast Edge network. On every incoming request, <code className="font-mono text-indigo-300">src/middleware.js</code> parses the <code className="font-mono text-indigo-300">Host</code> header and executes an internal URL rewrite to <code className="font-mono text-emerald-300">/sites/[subdomain]/[slug]</code>.
          </p>
          <pre className="p-4 rounded-xl bg-[#05070c] border border-white/10 font-mono text-xs text-indigo-200 overflow-x-auto">
{`Incoming Request: https://hacker.myfa.page/top-hack-now
Edge Middleware Rewrite: /sites/hacker/top-hack-now
Firestore Composite Key: posts/hacker__top-hack-now`}
          </pre>

          <h2 className="text-xl font-bold text-white">
            2. Deterministic O(1) Document Schema on Firebase Spark
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Firebase Cloud Storage requires upgrading to a paid Blaze billing plan. To keep the platform 100% free forever on the Firebase Spark tier, MyfaPost stores the complete compiled <code className="font-mono text-emerald-300">index.html</code> payload (validated up to 900 KB) directly inside Cloud Firestore collection <code className="font-mono text-indigo-300">posts/&#123;subdomain&#125;__&#123;slug&#125;</code>. Because the document ID is deterministic, edge route handlers retrieve any article in a single <code className="font-mono text-indigo-300">O(1)</code> primary-key lookup without secondary index scans.
          </p>

          <h2 className="text-xl font-bold text-white">
            3. Edge Cache Amplification Mathematics (`stale-while-revalidate`)
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Each tenant route handler emits <code className="font-mono text-emerald-300">Cache-Control: public, s-maxage=60, stale-while-revalidate=300</code>. When a dispatch experiences a viral traffic spike, Vercel&apos;s edge PoPs serve cached HTML responses directly from memory for 60 seconds, collapsing tens of thousands of reader requests into a single background Firestore read per minute.
          </p>
        </div>
      </div>
    </main>
  );
}
