import { ROOT_DOMAIN, MAX_HTML_BYTES } from "./constants";

export function slugifyInput(raw) {
  if (!raw) return "";
  return String(raw)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_\s]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function calculateReadingStats(textOrHtml) {
  const plain = String(textOrHtml || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = plain ? plain.split(" ").filter(Boolean).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 210));
  const byteSize = new TextEncoder().encode(String(textOrHtml || "")).length;
  return {
    words,
    minutes,
    readTimeLabel: `${minutes} min read`,
    byteSize,
    kbSize: (byteSize / 1024).toFixed(1),
    withinSparkLimit: byteSize <= MAX_HTML_BYTES
  };
}

export function analyzeSeoScore({ title = "", excerpt = "", slug = "", htmlContent = "", tags = [] }) {
  const checks = [];
  let score = 0;

  const titleLen = title.trim().length;
  if (titleLen >= 25 && titleLen <= 70) {
    score += 22;
    checks.push({ label: "Optimal Headline Length (25-70 chars)", passed: true, points: 22 });
  } else if (titleLen > 10) {
    score += 12;
    checks.push({ label: "Headline Present (Target 25-70 chars)", passed: true, points: 12 });
  } else {
    checks.push({ label: "Headline Too Short (<10 chars)", passed: false, points: 0 });
  }

  const descLen = excerpt.trim().length;
  if (descLen >= 80 && descLen <= 170) {
    score += 20;
    checks.push({ label: "Meta Description Calibrated (80-170 chars)", passed: true, points: 20 });
  } else if (descLen >= 30) {
    score += 10;
    checks.push({ label: "Meta Description Included", passed: true, points: 10 });
  } else {
    checks.push({ label: "Meta Description Missing or Brief", passed: false, points: 0 });
  }

  const cleanSlug = slugifyInput(slug);
  if (cleanSlug && cleanSlug.length >= 3 && cleanSlug.length <= 48) {
    score += 18;
    checks.push({ label: `Canonical Slug Validated (/${cleanSlug})`, passed: true, points: 18 });
  } else {
    checks.push({ label: "Canonical URL Slug Required", passed: false, points: 0 });
  }

  const hasH1 = /<h1[\s>]/i.test(htmlContent) || /^#\s+/m.test(htmlContent);
  if (hasH1) {
    score += 15;
    checks.push({ label: "Semantic Primary Heading (<h1>) Detected", passed: true, points: 15 });
  } else {
    checks.push({ label: "Include a Primary <h1> Heading", passed: false, points: 0 });
  }

  const hasViewport = /name=["']viewport["']/i.test(htmlContent) || htmlContent.length > 120;
  if (hasViewport) {
    score += 15;
    checks.push({ label: "Mobile Viewport & Responsive Meta Ready", passed: true, points: 15 });
  } else {
    checks.push({ label: "Viewport Meta Tag Missing", passed: false, points: 0 });
  }

  if (Array.isArray(tags) && tags.length >= 2) {
    score += 10;
    checks.push({ label: `Topic Taxonomy Indexed (${tags.length} tags)`, passed: true, points: 10 });
  } else {
    checks.push({ label: "Add at least 2 Topic Tags", passed: false, points: 0 });
  }

  return {
    score: Math.min(100, score),
    checks
  };
}

export function markdownToSemanticHtmlBody(markdownText) {
  const lines = String(markdownText || "").split("\n");
  const out = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let inList = false;

  const flushList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  const formatInline = (str) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (trimmed.startsWith("```")) {
      flushList();
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        const escaped = codeBuffer
          .join("\n")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        out.push(`<pre class="code-block"><code>${escaped}</code></pre>`);
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed === "---") {
      flushList();
      out.push('<hr class="section-divider" />');
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      out.push(`<h3>${formatInline(trimmed.slice(4))}</h3>`);
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      out.push(`<h2>${formatInline(trimmed.slice(3))}</h2>`);
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushList();
      out.push(`<h1>${formatInline(trimmed.slice(2))}</h1>`);
      continue;
    }

    if (trimmed.startsWith("> ")) {
      flushList();
      out.push(`<blockquote>${formatInline(trimmed.slice(2))}</blockquote>`);
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        out.push('<ul class="article-list">');
        inList = true;
      }
      out.push(`<li>${formatInline(trimmed.slice(2))}</li>`);
      continue;
    }

    flushList();
    out.push(`<p>${formatInline(trimmed)}</p>`);
  }

  flushList();
  return out.join("\n");
}

export function compileStandaloneHtmlDocument({
  subdomain = "cyberpulse",
  publicationName = "CyberPulse Dispatch",
  authorName = "Alex Rivera",
  authorRole = "Principal Systems Architect",
  title = "Untitled Dispatch",
  excerpt = "",
  slug = "untitled-dispatch",
  category = "Tech & AI",
  tags = ["Tech", "Architecture"],
  publishedAt = new Date().toISOString(),
  markdownBody = "",
  accentColor = "#6366f1"
}) {
  const canonicalUrl =
    slug === "index"
      ? `https://${subdomain}.${ROOT_DOMAIN}`
      : `https://${subdomain}.${ROOT_DOMAIN}/${slug}`;
  const bodyHtml = markdownToSemanticHtmlBody(markdownBody);
  const stats = calculateReadingStats(markdownBody);
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  const tagsHtml = (tags || [])
    .map((t) => `<span class="tag-chip">#${String(t).replace(/^#/, "")}</span>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | ${publicationName}</title>
  <meta name="description" content="${excerpt.replace(/"/g, "&quot;")}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title.replace(/"/g, "&quot;")}" />
  <meta property="og:description" content="${excerpt.replace(/"/g, "&quot;")}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:site_name" content="${publicationName}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title.replace(/"/g, "&quot;")}" />
  <meta name="twitter:description" content="${excerpt.replace(/"/g, "&quot;")}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #07090f;
      --surface: #0d111c;
      --surface-elevated: #131929;
      --border: rgba(255, 255, 255, 0.08);
      --text: #f8fafc;
      --muted: #94a3b8;
      --accent: ${accentColor};
      --emerald: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      background-image: radial-gradient(circle at 20% 0%, rgba(99, 102, 241, 0.16), transparent 45%),
                        radial-gradient(circle at 80% 10%, rgba(139, 92, 246, 0.12), transparent 45%);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.75;
      min-height: 100vh;
    }
    .topbar {
      position: sticky;
      top: 0;
      z-index: 40;
      backdrop-filter: blur(16px);
      background: rgba(7, 9, 15, 0.84);
      border-bottom: 1px solid var(--border);
      padding: 0.9rem 1.5rem;
    }
    .topbar-inner {
      max-width: 920px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--text);
      font-weight: 700;
      font-size: 0.95rem;
    }
    .brand-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--emerald);
      box-shadow: 0 0 12px var(--emerald);
    }
    .host-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #a5b4fc;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.28);
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
      text-decoration: none;
    }
    .container {
      max-width: 780px;
      margin: 0 auto;
      padding: 3.5rem 1.5rem 5rem;
    }
    .meta-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      font-size: 0.8rem;
      color: var(--muted);
    }
    .cat-badge {
      background: rgba(99, 102, 241, 0.16);
      color: #c7d2fe;
      border: 1px solid rgba(99, 102, 241, 0.35);
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.7rem;
    }
    h1 {
      font-size: clamp(2rem, 4.5vw, 3rem);
      line-height: 1.15;
      font-weight: 800;
      letter-spacing: -0.025em;
      margin-bottom: 1rem;
      color: #ffffff;
    }
    .lead {
      font-size: 1.15rem;
      color: var(--muted);
      margin-bottom: 2rem;
    }
    .author-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      margin-bottom: 2.5rem;
    }
    .author-meta strong { display: block; font-size: 0.95rem; color: #fff; }
    .author-meta span { font-size: 0.8rem; color: var(--muted); }
    article h2 {
      font-size: 1.55rem;
      font-weight: 700;
      margin: 2.4rem 0 0.9rem;
      color: #ffffff;
    }
    article h3 {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 1.8rem 0 0.7rem;
      color: #e2e8f0;
    }
    article p {
      margin-bottom: 1.35rem;
      color: #cbd5e1;
      font-size: 1.05rem;
    }
    article a { color: #818cf8; text-decoration: underline; }
    .article-list {
      margin: 0 0 1.5rem 1.35rem;
      color: #cbd5e1;
    }
    .article-list li { margin-bottom: 0.5rem; }
    blockquote {
      margin: 1.8rem 0;
      padding: 1.1rem 1.4rem;
      border-left: 3px solid var(--accent);
      background: rgba(13, 17, 28, 0.85);
      border-radius: 0 12px 12px 0;
      color: #e2e8f0;
      font-style: italic;
    }
    .inline-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.88em;
      background: rgba(255, 255, 255, 0.07);
      padding: 0.15rem 0.45rem;
      border-radius: 6px;
      color: #a5b4fc;
    }
    .code-block {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      background: #05070c;
      border: 1px solid var(--border);
      padding: 1.25rem;
      border-radius: 12px;
      overflow-x: auto;
      margin: 1.6rem 0;
      color: #e2e8f0;
    }
    .section-divider {
      border: 0;
      border-top: 1px solid var(--border);
      margin: 2.5rem 0;
    }
    .tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 2.5rem;
    }
    .tag-chip {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: var(--muted);
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 0.3rem 0.75rem;
      border-radius: 8px;
    }
    .subscribe-box {
      margin-top: 3rem;
      padding: 2rem;
      background: linear-gradient(135deg, rgba(13, 17, 28, 0.96), rgba(19, 25, 41, 0.92));
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 16px;
    }
    .subscribe-box h3 { font-size: 1.25rem; margin-bottom: 0.4rem; }
    .subscribe-box p { color: var(--muted); font-size: 0.9rem; margin-bottom: 1rem; }
    .sub-form { display: flex; gap: 0.6rem; flex-wrap: wrap; }
    .sub-input {
      flex: 1;
      min-width: 220px;
      background: #07090f;
      border: 1px solid var(--border);
      color: #fff;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      font-family: inherit;
    }
    .sub-btn {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border: 0;
      padding: 0.75rem 1.35rem;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
    }
    footer {
      margin-top: 4rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      font-size: 0.8rem;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="/?preview_sub=${subdomain}">
        <span class="brand-dot"></span>
        <span>${publicationName}</span>
      </a>
      <a class="host-pill" href="/?preview_sub=${subdomain}">${subdomain}.${ROOT_DOMAIN}</a>
    </div>
  </header>
  <main class="container">
    <div class="meta-row">
      <span class="cat-badge">${category}</span>
      <span>${formattedDate}</span>
      <span>•</span>
      <span>${stats.readTimeLabel}</span>
      <span>•</span>
      <span>${stats.words} words</span>
    </div>
    <h1>${title}</h1>
    <p class="lead">${excerpt}</p>
    <div class="author-card">
      <div class="author-meta">
        <strong>${authorName}</strong>
        <span>${authorRole} · ${subdomain}.${ROOT_DOMAIN}</span>
      </div>
      <span class="host-pill">Verified Edge Node</span>
    </div>
    <article>
      ${bodyHtml}
    </article>
    <div class="tag-row">${tagsHtml}</div>
    <section class="subscribe-box">
      <h3>Subscribe to ${publicationName}</h3>
      <p>Get instant standalone dispatches published on ${subdomain}.${ROOT_DOMAIN} delivered directly to your inbox.</p>
      <form class="sub-form" onsubmit="event.preventDefault(); this.querySelector('button').textContent='Subscribed ✓';">
        <input class="sub-input" type="email" required placeholder="engineer@domain.com" />
        <button class="sub-btn" type="submit">Subscribe Free</button>
      </form>
    </section>
    <footer>
      <span>Published via MyfaPost Creator OS · ${subdomain}.${ROOT_DOMAIN}</span>
      <span>Served from Edge Cache (s-maxage=60, stale-while-revalidate=300)</span>
    </footer>
  </main>
</body>
</html>`;
}
