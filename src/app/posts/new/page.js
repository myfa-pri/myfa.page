"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PostStudioEditor from "@/components/PostStudioEditor";

function NewPostStudioInner() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  return <PostStudioEditor initialPost={null} templateId={templateId} />;
}

export default function NewPostPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-mono text-slate-400">Loading Studio Editor...</div>}>
      <NewPostStudioInner />
    </Suspense>
  );
}
