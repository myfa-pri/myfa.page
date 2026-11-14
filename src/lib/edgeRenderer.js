import {
  getSubdomainRecord,
  getPostBySubdomainAndSlug,
  listPostsBySubdomain
} from "./firebase";
import { ROOT_DOMAIN } from "./constants";

export const EDGE_RESPONSE_HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

export function renderUnclaimedSubdomainHtml(subdomain) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subdomain}.${ROOT_DOMAIN} — Available on MyfaPost Creator OS</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    body { background:#07090f; color:#f8fafc; font-family:'Plus Jakarta Sans',sans-serif; margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1.5rem; background-image:radial-gradient(circle at 50% 20%, rgba(99,102,241,0.2), transparent 55%); }
    .card { max-width:620px; width:100%; background:#0d111c; border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:2.75rem; text-align:center; box-shadow:0 25px 60px rgba(0,0,0,0.6); }
    .pill { display:inline-block; font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:#10b981; background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.3); padding:0.35rem 0.85rem; border-radius:999px; margin-bottom:1.25rem; }
    h1 { font-size:2.2rem; margin:0 0 0.75rem; font-weight:800; }
    p { color:#94a3b8; line-height:1.7; margin-bottom:2rem; }
    .btn { display:inline-block; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; text-decoration:none; font-weight:700; padding:0.9rem 1.8rem; border-radius:12px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="pill">404 · UNCLAIMED SUBDOMAIN NAMESPACE</span>
    <h1>${subdomain}.${ROOT_DOMAIN} is Available</h1>
    <p>This wildcard subdomain has not been claimed yet. Reserve <strong>${subdomain}.${ROOT_DOMAIN}</strong> now on MyfaPost Creator OS and publish standalone HTML5 pages or articles in seconds.</p>
    <a class="btn" href="/auth?claim=${encodeURIComponent(subdomain)}">Claim ${subdomain}.${ROOT_DOMAIN} Free →</a>
  </div>
</body>
</html>`;
}

export function renderSubdomainDirectoryHtml(subRecord, posts) {
  const subdomain = subRecord.subdomain;
  const publishedPosts = (posts || []).filter((p) => p.status === "published");
  const cardsHtml = publishedPosts.length
    ? publishedPosts
        .map(
          (p) => `
      <a class="post-card" href="/?preview_sub=${subdomain}&preview_slug=${p.slug}">
        <div class="post-meta">
          <span class="cat">${p.category || "Dispatch"}</span>
          <span>${p.readTime || "5 min read"}</span>
          <span>•</span>
          <span>${(p.views || 120).toLocaleString()} views</span>
        </div>
        <h2>${p.title}</h2>
        <p>${p.excerpt}</p>
        <div class="slug-line">${subdomain}.${ROOT_DOMAIN}/${p.slug} →</div>
      </a>`
        )
        .join("\n")
    : `<div class="empty-box">No published dispatches yet on ${subdomain}.${ROOT_DOMAIN}. Publish a post or create a root <code>index</code> slug in the Studio Editor.</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subRecord.displayName} (${subdomain}.${ROOT_DOMAIN})</title>
  <meta name="description" content="${subRecord.bio}" />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    body { background:#07090f; color:#f8fafc; font-family:'Plus Jakarta Sans',sans-serif; margin:0; line-height:1.7; background-image:radial-gradient(circle at 20% 0%, rgba(99,102,241,0.16), transparent 45%); }
    .wrap { max-width:920px; margin:0 auto; padding:3.5rem 1.5rem 5rem; }
    .header { background:#0d111c; border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:2.5rem; margin-bottom:2.5rem; }
    .host-badge { display:inline-block; font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:#10b981; background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.3); padding:0.3rem 0.75rem; border-radius:999px; margin-bottom:1rem; }
    h1 { font-size:2.4rem; margin:0 0 0.6rem; font-weight:800; }
    .bio { color:#94a3b8; font-size:1.05rem; margin-bottom:1.25rem; }
    .author-bar { font-size:0.85rem; color:#cbd5e1; font-family:'JetBrains Mono',monospace; }
    .grid { display:grid; gap:1.25rem; }
    .post-card { display:block; text-decoration:none; color:inherit; background:#0d111c; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:1.75rem; transition:border-color 0.2s, transform 0.2s; }
    .post-card:hover { border-color:#6366f1; transform:translateY(-2px); }
    .post-meta { display:flex; gap:0.65rem; align-items:center; font-size:0.78rem; color:#94a3b8; margin-bottom:0.6rem; }
    .cat { color:#a5b4fc; background:rgba(99,102,241,0.15); padding:0.15rem 0.55rem; border-radius:999px; font-weight:600; }
    .post-card h2 { font-size:1.4rem; margin:0 0 0.5rem; color:#fff; }
    .post-card p { color:#94a3b8; margin:0 0 1rem; font-size:0.95rem; }
    .slug-line { font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:#818cf8; }
    .empty-box { background:#0d111c; border:1px dashed rgba(255,255,255,0.15); padding:2rem; border-radius:14px; text-align:center; color:#94a3b8; }
    .top-Return { display:inline-block; margin-bottom:1.25rem; color:#94a3b8; font-size:0.85rem; text-decoration:none; font-family:'JetBrains Mono',monospace; }
  </style>
</head>
<body>
  <div class="wrap">
    <a class="top-Return" href="/">← MyfaPost Creator OS (${ROOT_DOMAIN})</a>
    <header class="header">
      <span class="host-badge">LIVE EDGE SUBDOMAIN · ${subdomain}.${ROOT_DOMAIN}</span>
      <h1>${subRecord.displayName}</h1>
      <p class="bio">${subRecord.bio}</p>
      <div class="author-bar">Curated by ${subRecord.authorName} (${subRecord.authorRole || "Creator"}) · ${publishedPosts.length} Published Dispatches</div>
    </header>
    <section class="grid">
      ${cardsHtml}
    </section>
  </div>
</body>
</html>`;
}

export async function handleSubdomainRootRequest(subdomain) {
  const cleanSub = String(subdomain || "").toLowerCase().trim();
  const indexPost = await getPostBySubdomainAndSlug(cleanSub, "index");
  if (indexPost && indexPost.status === "published" && indexPost.htmlContent) {
    return new Response(indexPost.htmlContent, {
      status: 200,
      headers: EDGE_RESPONSE_HEADERS
    });
  }

  const subRecord = await getSubdomainRecord(cleanSub);
  if (!subRecord) {
    return new Response(renderUnclaimedSubdomainHtml(cleanSub), {
      status: 404,
      headers: EDGE_RESPONSE_HEADERS
    });
  }

  const posts = await listPostsBySubdomain(cleanSub);
  const directoryHtml = renderSubdomainDirectoryHtml(subRecord, posts);
  return new Response(directoryHtml, {
    status: 200,
    headers: EDGE_RESPONSE_HEADERS
  });
}

export async function handleSubdomainSlugRequest(subdomain, slug) {
  const cleanSub = String(subdomain || "").toLowerCase().trim();
  const cleanSlug = String(slug || "index").toLowerCase().trim();
  const post = await getPostBySubdomainAndSlug(cleanSub, cleanSlug);

  if (post && post.htmlContent) {
    return new Response(post.htmlContent, {
      status: 200,
      headers: EDGE_RESPONSE_HEADERS
    });
  }

  return new Response(renderUnclaimedSubdomainHtml(cleanSub), {
    status: 404,
    headers: EDGE_RESPONSE_HEADERS
  });
}
