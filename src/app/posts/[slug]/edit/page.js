"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getPostBySubdomainAndSlug } from "@/lib/firebase";
import PostStudioEditor from "@/components/PostStudioEditor";

export default function EditExistingPostPage() {
  const params = useParams();
  const { activeSubdomain } = useAuth();
  const [loadedPost, setLoadedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
    getPostBySubdomainAndSlug(activeSubdomain, rawSlug || "webassembly-cloudflare-edge").then(
      (docData) => {
        if (!active) return;
        if (docData) {
          setLoadedPost(docData);
        } else {
          setLoadedPost({
            subdomain: activeSubdomain,
            slug: rawSlug || "custom-dispatch",
            title: `Dispatch: ${rawSlug || "Custom Article"}`,
            excerpt: "Editing existing standalone dispatch on MyfaPost Creator OS.",
            category: "Tech & AI",
            tags: ["Tech", "Edge"],
            status: "published",
            editorMode: "markdown",
            markdownBody: `# Editing ${rawSlug}

Update your Markdown or switch to Raw \`index.html\` mode to customize your standalone page.`
          });
        }
        setLoading(false);
      }
    );
    return () => {
      active = false;
    };
  }, [params, activeSubdomain]);

  if (loading) {
    return (
      <div className="min-h-screen obsidian-radial-bg flex items-center justify-center font-mono text-sm text-indigo-300">
        Loading {activeSubdomain}__{params?.slug} from Edge Store...
      </div>
    );
  }

  return <PostStudioEditor initialPost={loadedPost} />;
}
