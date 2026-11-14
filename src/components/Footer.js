"use client";

import React from "react";
import Link from "next/link";
import { Terminal, Shield, Globe, Cpu, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { ROOT_DOMAIN } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#05070c] border-t border-white/10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl btn-electric flex items-center justify-center">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">MyfaPost Creator OS</span>
                <span className="ml-2 font-mono text-xs text-indigo-400">{ROOT_DOMAIN}</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              The 100% free-forever wildcard subdomain publishing platform engineered on GitHub, Vercel Edge Middleware, and Cloud Firestore Spark. Claim your sovereign handle and deploy standalone HTML5 dispatches globally in seconds.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All 340 Global Edge PoPs Operational (99.99% SLA)</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white mb-4">
              Creator Workspace
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/dashboard" className="hover:text-white transition">Creator OS Dashboard</Link></li>
              <li><Link href="/posts" className="hover:text-white transition">My Posts &amp; Inventory</Link></li>
              <li><Link href="/posts/new" className="hover:text-white transition">Studio Editor (New Post)</Link></li>
              <li><Link href="/posts/webassembly-cloudflare-edge/edit" className="hover:text-white transition">Edit Existing Post</Link></li>
              <li><Link href="/manage" className="hover:text-white transition">Manage Subdomain &amp; DNS</Link></li>
              <li><Link href="/audience" className="hover:text-white transition">Audience &amp; Subscriber CRM</Link></li>
              <li><Link href="/analytics" className="hover:text-white transition">Deep Edge Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white mb-4">
              Resources &amp; Studio
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/templates" className="hover:text-white transition">HTML5 Starter Templates</Link></li>
              <li><Link href="/lessons" className="hover:text-white transition">Creator Academy (8 Lessons)</Link></li>
              <li><Link href="/showcase" className="hover:text-white transition">Global Subdomain Showcase</Link></li>
              <li><Link href="/whitepaper" className="hover:text-white transition">Architecture Whitepaper</Link></li>
              <li><Link href="/security" className="hover:text-white transition">Privacy Shield &amp; Security</Link></li>
              <li><Link href="/status" className="hover:text-white transition">Global Edge Network Status</Link></li>
              <li><Link href="/changelog" className="hover:text-white transition">Release Notes &amp; Roadmap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white mb-4">
              Live Edge Nodes
            </h4>
            <ul className="space-y-2.5 text-sm font-mono">
              <li>
                <Link href="/?preview_sub=cyberpulse" className="text-indigo-300 hover:text-white flex items-center gap-1">
                  <span>cyberpulse.{ROOT_DOMAIN}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/?preview_sub=hacker&preview_slug=top-hack-now" className="text-emerald-300 hover:text-white flex items-center gap-1">
                  <span>hacker.{ROOT_DOMAIN}/top-hack-now</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/?preview_sub=tech-radar" className="text-purple-300 hover:text-white flex items-center gap-1">
                  <span>tech-radar.{ROOT_DOMAIN}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/?preview_sub=gamepulse" className="text-pink-300 hover:text-white flex items-center gap-1">
                  <span>gamepulse.{ROOT_DOMAIN}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-slate-300 hover:text-white">
                  + Claim Your Subdomain
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} MyfaPost Creator OS ({ROOT_DOMAIN}). Engineered for Sovereign Publishers.
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span>Zero VPS</span>
            <span>•</span>
            <span>Zero cPanel</span>
            <span>•</span>
            <span>Firestore O(1) Edge Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
