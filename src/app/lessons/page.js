"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Sparkles,
  Copy,
  Check,
  Award,
  ArrowRight
} from "lucide-react";
import CreatorShell from "@/components/CreatorShell";
import { CREATOR_LESSONS } from "@/lib/lessonsData";

export default function CreatorAcademyPage() {
  const [activeLesson, setActiveLesson] = useState(CREATOR_LESSONS[0]);
  const [completedIds, setCompletedIds] = useState(["lesson-01"]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("myfapost_academy_progress_v3");
      if (saved) {
        try {
          setCompletedIds(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, []);

  const toggleComplete = (id) => {
    const next = completedIds.includes(id)
      ? completedIds.filter((item) => item !== id)
      : [...completedIds, id];
    setCompletedIds(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("myfapost_academy_progress_v3", JSON.stringify(next));
    }
  };

  const copySnippet = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(activeLesson.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const progressPct = Math.round((completedIds.length / CREATOR_LESSONS.length) * 100);

  return (
    <CreatorShell
      title="Creator Academy & Technical Curriculum"
      subtitle="Master zero-cost wildcard subdomain architecture, standalone HTML5 payloads, SEO engineering, and Firebase Spark optimization."
    >
      <div className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl btn-electric flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              Curriculum Mastery: {completedIds.length} of {CREATOR_LESSONS.length} Modules Completed ({progressPct}%)
            </div>
            <div className="text-xs text-slate-400">
              Progress is automatically persisted in your browser workspace.
            </div>
          </div>
        </div>
        <div className="w-full sm:w-64 h-2.5 bg-[#07090f] rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-2.5">
          {CREATOR_LESSONS.map((les) => {
            const isCurrent = activeLesson.id === les.id;
            const isDone = completedIds.includes(les.id);
            return (
              <button
                key={les.id}
                onClick={() => {
                  setActiveLesson(les);
                  setSelectedAnswer(null);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition ${
                  isCurrent
                    ? "bg-indigo-500/15 border-indigo-500 text-white shadow-glow"
                    : "bg-[#0d111c] border-white/10 text-slate-300 hover:border-white/25"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-indigo-400">
                    MODULE {les.number} · {les.level}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{les.duration}</span>
                  </span>
                </div>
                <div className="text-sm font-bold text-white">{les.title}</div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8 glass-card rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="font-mono text-xs text-indigo-400 uppercase">
                MODULE {activeLesson.number} · {activeLesson.level}
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                {activeLesson.title}
              </h2>
            </div>
            <button
              onClick={() => toggleComplete(activeLesson.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                completedIds.includes(activeLesson.id)
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "btn-electric text-white"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {completedIds.includes(activeLesson.id)
                  ? "Completed ✓"
                  : "Mark Module Complete"}
              </span>
            </button>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">{activeLesson.summary}</p>

          <div className="space-y-2.5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-300">
              Architectural Key Takeaways
            </h3>
            {activeLesson.keyTakeaways.map((pt, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[#07090f] border border-white/10 flex items-start gap-3 text-xs sm:text-sm text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400">
                Reference Implementation Snippet
              </span>
              <button
                onClick={copySnippet}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-indigo-300"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Code"}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#05070c] border border-white/10 font-mono text-xs text-emerald-200 overflow-x-auto">
              {activeLesson.codeSnippet}
            </pre>
          </div>

          <div className="p-5 rounded-2xl bg-[#07090f] border border-indigo-500/30 space-y-3">
            <div className="text-xs font-mono uppercase text-indigo-400">
              Interactive Knowledge Verification
            </div>
            <div className="text-sm font-bold text-white">{activeLesson.quizQuestion}</div>
            <div className="space-y-2">
              {activeLesson.quizOptions.map((opt, idx) => {
                const chosen = selectedAnswer === idx;
                const isCorrect = idx === activeLesson.correctOptionIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedAnswer(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                      chosen
                        ? isCorrect
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-200"
                          : "bg-rose-500/20 border-rose-500 text-rose-200"
                        : "bg-[#0d111c] border-white/10 text-slate-300 hover:border-white/25"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              href="/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-electric text-xs font-bold"
            >
              <span>Apply This Lesson in Studio Editor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </CreatorShell>
  );
}
