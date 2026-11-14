export const CREATOR_LESSONS = [
  {
    id: "lesson-01",
    number: "01",
    title: "Wildcard Subdomain Architecture Without VPS or cPanel",
    duration: "12 min",
    level: "Architecture Core",
    summary: "Understand how DNS wildcard records (*.myfa.page) and Next.js Edge Middleware route unlimited tenant subdomains on a $0 serverless budget.",
    keyTakeaways: [
      "An A record for @ (76.76.21.21) and a CNAME record for * (cname.vercel-dns.com) route every subdomain to Vercel's Anycast Edge network.",
      "Next.js Edge Middleware inspects the incoming Host header in sub-millisecond time without spinning up a Linux container.",
      "Internal URL rewriting maps hacker.myfa.page/top-hack-now to /sites/hacker/top-hack-now while preserving the clean browser address bar."
    ],
    codeSnippet: `export function middleware(request) {
  const host = (request.headers.get("host") || "").split(":")[0];
  if (host.endsWith(".myfa.page")) {
    const sub = host.replace(".myfa.page", "");
    const url = request.nextUrl.clone();
    url.pathname = \`/sites/\${sub}\${url.pathname === "/" ? "" : url.pathname}\`;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}`,
    quizQuestion: "Why does MyfaPost use NextResponse.rewrite() instead of NextResponse.redirect() for tenant subdomains?",
    quizOptions: [
      "Rewrite preserves the creator's custom subdomain URL in the reader's browser bar while serving the internal route handler.",
      "Redirect is disabled on HTTPS connections.",
      "Rewrite compresses images automatically."
    ],
    correctOptionIndex: 0
  },
  {
    id: "lesson-02",
    number: "02",
    title: "Engineering Standalone Single-File index.html Payloads & Root index Slugs",
    duration: "15 min",
    level: "Frontend Engineering",
    summary: "Learn how self-contained HTML5 documents eliminate external bundle waterfalls and how the reserved `index` slug overrides your root subdomain homepage.",
    keyTakeaways: [
      "Every published post is stored as a complete, valid HTML5 document with inline critical CSS and zero render-blocking framework bundles.",
      "Publishing a post with the slug `index` automatically replaces the default subdomain directory at https://yourname.myfa.page.",
      "Keeping the total payload under 900 KB guarantees compliance with Cloud Firestore's 1 MiB document ceiling."
    ],
    codeSnippet: `const rootDocId = \`\${subdomain}__index\`;
const rootSnap = await getDoc(doc(db, "posts", rootDocId));
if (rootSnap.exists() && rootSnap.data().status === "published") {
  return new Response(rootSnap.data().htmlContent, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}`,
    quizQuestion: "Which slug must you assign to a post if you want it served as your root homepage at https://yourname.myfa.page?",
    quizOptions: ["home", "index", "root-page"],
    correctOptionIndex: 1
  },
  {
    id: "lesson-03",
    number: "03",
    title: "Technical SEO, Canonical Links & OpenGraph Social Cards",
    duration: "10 min",
    level: "Growth & Indexing",
    summary: "Configure canonical URLs, structured OpenGraph metadata, and semantic heading hierarchies to achieve a 100/100 SEO Configuration Score.",
    keyTakeaways: [
      "Always include a self-referencing <link rel='canonical'> pointing to https://{subdomain}.myfa.page/{slug}.",
      "Calibrate your article headline between 25 and 70 characters and meta description between 80 and 170 characters.",
      "Use a single primary <h1> tag followed by structured <h2> and <h3> subheadings."
    ],
    codeSnippet: `<link rel="canonical" href="https://cyberpulse.myfa.page/edge-micro-kernels" />
<meta property="og:type" content="article" />
<meta property="og:title" content="Micro-Kernels Rebuilding Edge Compute" />
<meta name="twitter:card" content="summary_large_image" />`,
    quizQuestion: "What is the recommended character range for an article's meta description to maximize search snippet visibility?",
    quizOptions: ["10 to 25 characters", "80 to 170 characters", "500 to 1,000 characters"],
    correctOptionIndex: 1
  },
  {
    id: "lesson-04",
    number: "04",
    title: "Origin Isolation, Same-Origin Policy & Public Suffix List Security",
    duration: "14 min",
    level: "Security Architecture",
    summary: "Explore how browser Same-Origin Policy (SOP) sandboxes each creator subdomain and keeps Firebase authentication scoped strictly to the apex control plane.",
    keyTakeaways: [
      "Firebase Auth runs exclusively on the apex myfa.page origin using host-only IndexedDB persistence.",
      "Tenant subdomains (*.myfa.page) never receive user session cookies or admin tokens.",
      "JavaScript running on one creator subdomain cannot read storage or DOM state from another creator subdomain."
    ],
    codeSnippet: `headers: {
  "Content-Type": "text/html; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}`,
    quizQuestion: "Where are creator Firebase Authentication credentials stored in the MyfaPost security model?",
    quizOptions: [
      "Exclusively in host-only storage on the myfa.page control-plane origin",
      "Shared across every *.myfa.page subdomain cookie",
      "Inside public URL query strings"
    ],
    correctOptionIndex: 0
  },
  {
    id: "lesson-05",
    number: "05",
    title: "Mastering Firebase Spark Free Tier & Deterministic O(1) Firestore Keys",
    duration: "16 min",
    level: "Database Systems",
    summary: "Design zero-cost Firestore collections that maximize the 50,000 free daily reads and 20,000 free daily writes without requiring Firebase Cloud Storage.",
    keyTakeaways: [
      "Firebase Cloud Storage requires upgrading to the Blaze plan, whereas Cloud Firestore includes 1 GiB of free storage on the Spark plan.",
      "By naming post documents `{subdomain}__{slug}`, edge route handlers perform a single `getDoc()` call instead of a multi-filter query.",
      "Firestore Security Rules verify `request.auth.uid == resource.data.userId` on every write or delete operation."
    ],
    codeSnippet: `match /posts/{postId} {
  allow read: if true;
  allow create, update: if request.auth != null
    && request.resource.data.userId == request.auth.uid
    && request.resource.data.htmlContent.size() <= 921600;
}`,
    quizQuestion: "Why does MyfaPost store HTML source inside Cloud Firestore documents instead of Firebase Cloud Storage buckets?",
    quizOptions: [
      "Cloud Firestore works 100% free on the Firebase Spark plan without requiring a credit card or Blaze billing upgrade.",
      "Firestore allows 100 GB single documents.",
      "HTML files cannot be stored in object buckets."
    ],
    correctOptionIndex: 0
  },
  {
    id: "lesson-06",
    number: "06",
    title: "GitHub to Vercel Continuous Deployment & Edge Caching",
    duration: "11 min",
    level: "DevOps & CDN",
    summary: "Multiply your Firebase Spark quota by 100x using HTTP `s-maxage` and `stale-while-revalidate` edge caching headers on Vercel.",
    keyTakeaways: [
      "Returning `Cache-Control: public, s-maxage=60, stale-while-revalidate=300` caches the rendered HTML at Vercel's edge PoPs.",
      "Thousands of concurrent readers visiting a viral post are served directly from Vercel's CDN memory while consuming only 1 Firestore read per minute.",
      "Every `git push` to your GitHub repository triggers an atomic zero-downtime deployment on Vercel."
    ],
    codeSnippet: `return new Response(post.htmlContent, {
  status: 200,
  headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
  }
});`,
    quizQuestion: "How does the `s-maxage=60, stale-while-revalidate=300` header protect your Firebase Spark daily read quota?",
    quizOptions: [
      "Vercel's CDN serves cached HTML to all readers for 60 seconds and revalidates in the background, reducing Firestore reads by over 99%.",
      "It disables CSS rendering on mobile devices.",
      "It blocks search engines from indexing your site."
    ],
    correctOptionIndex: 0
  },
  {
    id: "lesson-07",
    number: "07",
    title: "Designing High-Retention Dark Glassmorphic Reading Interfaces",
    duration: "13 min",
    level: "UI/UX Craft",
    summary: "Apply obsidian color tokens (#07090f), translucent 1px borders, Plus Jakarta Sans typography, and micro-telemetry callouts to keep readers engaged.",
    keyTakeaways: [
      "Pair `#07090f` deep obsidian backgrounds with `#0d111c` elevated slate cards and `rgba(255,255,255,0.08)` borders.",
      "Maintain a comfortable 65-75 character line measure (`max-width: 780px`) with 1.75 line height for effortless longform reading.",
      "Use `JetBrains Mono` for URLs, metrics, code blocks, and latency badges."
    ],
    codeSnippet: `:root {
  --bg-obsidian: #07090f;
  --card-slate: #0d111c;
  --accent-indigo: #6366f1;
  --status-emerald: #10b981;
}`,
    quizQuestion: "Which font pairing defines the MyfaPost Creator OS design system?",
    quizOptions: [
      "Plus Jakarta Sans for UI/prose and JetBrains Mono for code/telemetry",
      "Comic Sans and Papyrus",
      "Times New Roman only"
    ],
    correctOptionIndex: 0
  },
  {
    id: "lesson-08",
    number: "08",
    title: "Growing & Monetizing an Independent Subdomain Publication",
    duration: "14 min",
    level: "Audience CRM",
    summary: "Capture direct email subscribers inside your standalone HTML pages, analyze reader retention, and export portable JSON backups anytime.",
    keyTakeaways: [
      "Embed the MyfaPost newsletter capture snippet inside any custom `index.html` page to build a direct subscriber list you own.",
      "Track read completion ratios and top traffic sources from the Creator OS Analytics workspace.",
      "Use the 1-click Full JSON Archive Export on the Manage page to keep verifiable offline backups of your entire publication."
    ],
    codeSnippet: `<form action="https://myfa.page/audience" method="GET">
  <input type="hidden" name="sub" value="cyberpulse" />
  <input type="email" name="email" required placeholder="you@domain.com" />
  <button type="submit">Subscribe</button>
</form>`,
    quizQuestion: "How can you back up every post and configuration setting from your MyfaPost subdomain?",
    quizOptions: [
      "Use the 1-click Full JSON Publication Archive Export in the Manage Subdomain workspace",
      "Print each page on paper",
      "Backups are not supported"
    ],
    correctOptionIndex: 0
  }
];
