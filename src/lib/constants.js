export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "myfa.page";

export const MAX_HTML_BYTES = 921600;

export const RESERVED_SUBDOMAINS = [
  "www",
  "app",
  "api",
  "admin",
  "dashboard",
  "auth",
  "login",
  "signup",
  "manage",
  "posts",
  "lessons",
  "templates",
  "audience",
  "analytics",
  "showcase",
  "status",
  "whitepaper",
  "security",
  "changelog",
  "mail",
  "smtp",
  "ftp",
  "cdn",
  "assets",
  "static",
  "root",
  "system",
  "support",
  "help",
  "billing",
  "vercel",
  "firebase",
  "myfa",
  "myfapost"
];

export const PUBLICATION_CATEGORIES = [
  { id: "Tech & AI", label: "Tech & AI", badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  { id: "Security & Hacking", label: "Security & Hacking", badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { id: "Gaming", label: "Gaming", badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  { id: "Finance & Crypto", label: "Finance & Crypto", badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { id: "Culture", label: "Culture", badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  { id: "Design", label: "Design", badgeClass: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" }
];

export const PLATFORM_TELEMETRY = [
  { label: "Active Subdomains", value: "14,200+", delta: "+18.4% MoM", detail: "Wildcard *.myfa.page nodes" },
  { label: "Median Edge TTFB", value: "0.18s", delta: "Global HTTP/3", detail: "Stale-while-revalidate cache" },
  { label: "Global Edge PoPs", value: "340", delta: "6 Continents", detail: "Zero cold-start static routing" },
  { label: "Monthly Readers", value: "42.8M", delta: "+31.2% YoY", detail: "Verified organic dispatches" },
  { label: "Network Uptime", value: "99.99%", delta: "SLA Verified", detail: "Multi-region failover active" },
  { label: "Infrastructure Cost", value: "$0", delta: "Free Forever", detail: "Vercel Hobby + Firebase Spark" }
];

export const INITIAL_DEMO_SUBDOMAINS = [
  {
    subdomain: "cyberpulse",
    displayName: "CyberPulse Dispatch",
    authorName: "Alex Rivera",
    authorRole: "Principal Systems Architect",
    bio: "Deep technical dispatches on micro-kernels, WebAssembly on the edge, zero-trust security, and sovereign web infrastructure.",
    category: "Tech & AI",
    accentColor: "#6366f1",
    userId: "demo-user-alex",
    subscribersCount: 4820,
    totalViews: 128450,
    createdAt: "2026-08-12T09:00:00.000Z"
  },
  {
    subdomain: "hacker",
    displayName: "RootShell Research Lab",
    authorName: "Kaelen Vance",
    authorRole: "Offensive Security Lead",
    bio: "Binary exploitation writeups, red-team telemetry, kernel memory mitigation bypasses, and standalone HTML security advisories.",
    category: "Security & Hacking",
    accentColor: "#10b981",
    userId: "demo-user-kaelen",
    subscribersCount: 9340,
    totalViews: 312900,
    createdAt: "2026-07-04T14:20:00.000Z"
  },
  {
    subdomain: "tech-radar",
    displayName: "TechRadar Dispatch",
    authorName: "Elena Rostova",
    authorRole: "Silicon & AI Columnist",
    bio: "Weekly synthesis of frontier AI architectures, spatial memory frameworks, and next-gen compute hardware.",
    category: "Tech & AI",
    accentColor: "#8b5cf6",
    userId: "demo-user-elena",
    subscribersCount: 1840,
    totalViews: 64200,
    createdAt: "2026-09-01T11:15:00.000Z"
  },
  {
    subdomain: "gamepulse",
    displayName: "GamePulse Tactical Hub",
    authorName: "Marcus Sterling",
    authorRole: "Esports Meta Analyst",
    bio: "Frame-data breakdowns, competitive patch notes, tournament telemetry, and engine optimization guides.",
    category: "Gaming",
    accentColor: "#ec4899",
    userId: "demo-user-marcus",
    subscribersCount: 6190,
    totalViews: 194300,
    createdAt: "2026-09-18T16:40:00.000Z"
  },
  {
    subdomain: "crypto-ledger",
    displayName: "Crypto Ledger Insights",
    authorName: "Sora Takahashi",
    authorRole: "Protocol Economist",
    bio: "Zero-knowledge proof benchmarks, L2 sequencer economics, institutional liquidity flows, and verifiable on-chain research.",
    category: "Finance & Crypto",
    accentColor: "#f59e0b",
    userId: "demo-user-sora",
    subscribersCount: 5410,
    totalViews: 158700,
    createdAt: "2026-10-02T08:10:00.000Z"
  },
  {
    subdomain: "designcraft",
    displayName: "Obsidian Interface Studio",
    authorName: "Nadia Lindqvist",
    authorRole: "Staff Design Engineer",
    bio: "Fluid darkmode design systems, micro-interaction physics, glassmorphic shader craft, and typographic engineering.",
    category: "Design",
    accentColor: "#06b6d4",
    userId: "demo-user-nadia",
    subscribersCount: 3720,
    totalViews: 97400,
    createdAt: "2026-10-19T13:50:00.000Z"
  }
];
