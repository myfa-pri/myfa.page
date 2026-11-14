import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import {
  RESERVED_SUBDOMAINS,
  INITIAL_DEMO_SUBDOMAINS,
  MAX_HTML_BYTES
} from "./constants";
import { compileStandaloneHtmlDocument } from "./htmlCompiler";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "AIzaSyYourFirebasePublicApiKeyHere" &&
    firebaseConfig.projectId
);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let githubProvider = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    githubProvider = new GithubAuthProvider();
  } catch (err) {
    app = null;
    auth = null;
    db = null;
  }
}

export { app, auth, db, googleProvider, githubProvider };

const SEED_POSTS = [
  {
    id: "cyberpulse__webassembly-cloudflare-edge",
    subdomain: "cyberpulse",
    slug: "webassembly-cloudflare-edge",
    title: "WebAssembly on the Edge: Sub-Millisecond Cold Starts at Global Scale",
    excerpt: "Benchmarking V8 isolates and WASI micro-kernels against containerized microservices across 340 global edge locations.",
    category: "Tech & AI",
    tags: ["WebAssembly", "EdgeCompute", "Architecture"],
    status: "published",
    views: 48290,
    claps: 1940,
    readRatio: "84%",
    readTime: "6 min read",
    userId: "demo-user-alex",
    authorName: "Alex Rivera",
    publishedAt: "2026-11-10T14:20:00.000Z",
    updatedAt: "2026-11-12T09:15:00.000Z",
    editorMode: "markdown",
    markdownBody: `# WebAssembly on the Edge: Sub-Millisecond Cold Starts at Global Scale

Modern distributed publications and edge APIs cannot afford 800ms container cold starts. By compiling core workloads into standalone payloads and serving deterministic HTML5 documents from edge memory, latency drops below human perception.

## Why Single-File Payloads Win

When a reader requests \`https://cyberpulse.myfa.page/webassembly-cloudflare-edge\`, the edge node resolves the composite key \`cyberpulse__webassembly-cloudflare-edge\` in a single lookup and streams the complete document immediately.

- **Zero Container Boot Overhead**: Pure HTTP/3 response streaming with \`s-maxage=60\`.
- **Deterministic O(1) Storage**: Direct document lookup inside Cloud Firestore.
- **Full Origin Isolation**: Each subdomain operates inside its own browser security origin.

\`\`\`javascript
export async function resolveTenantPost(subdomain, slug) {
  const compositeKey = \`\${subdomain}__\${slug || "index"}\`;
  return await fetchFromEdgeStore(compositeKey);
}
\`\`\`

> "The fastest server is the edge node 12 miles from your reader that already holds your compiled HTML5 payload in RAM."`
  },
  {
    id: "cyberpulse__monetization-manifesto-tech-writers",
    subdomain: "cyberpulse",
    slug: "monetization-manifesto-tech-writers",
    title: "The Sovereign Monetization Manifesto for Independent Systems Writers",
    excerpt: "How owning your wildcard subdomain, direct subscriber list, and raw HTML archive compounds long-term audience equity.",
    category: "Finance & Crypto",
    tags: ["Publishing", "CreatorEconomy", "Sovereignty"],
    status: "published",
    views: 31400,
    claps: 1420,
    readRatio: "79%",
    readTime: "5 min read",
    userId: "demo-user-alex",
    authorName: "Alex Rivera",
    publishedAt: "2026-11-06T11:00:00.000Z",
    updatedAt: "2026-11-07T16:30:00.000Z",
    editorMode: "markdown",
    markdownBody: `# The Sovereign Monetization Manifesto for Independent Systems Writers

Closed blogging silos throttle outbound links and lock your audience behind algorithmic feeds. Publishing on your own dedicated subdomain gives you permanent control over your canonical URLs and subscriber relationships.

## Three Pillars of Publication Sovereignty

- **Permanent Subdomain Identity**: Your work lives at \`cyberpulse.myfa.page\`, indexed directly by search engines.
- **Portable Single-File Archives**: Every article is a standard HTML5 document you can export or mirror anywhere.
- **Zero Infrastructure Burn**: Running on Vercel Hobby and Firebase Spark means your fixed monthly hosting cost is $0.00.`
  },
  {
    id: "cyberpulse__designing-fluid-darkmode-dashboards",
    subdomain: "cyberpulse",
    slug: "designing-fluid-darkmode-dashboards",
    title: "Designing Fluid Darkmode Dashboards with Obsidian Glassmorphism",
    excerpt: "Engineering high-contrast telemetry interfaces using #07090f obsidian surfaces, 1px translucent borders, and radial indigo glows.",
    category: "Design",
    tags: ["DesignSystems", "DarkMode", "UIUX"],
    status: "published",
    views: 27910,
    claps: 1185,
    readRatio: "88%",
    readTime: "7 min read",
    userId: "demo-user-alex",
    authorName: "Alex Rivera",
    publishedAt: "2026-11-01T08:45:00.000Z",
    updatedAt: "2026-11-02T10:00:00.000Z",
    editorMode: "markdown",
    markdownBody: `# Designing Fluid Darkmode Dashboards with Obsidian Glassmorphism

Pure \`#000000\` backgrounds cause halation on OLED panels. By anchoring the canvas at \`#07090f\` and elevating cards to \`#0d111c\` with \`rgba(255,255,255,0.08)\` borders, interfaces achieve crisp depth without visual fatigue.

## Typography & Telemetry Hierarchy

- **Plus Jakarta Sans**: Geometric clarity for headlines and longform technical prose.
- **JetBrains Mono**: Scannable precision for URLs, latency figures, and status badges.`
  },
  {
    id: "cyberpulse__next-gen-subdomain-publishing-draft",
    subdomain: "cyberpulse",
    slug: "next-gen-subdomain-publishing-draft",
    title: "The Architectural Shift: How Next-Gen Subdomain Publishing Replaces Legacy CMS",
    excerpt: "Draft blueprint examining zero-VPS wildcard routing, deterministic key design, and instant global cache invalidation.",
    category: "Tech & AI",
    tags: ["NextJS", "Firestore", "Edge"],
    status: "draft",
    views: 0,
    claps: 0,
    readRatio: "0%",
    readTime: "4 min read",
    userId: "demo-user-alex",
    authorName: "Alex Rivera",
    publishedAt: "2026-11-14T18:00:00.000Z",
    updatedAt: "2026-11-14T18:00:00.000Z",
    editorMode: "markdown",
    markdownBody: `# The Architectural Shift: How Next-Gen Subdomain Publishing Replaces Legacy CMS

Legacy content management systems execute dozens of SQL queries per page view. MyfaPost compiles your dispatch once in the browser studio and stores the finished HTML5 document ready for instant edge delivery.`
  },
  {
    id: "hacker__top-hack-now",
    subdomain: "hacker",
    slug: "top-hack-now",
    title: "Zero-Click Subdomain Isolation & Origin Sandboxing on Multi-Tenant Edge Networks",
    excerpt: "Deep security advisory on Public Suffix List boundaries, Same-Origin Policy enforcement, and host-only authentication tokens.",
    category: "Security & Hacking",
    tags: ["Security", "SOP", "ZeroTrust"],
    status: "published",
    views: 94320,
    claps: 4120,
    readRatio: "91%",
    readTime: "8 min read",
    userId: "demo-user-kaelen",
    authorName: "Kaelen Vance",
    publishedAt: "2026-11-11T19:30:00.000Z",
    updatedAt: "2026-11-12T12:00:00.000Z",
    editorMode: "markdown",
    markdownBody: `# Zero-Click Subdomain Isolation & Origin Sandboxing on Multi-Tenant Edge Networks

When creators publish custom HTML5 documents at \`hacker.myfa.page/top-hack-now\`, browser Same-Origin Policy (SOP) treats \`hacker.myfa.page\` as a completely separate security origin from \`myfa.page\` and from every other tenant subdomain.

## Defense-in-Depth Verification

- **Host-Only Auth State**: Firebase Authentication lives strictly on \`myfa.page\` IndexedDB.
- **Deterministic Document Ownership**: Firestore Security Rules enforce \`request.auth.uid == resource.data.userId\`.
- **Immutable Edge Headers**: Every tenant response includes \`X-Content-Type-Options: nosniff\`.`
  },
  {
    id: "tech-radar__silicon-super-cycle",
    subdomain: "tech-radar",
    slug: "silicon-super-cycle",
    title: "The Next Silicon Super-Cycle: Micro-Kernels Rebuilding Edge Compute",
    excerpt: "Why specialized neural engines and deterministic edge runtimes are converging into a unified global compute fabric.",
    category: "Tech & AI",
    tags: ["Silicon", "AI", "EdgeCompute"],
    status: "published",
    views: 52180,
    claps: 2310,
    readRatio: "86%",
    readTime: "6 min read",
    userId: "demo-user-elena",
    authorName: "Elena Rostova",
    publishedAt: "2026-11-09T10:15:00.000Z",
    updatedAt: "2026-11-09T10:15:00.000Z",
    editorMode: "markdown",
    markdownBody: `# The Next Silicon Super-Cycle: Micro-Kernels Rebuilding Edge Compute

Across 340 edge PoPs, hardware-accelerated TLS termination and lightweight isolate runtimes allow independent publications to match the global latency of hyperscale media networks at zero cost.`
  }
].map((post) => ({
  ...post,
  htmlContent: compileStandaloneHtmlDocument({
    subdomain: post.subdomain,
    publicationName:
      post.subdomain === "hacker"
        ? "RootShell Research Lab"
        : post.subdomain === "tech-radar"
        ? "TechRadar Dispatch"
        : "CyberPulse Dispatch",
    authorName: post.authorName,
    authorRole: "Verified MyfaPost Creator",
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    category: post.category,
    tags: post.tags,
    publishedAt: post.publishedAt,
    markdownBody: post.markdownBody
  })
}));

const SEED_SUBSCRIBERS = [
  { id: "sub-01", email: "elena.rostova@techradar.dev", subdomain: "cyberpulse", channel: "Direct Subdomain Form", status: "Active", joinedAt: "2026-11-12", readsCount: 18 },
  { id: "sub-02", email: "kaelen.vance@rootshell.io", subdomain: "cyberpulse", channel: "Article Footer CTA", status: "Active", joinedAt: "2026-11-10", readsCount: 24 },
  { id: "sub-03", email: "sora.takahashi@zkledger.org", subdomain: "cyberpulse", channel: "X / Social Card", status: "Active", joinedAt: "2026-11-08", readsCount: 14 },
  { id: "sub-04", email: "marcus.sterling@gamepulse.gg", subdomain: "cyberpulse", channel: "Subdomain Showcase", status: "Active", joinedAt: "2026-11-05", readsCount: 11 },
  { id: "sub-05", email: "nadia.lindqvist@obsidian.design", subdomain: "cyberpulse", channel: "Direct Subdomain Form", status: "Active", joinedAt: "2026-11-02", readsCount: 19 },
  { id: "sub-06", email: "dev.architect@vercel-edge.net", subdomain: "cyberpulse", channel: "GitHub Referral", status: "Active", joinedAt: "2026-10-29", readsCount: 9 }
];

const STORAGE_KEYS = {
  SUBDOMAINS: "myfapost_subdomains_v3",
  POSTS: "myfapost_posts_v3",
  SUBSCRIBERS: "myfapost_subscribers_v3"
};

function getLocalList(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      window.localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function setLocalList(key, list) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {}
}

export function validateSubdomainFormat(rawSubdomain) {
  const clean = String(rawSubdomain || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "");

  if (!clean || clean.length < 3) {
    return {
      valid: false,
      clean,
      reason: "Subdomain must be at least 3 characters (a-z, 0-9, hyphens)."
    };
  }
  if (clean.length > 32) {
    return {
      valid: false,
      clean,
      reason: "Subdomain must be 32 characters or fewer."
    };
  }
  if (clean.startsWith("-") || clean.endsWith("-")) {
    return {
      valid: false,
      clean,
      reason: "Subdomain cannot start or end with a hyphen."
    };
  }
  if (RESERVED_SUBDOMAINS.includes(clean)) {
    return {
      valid: false,
      clean,
      reason: `"${clean}" is a reserved system namespace.`
    };
  }
  return { valid: true, clean, reason: "Valid subdomain syntax." };
}

export async function checkSubdomainAvailability(rawSubdomain) {
  const check = validateSubdomainFormat(rawSubdomain);
  if (!check.valid) {
    return { available: false, subdomain: check.clean, reason: check.reason };
  }

  if (db) {
    try {
      const snap = await getDoc(doc(db, "subdomains", check.clean));
      if (snap.exists()) {
        return {
          available: false,
          subdomain: check.clean,
          reason: `${check.clean}.myfa.page is already claimed.`,
          record: snap.data()
        };
      }
    } catch (e) {}
  }

  const localSubs = getLocalList(STORAGE_KEYS.SUBDOMAINS, INITIAL_DEMO_SUBDOMAINS);
  const existing = localSubs.find((s) => s.subdomain === check.clean);
  if (existing) {
    return {
      available: false,
      subdomain: check.clean,
      reason: `${check.clean}.myfa.page is already claimed by ${existing.displayName}.`,
      record: existing
    };
  }

  return {
    available: true,
    subdomain: check.clean,
    reason: `${check.clean}.myfa.page is available for instant claim!`
  };
}

export async function listAllSubdomains() {
  const localSubs = getLocalList(STORAGE_KEYS.SUBDOMAINS, INITIAL_DEMO_SUBDOMAINS);
  if (db) {
    try {
      const snap = await getDocs(collection(db, "subdomains"));
      const remote = [];
      snap.forEach((d) => remote.push(d.data()));
      const mergedMap = new Map();
      [...localSubs, ...remote].forEach((item) => {
        if (item && item.subdomain) mergedMap.set(item.subdomain, item);
      });
      return Array.from(mergedMap.values());
    } catch (e) {}
  }
  return localSubs;
}

export async function getSubdomainRecord(subdomain) {
  const clean = String(subdomain || "").toLowerCase().trim();
  if (!clean) return null;
  if (db) {
    try {
      const snap = await getDoc(doc(db, "subdomains", clean));
      if (snap.exists()) return snap.data();
    } catch (e) {}
  }
  const all = getLocalList(STORAGE_KEYS.SUBDOMAINS, INITIAL_DEMO_SUBDOMAINS);
  return all.find((s) => s.subdomain === clean) || null;
}

export async function claimOrUpdateSubdomain({
  subdomain,
  displayName,
  authorName,
  authorRole = "Independent Creator",
  bio = "",
  category = "Tech & AI",
  accentColor = "#6366f1",
  userId = "demo-user-alex"
}) {
  const check = validateSubdomainFormat(subdomain);
  if (!check.valid) throw new Error(check.reason);

  const payload = {
    subdomain: check.clean,
    displayName: displayName || `${check.clean} Dispatch`,
    authorName: authorName || "Creator",
    authorRole,
    bio: bio || `Official independent publication hosted at ${check.clean}.myfa.page.`,
    category,
    accentColor,
    userId,
    subscribersCount: 1,
    totalViews: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db) {
    try {
      await setDoc(doc(db, "subdomains", check.clean), payload, { merge: true });
    } catch (e) {}
  }

  const localSubs = getLocalList(STORAGE_KEYS.SUBDOMAINS, INITIAL_DEMO_SUBDOMAINS);
  const idx = localSubs.findIndex((s) => s.subdomain === check.clean);
  if (idx >= 0) {
    localSubs[idx] = { ...localSubs[idx], ...payload };
  } else {
    localSubs.unshift(payload);
  }
  setLocalList(STORAGE_KEYS.SUBDOMAINS, localSubs);
  return payload;
}

export async function listPostsBySubdomain(subdomain) {
  const cleanSub = subdomain ? String(subdomain).toLowerCase().trim() : null;
  const localPosts = getLocalList(STORAGE_KEYS.POSTS, SEED_POSTS);

  if (db) {
    try {
      const q = cleanSub
        ? query(collection(db, "posts"), where("subdomain", "==", cleanSub))
        : collection(db, "posts");
      const snap = await getDocs(q);
      const remote = [];
      snap.forEach((d) => remote.push(d.data()));
      const merged = new Map();
      localPosts
        .filter((p) => (!cleanSub ? true : p.subdomain === cleanSub))
        .forEach((p) => merged.set(p.id, p));
      remote.forEach((p) => merged.set(p.id, p));
      return Array.from(merged.values()).sort(
        (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
      );
    } catch (e) {}
  }

  return localPosts
    .filter((p) => (!cleanSub ? true : p.subdomain === cleanSub))
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
}

export async function getPostBySubdomainAndSlug(subdomain, slug) {
  const cleanSub = String(subdomain || "").toLowerCase().trim();
  const cleanSlug = String(slug || "index").toLowerCase().trim();
  const compositeId = `${cleanSub}__${cleanSlug}`;

  if (db) {
    try {
      const snap = await getDoc(doc(db, "posts", compositeId));
      if (snap.exists()) return snap.data();
    } catch (e) {}
  }

  const localPosts = getLocalList(STORAGE_KEYS.POSTS, SEED_POSTS);
  return (
    localPosts.find(
      (p) => p.id === compositeId || (p.subdomain === cleanSub && p.slug === cleanSlug)
    ) || null
  );
}

export async function savePostDocument(postData) {
  const cleanSub = String(postData.subdomain || "cyberpulse").toLowerCase().trim();
  const cleanSlug = String(postData.slug || "index")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]/g, "-");
  const compositeId = `${cleanSub}__${cleanSlug}`;

  const htmlString = String(postData.htmlContent || "");
  const byteSize = new TextEncoder().encode(htmlString).length;
  if (byteSize > MAX_HTML_BYTES) {
    throw new Error(
      `HTML payload (${(byteSize / 1024).toFixed(1)} KB) exceeds the 900 KB Firestore Spark limit.`
    );
  }

  const record = {
    id: compositeId,
    subdomain: cleanSub,
    slug: cleanSlug,
    title: postData.title || "Untitled Dispatch",
    excerpt: postData.excerpt || "",
    category: postData.category || "Tech & AI",
    tags: Array.isArray(postData.tags) ? postData.tags : ["Tech"],
    status: postData.status || "published",
    scheduledFor: postData.scheduledFor || null,
    views: typeof postData.views === "number" ? postData.views : 1,
    claps: typeof postData.claps === "number" ? postData.claps : 1,
    readRatio: postData.readRatio || "82%",
    readTime: postData.readTime || "4 min read",
    userId: postData.userId || "demo-user-alex",
    authorName: postData.authorName || "Alex Rivera",
    editorMode: postData.editorMode || "markdown",
    markdownBody: postData.markdownBody || "",
    htmlContent: htmlString,
    publishedAt: postData.publishedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db) {
    try {
      await setDoc(doc(db, "posts", compositeId), record, { merge: true });
    } catch (e) {}
  }

  const localPosts = getLocalList(STORAGE_KEYS.POSTS, SEED_POSTS);
  const idx = localPosts.findIndex((p) => p.id === compositeId);
  if (idx >= 0) {
    localPosts[idx] = { ...localPosts[idx], ...record };
  } else {
    localPosts.unshift(record);
  }
  setLocalList(STORAGE_KEYS.POSTS, localPosts);
  return record;
}

export async function deletePostDocument(subdomain, slug) {
  const cleanSub = String(subdomain || "").toLowerCase().trim();
  const cleanSlug = String(slug || "").toLowerCase().trim();
  const compositeId = `${cleanSub}__${cleanSlug}`;

  if (db) {
    try {
      await deleteDoc(doc(db, "posts", compositeId));
    } catch (e) {}
  }

  const localPosts = getLocalList(STORAGE_KEYS.POSTS, SEED_POSTS);
  const filtered = localPosts.filter(
    (p) => p.id !== compositeId && !(p.subdomain === cleanSub && p.slug === cleanSlug)
  );
  setLocalList(STORAGE_KEYS.POSTS, filtered);
  return true;
}

export async function listSubscribers(subdomain = "cyberpulse") {
  const all = getLocalList(STORAGE_KEYS.SUBSCRIBERS, SEED_SUBSCRIBERS);
  return all.filter((s) => !subdomain || s.subdomain === subdomain);
}

export async function addSubscriber({ email, subdomain = "cyberpulse", channel = "Direct Form" }) {
  const all = getLocalList(STORAGE_KEYS.SUBSCRIBERS, SEED_SUBSCRIBERS);
  const newSub = {
    id: `sub-${Date.now()}`,
    email,
    subdomain,
    channel,
    status: "Active",
    joinedAt: new Date().toISOString().slice(0, 10),
    readsCount: 1
  };
  all.unshift(newSub);
  setLocalList(STORAGE_KEYS.SUBSCRIBERS, all);
  return newSub;
}

export async function exportPublicationArchive(subdomain = "cyberpulse") {
  const subRecord = await getSubdomainRecord(subdomain);
  const posts = await listPostsBySubdomain(subdomain);
  const subscribers = await listSubscribers(subdomain);
  return {
    version: "3.4.0",
    exportedAt: new Date().toISOString(),
    subdomain: subRecord,
    posts,
    subscribers
  };
}

export async function importPublicationArchive(archiveJson) {
  if (!archiveJson || typeof archiveJson !== "object") {
    throw new Error("Invalid archive JSON payload.");
  }
  if (archiveJson.subdomain && archiveJson.subdomain.subdomain) {
    await claimOrUpdateSubdomain(archiveJson.subdomain);
  }
  if (Array.isArray(archiveJson.posts)) {
    for (const post of archiveJson.posts) {
      await savePostDocument(post);
    }
  }
  return true;
}
