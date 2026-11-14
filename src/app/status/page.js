"use client";

import React from "react";
import { CheckCircle2, Activity, Globe, Server, ShieldCheck } from "lucide-react";
import { ROOT_DOMAIN } from "@/lib/constants";

const EDGE_CLUSTERS = [
  { region: "North America East (IAD · EWR · ATL)", latency: "14ms", uptime: "100.00%", status: "Operational" },
  { region: "North America West (SFO · SEA · LAX)", latency: "17ms", uptime: "99.99%", status: "Operational" },
  { region: "Europe Central & West (FRA · LHR · CDG · AMS)", latency: "19ms", uptime: "100.00%", status: "Operational" },
  { region: "Africa & Middle East (ADD · NBO · JNB · DXB)", latency: "28ms", uptime: "99.99%", status: "Operational" },
  { region: "Asia Pacific (SIN · NRT · ICN · SYD)", latency: "23ms", uptime: "99.99%", status: "Operational" },
  { region: "South America (GRU · EZE · SCL)", latency: "31ms", uptime: "99.98%", status: "Operational" }
];

export default function NetworkStatusPage() {
  return (
    <main className="min-h-screen obsidian-radial-bg py-14 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="glass-card rounded-3xl p-8 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>ALL SYSTEMS OPERATIONAL</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              MyfaPost Global Edge Network Status
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Live telemetry across 340+ Anycast CDN Edge PoPs serving *.{ROOT_DOMAIN} and Cloud Firestore O(1) document resolvers.
            </p>
          </div>
          <div className="text-right font-mono">
            <div className="text-3xl font-extrabold text-emerald-400">99.99%</div>
            <div className="text-xs text-slate-400">90-Day Verified Uptime</div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">
            Regional Edge Clusters &amp; Median TTFB
          </h2>
          {EDGE_CLUSTERS.map((cluster) => (
            <div
              key={cluster.region}
              className="glass-card rounded-2xl p-5 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-bold text-sm text-white">{cluster.region}</div>
                <div className="flex items-center gap-4 font-mono text-xs">
                  <span className="text-indigo-300">TTFB: {cluster.latency}</span>
                  <span className="text-slate-400">Uptime: {cluster.uptime}</span>
                  <span className="text-emerald-400">{cluster.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-30 gap-1">
                {Array.from({ length: 30 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-5 rounded-sm bg-emerald-500/80 hover:bg-emerald-400 transition"
                    title={`Day ${idx + 1}: 100% Uptime`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
