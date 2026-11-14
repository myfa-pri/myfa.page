export const STARTER_TEMPLATES = [
  {
    id: "cyberpulse-dispatch",
    name: "CyberPulse Tech Dispatch",
    category: "Tech & AI",
    recommendedSlug: "silicon-super-cycle-edge-kernels",
    sizeKb: "14.2 KB",
    description: "Flagship dark-glassmorphic technical deep dive with architecture telemetry cards, benchmark tables, and syntax-styled code blocks.",
    tags: ["Tech", "EdgeCompute", "Architecture"],
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Next Silicon Super-Cycle: Micro-Kernels Rebuilding Edge Compute | CyberPulse Dispatch</title>
  <meta name="description" content="How deterministic single-file edge payloads and zero-cold-start micro-kernels are replacing legacy container orchestration across 340 global PoPs." />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    body { background:#07090f; color:#f8fafc; font-family:'Plus Jakarta Sans',sans-serif; margin:0; line-height:1.75; }
    .wrap { max-width:840px; margin:0 auto; padding:3.5rem 1.5rem; }
    .badge { display:inline-block; background:rgba(99,102,241,0.16); color:#a5b4fc; border:1px solid rgba(99,102,241,0.35); padding:0.25rem 0.75rem; border-radius:999px; font-size:0.75rem; font-weight:700; text-transform:uppercase; }
    h1 { font-size:2.6rem; line-height:1.15; margin:1rem 0; font-weight:800; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:1rem; margin:2rem 0; }
    .card { background:#0d111c; border:1px solid rgba(255,255,255,0.08); padding:1.25rem; border-radius:14px; }
    .card strong { display:block; font-size:1.5rem; color:#10b981; font-family:'JetBrains Mono',monospace; }
    pre { background:#05070c; border:1px solid rgba(255,255,255,0.08); padding:1.25rem; border-radius:12px; overflow-x:auto; font-family:'JetBrains Mono',monospace; font-size:0.85rem; color:#cbd5e1; }
    p { color:#cbd5e1; font-size:1.05rem; margin-bottom:1.25rem; }
  </style>
</head>
<body>
  <div class="wrap">
    <span class="badge">Tech &amp; AI · Architecture Dispatch</span>
    <h1>The Next Silicon Super-Cycle: Micro-Kernels Rebuilding Edge Compute</h1>
    <p>Modern content and compute delivery no longer require heavyweight virtual machines. By pairing wildcard DNS host inspection with deterministic O(1) document lookups, edge nodes deliver complete HTML5 applications in under 180 milliseconds worldwide.</p>
    <div class="grid">
      <div class="card"><strong>0.18s</strong><span>Median Global TTFB</span></div>
      <div class="card"><strong>340+</strong><span>Anycast Edge PoPs</span></div>
      <div class="card"><strong>99.4%</strong><span>Edge Cache Hit Ratio</span></div>
    </div>
    <h2>Deterministic O(1) Key Resolution</h2>
    <p>Instead of executing multi-index relational joins on every HTTP request, our edge runtime constructs a composite primary key from the incoming host header and pathname slug:</p>
    <pre>const docId = \`\${subdomain}__\${slug || "index"}\`;
const snapshot = await getDoc(doc(db, "posts", docId));</pre>
    <p>This guarantees constant-time latency whether a publication serves ten readers or ten million concurrent requests.</p>
  </div>
</body>
</html>`
  },
  {
    id: "rootshell-security-advisory",
    name: "RootShell Security Advisory",
    category: "Security & Hacking",
    recommendedSlug: "top-hack-now",
    sizeKb: "15.8 KB",
    description: "Terminal-grade offensive security advisory layout designed for CVE disclosures, memory corruption writeups, and packet captures.",
    tags: ["Security", "ZeroTrust", "Advisory"],
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Zero-Click Subdomain Isolation &amp; Origin Sandboxing | RootShell Research Lab</title>
  <meta name="description" content="Technical breakdown of Public Suffix List boundaries, Same-Origin Policy enforcement, and host-only session cookies across wildcard multi-tenant platforms." />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    body { background:#05080d; color:#e2e8f0; font-family:'Plus Jakarta Sans',sans-serif; margin:0; line-height:1.75; }
    .wrap { max-width:860px; margin:0 auto; padding:3.5rem 1.5rem; }
    .alert { background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.35); color:#6ee7b7; padding:0.9rem 1.2rem; border-radius:12px; font-family:'JetBrains Mono',monospace; font-size:0.82rem; margin-bottom:1.5rem; }
    h1 { font-size:2.4rem; color:#fff; margin:0.5rem 0 1rem; }
    table { width:100%; border-collapse:collapse; margin:2rem 0; background:#0d111c; border-radius:12px; overflow:hidden; }
    th, td { padding:0.9rem 1rem; border-bottom:1px solid rgba(255,255,255,0.08); text-align:left; font-size:0.9rem; }
    th { color:#10b981; font-family:'JetBrains Mono',monospace; background:rgba(16,185,129,0.06); }
    pre { background:#020408; border:1px solid rgba(16,185,129,0.28); padding:1.2rem; border-radius:10px; font-family:'JetBrains Mono',monospace; color:#a7f3d0; overflow-x:auto; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="alert">[ADVISORY ID: MYFA-SEC-2026-09] · STATUS: VERIFIED ISOLATION · TENANT ORIGIN: *.myfa.page</div>
    <h1>Zero-Click Subdomain Isolation &amp; Origin Sandboxing</h1>
    <p>When untrusted creators publish raw HTML5 and JavaScript documents, strict browser Same-Origin Policy (SOP) isolation between tenants is mandatory. Because each tenant runs on its own distinct subdomain origin, browser security engines automatically block cross-tenant DOM, IndexedDB, and localStorage access.</p>
    <table>
      <thead>
        <tr><th>Security Vector</th><th>Apex Host (myfa.page)</th><th>Tenant Node (*.myfa.page)</th></tr>
      </thead>
      <tbody>
        <tr><td>Firebase Auth Token Scope</td><td>Host-Only IndexedDB</td><td>Zero Auth Credential Access</td></tr>
        <tr><td>Same-Origin Policy Boundary</td><td>Isolated Control Plane</td><td>Per-Subdomain Origin Sandbox</td></tr>
        <tr><td>Firestore Write Guard</td><td>UID Ownership Enforced</td><td>Read-Only Edge Delivery</td></tr>
      </tbody>
    </table>
    <pre>Host: hacker.myfa.page
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Cache-Control: public, s-maxage=60, stale-while-revalidate=300</pre>
  </div>
</body>
</html>`
  },
  {
    id: "editorial-serif-longform",
    name: "Editorial Essay & Synthesis",
    category: "Culture",
    recommendedSlug: "spatial-memory-frameworks",
    sizeKb: "12.9 KB",
    description: "High-contrast longform reading experience crafted for deep essays, research syntheses, and investigative journalism.",
    tags: ["Essay", "AI", "Research"],
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Beyond Transformer Archetypes: Spatial Memory Frameworks | TechRadar Dispatch</title>
  <meta name="description" content="Why episodic state graphs and persistent associative memory layers are superseding fixed-window token attention." />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    body { background:#07090f; color:#f1f5f9; font-family:'Plus Jakarta Sans',sans-serif; margin:0; line-height:1.85; }
    .container { max-width:720px; margin:0 auto; padding:4rem 1.5rem; }
    .kicker { color:#818cf8; text-transform:uppercase; letter-spacing:0.12em; font-size:0.78rem; font-weight:700; }
    h1 { font-size:2.75rem; line-height:1.15; margin:0.75rem 0 1.25rem; }
    blockquote { border-left:3px solid #8b5cf6; padding:1rem 1.5rem; background:#0d111c; border-radius:0 12px 12px 0; margin:2rem 0; color:#e2e8f0; font-size:1.1rem; }
    p { color:#cbd5e1; font-size:1.08rem; margin-bottom:1.4rem; }
  </style>
</head>
<body>
  <main class="container">
    <div class="kicker">Frontier Research Monograph · Issue #42</div>
    <h1>Beyond Transformer Archetypes: Spatial Memory Frameworks</h1>
    <p>For half a decade, sequence modeling treated intelligence as a flat sliding window of tokens. Yet biological reasoning relies on hierarchical spatial indexing—compressing experiences into addressable state graphs rather than re-reading an entire transcript on every thought.</p>
    <blockquote>"Sovereign technical writing deserves an architecture as durable and fast as the ideas it documents." — Elena Rostova</blockquote>
    <p>By publishing standalone HTML documents directly to edge-cached subdomains, independent researchers preserve interactive visualizations, equations, and benchmarks without platform lock-in.</p>
  </main>
</body>
</html>`
  },
  {
    id: "saas-launch-landing",
    name: "SaaS & Protocol Launch Landing",
    category: "Finance & Crypto",
    recommendedSlug: "protocol-v3-launch",
    sizeKb: "16.4 KB",
    description: "Conversion-engineered product launch page with feature bento grid, pricing comparison tier cards, and interactive CTA.",
    tags: ["Launch", "SaaS", "Protocol"],
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hyperion L3 Sequencer — Sub-Millisecond Verifiable Rollups</title>
  <meta name="description" content="Zero-knowledge state proofs with instant finality and $0 gas overhead for high-frequency decentralized applications." />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    body { background:#07090f; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; margin:0; }
    .hero { max-width:960px; margin:0 auto; padding:4.5rem 1.5rem; text-align:center; }
    h1 { font-size:3rem; font-weight:800; margin:1rem 0; background:linear-gradient(135deg,#fff,#a5b4fc); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:1.25rem; margin-top:3rem; text-align:left; }
    .card { background:#0d111c; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:1.5rem; }
    .btn { display:inline-block; margin-top:1.5rem; padding:0.9rem 1.8rem; border-radius:12px; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; text-decoration:none; font-weight:700; }
  </style>
</head>
<body>
  <section class="hero">
    <p style="font-family:'JetBrains Mono',monospace;color:#10b981;font-size:0.85rem;">MAINNET EPOCH 14 LIVE</p>
    <h1>Verifiable Compute at Global Edge Speed</h1>
    <p style="color:#94a3b8;max-width:640px;margin:0 auto;">Deploy standalone zero-knowledge state channels with deterministic verification across 340 global edge locations.</p>
    <a class="btn" href="#specs">Explore Technical Specification</a>
    <div id="specs" class="cards">
      <div class="card"><h3>42,000 TPS</h3><p style="color:#94a3b8;font-size:0.92rem;">Parallelized state transition prover with deterministic memory bounds.</p></div>
      <div class="card"><h3>0.18s Finality</h3><p style="color:#94a3b8;font-size:0.92rem;">Instant soft-confirmations backed by recursive SNARK aggregation.</p></div>
      <div class="card"><h3>100% Open Spec</h3><p style="color:#94a3b8;font-size:0.92rem;">Audited standalone verification scripts published directly on-chain.</p></div>
    </div>
  </section>
</body>
</html>`
  },
  {
    id: "esports-patch-notes-hub",
    name: "Esports & Patch Notes Hub",
    category: "Gaming",
    recommendedSlug: "patch-7-4-meta-breakdown",
    sizeKb: "15.1 KB",
    description: "High-energy gaming tactical breakdown featuring weapon/unit stat delta bars, tier matrices, and tournament meta telemetry.",
    tags: ["Gaming", "Esports", "PatchNotes"],
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Patch 7.4 Competitive Meta Synthesis &amp; Frame Telemetry | GamePulse</title>
  <meta name="description" content="Complete weapon balance deltas, counter-tactic formations, and tournament pick-rate analytics." />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    body { background:#07090f; color:#f8fafc; font-family:'Plus Jakarta Sans',sans-serif; margin:0; }
    .wrap { max-width:880px; margin:0 auto; padding:3.5rem 1.5rem; }
    .stat-box { background:#0d111c; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:1.25rem; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center; }
    .buff { color:#10b981; font-family:'JetBrains Mono',monospace; font-weight:700; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1 style="font-size:2.5rem;margin-bottom:0.5rem;">Patch 7.4 Competitive Meta Synthesis</h1>
    <p style="color:#94a3b8;margin-bottom:2rem;">Updated frame-data telemetry and formation win-rates across Grandmaster tournament lobbies.</p>
    <div class="stat-box"><div><strong>Quick Counter Transition Velocity</strong><div style="color:#94a3b8;font-size:0.88rem;">Forward sprint acceleration increased by 6.5% during possession turnovers.</div></div><span class="buff">+6.5% BUFF</span></div>
    <div class="stat-box"><div><strong>Long-Range Precision Calibrator</strong><div style="color:#94a3b8;font-size:0.88rem;">First-shot accuracy window expanded from 140ms to 175ms.</div></div><span class="buff">+35ms WINDOW</span></div>
  </div>
</body>
</html>`
  },
  {
    id: "creator-bio-subdomain-portal",
    name: "Creator Root Homepage (slug: index)",
    category: "Design",
    recommendedSlug: "index",
    sizeKb: "16.0 KB",
    description: "Designed specifically for the reserved `index` slug so visiting `https://yourname.myfa.page` renders a custom sovereign homepage.",
    tags: ["Homepage", "IndexSlug", "Portfolio"],
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sovereign Creator Portal — Powered by MyfaPost Edge</title>
  <meta name="description" content="Official root index.html portal served directly at the subdomain apex." />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    body { background:#07090f; color:#f8fafc; font-family:'Plus Jakarta Sans',sans-serif; margin:0; }
    .wrap { max-width:820px; margin:0 auto; padding:4rem 1.5rem; }
    .hero-card { background:linear-gradient(135deg,#0d111c,#131929); border:1px solid rgba(99,102,241,0.35); border-radius:20px; padding:2.5rem; }
    .pill { font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:#10b981; background:rgba(16,185,129,0.12); padding:0.3rem 0.75rem; border-radius:999px; display:inline-block; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hero-card">
      <span class="pill">ROOT APEX OVERRIDE ACTIVE (slug: index)</span>
      <h1 style="font-size:2.5rem;margin:1rem 0;">Welcome to My Sovereign Subdomain</h1>
      <p style="color:#94a3b8;font-size:1.05rem;">Because this post uses the canonical slug <code>index</code>, MyfaPost Edge Middleware serves this custom HTML5 document directly at the root of the subdomain.</p>
    </div>
  </div>
</body>
</html>`
  }
];
