"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Globe,
  Lock,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ArrowRight,
  Clock,
  Terminal
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROOT_DOMAIN, PUBLICATION_CATEGORIES } from "@/lib/constants";
import { checkSubdomainAvailability } from "@/lib/firebase";

function calculatePasswordEntropy(pwd) {
  if (!pwd) return { score: 0, label: "Enter Password", color: "bg-slate-700" };
  let score = 0;
  if (pwd.length >= 8) score += 30;
  if (pwd.length >= 12) score += 20;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 20;
  if (/\d/.test(pwd)) score += 15;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 15;

  if (score >= 80) return { score: 100, label: "High Entropy (96-bit)", color: "bg-emerald-500" };
  if (score >= 50) return { score: 65, label: "Moderate Entropy", color: "bg-indigo-500" };
  return { score: 30, label: "Weak Entropy", color: "bg-amber-500" };
}

function AuthPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialClaim = searchParams.get("claim") || "cyberpulse-lab";

  const { registerWithSubdomain, loginWithEmail, loginWithOAuth } = useAuth();

  const [mode, setMode] = useState("signup");
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex.rivera@myfa.page");
  const [password, setPassword] = useState("Sovereign#Edge2026!");
  const [subdomain, setSubdomain] = useState(initialClaim);
  const [publicationName, setPublicationName] = useState("CyberPulse Labs");
  const [category, setCategory] = useState("Tech & AI");
  const [availability, setAvailability] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!subdomain.trim()) return;
      const res = await checkSubdomainAvailability(subdomain);
      setAvailability(res);
    }, 200);
    return () => clearTimeout(t);
  }, [subdomain]);

  const entropy = calculatePasswordEntropy(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (mode === "signup" && step === 1) {
      setStep(2);
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        await registerWithSubdomain({
          email,
          password,
          displayName,
          subdomain,
          publicationName,
          category
        });
      } else {
        await loginWithEmail({ email, password });
      }
      router.push("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = async (provider) => {
    setErrorMsg("");
    try {
      await loginWithOAuth(provider);
      router.push("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "OAuth sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen obsidian-radial-bg py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-white/15 bg-[#0d111c] shadow-2xl">
        <div className="lg:col-span-6 p-8 sm:p-10 bg-gradient-to-br from-[#0d111c] via-[#11172a] to-[#07090f] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 font-mono text-xs text-indigo-300">
              <span>INDEPENDENT CREATOR NETWORK</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Claim your digital sovereignty in seconds.
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Join 14,200+ engineers, security researchers, and independent journalists publishing standalone HTML5 dispatches on custom{" "}
              <code className="font-mono text-emerald-300">*.{ROOT_DOMAIN}</code> subdomains.
            </p>

            <div className="p-5 rounded-2xl bg-[#07090f]/90 border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">TechBuzz Chronicle</span>
                <span className="font-mono text-emerald-400">tech-radar.{ROOT_DOMAIN}</span>
              </div>
              <div className="text-base font-bold text-indigo-200">
                Beyond Transformer Archetypes: Spatial Memory Frameworks
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="font-mono text-sm font-bold text-white">1.8k</div>
                  <div className="text-[10px] text-slate-400">Subscribers</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="font-mono text-sm font-bold text-emerald-400">+34.2%</div>
                  <div className="text-[10px] text-slate-400">MoM Reach</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="font-mono text-sm font-bold text-indigo-300">0.32s</div>
                  <div className="text-[10px] text-slate-400">Edge TTFB</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
              &ldquo;Moving TechRadar Dispatch to a dedicated MyfaPost subdomain cut our global page load times to 180ms and eliminated our VPS hosting bills completely.&rdquo;
            </p>
            <div className="flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Elena Rostova</div>
                <div className="text-slate-400">Editor-in-Chief, tech-radar.{ROOT_DOMAIN}</div>
              </div>
              <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Node
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 p-8 sm:p-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-[#07090f] p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setStep(1);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  mode === "signup"
                    ? "btn-electric text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  mode === "signin"
                    ? "btn-electric text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
            </div>

            {mode === "signup" && (
              <div className="flex items-center gap-2 font-mono text-xs">
                <span
                  className={`px-2 py-0.5 rounded ${
                    step === 1
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-400"
                  }`}
                >
                  1. Account
                </span>
                <span>→</span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    step === 2
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-slate-400"
                  }`}
                >
                  2. Subdomain
                </span>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 font-mono">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && step === 1 && (
              <>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Creator Full Name / Byline
                  </label>
                  <div className="flex items-center bg-[#07090f] border border-white/10 rounded-xl px-3.5 py-2.5">
                    <User className="w-4 h-4 text-slate-400 mr-2.5" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <div className="flex items-center bg-[#07090f] border border-white/10 rounded-xl px-3.5 py-2.5">
                    <Mail className="w-4 h-4 text-slate-400 mr-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono uppercase text-slate-400">Password</span>
                    <span className="font-mono text-emerald-400">{entropy.label}</span>
                  </div>
                  <div className="flex items-center bg-[#07090f] border border-white/10 rounded-xl px-3.5 py-2.5">
                    <Lock className="w-4 h-4 text-slate-400 mr-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div className="w-full h-1.5 bg-[#07090f] rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all ${entropy.color}`}
                      style={{ width: `${entropy.score}%` }}
                    />
                  </div>
                </div>
              </>
            )}

            {mode === "signup" && step === 2 && (
              <>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs font-mono text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>15-Minute Handle Reservation Lock Active</span>
                  </span>
                  <span>STEP 2 OF 2</span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Claim Your Custom Wildcard Subdomain
                  </label>
                  <div className="flex items-center bg-[#07090f] border border-indigo-500/40 rounded-xl px-3.5 py-2.5">
                    <Globe className="w-4 h-4 text-indigo-400 mr-2" />
                    <input
                      type="text"
                      required
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                      className="w-full bg-transparent font-mono text-sm text-white focus:outline-none"
                    />
                    <span className="font-mono text-xs text-slate-400 pl-2 border-l border-white/10">
                      .{ROOT_DOMAIN}
                    </span>
                  </div>

                  {availability && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-mono">
                      {availability.available ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-300">{availability.reason}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-amber-400" />
                          <span className="text-amber-300">{availability.reason}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Publication Display Title
                  </label>
                  <input
                    type="text"
                    required
                    value={publicationName}
                    onChange={(e) => setPublicationName(e.target.value)}
                    className="w-full bg-[#07090f] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Primary Publication Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PUBLICATION_CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left transition ${
                          category === cat.id
                            ? "bg-indigo-500/20 border-indigo-500 text-white"
                            : "bg-[#07090f] border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {mode === "signin" && (
              <>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#07090f] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#07090f] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
              </>
            )}

            <div className="flex items-center gap-3 pt-2">
              {mode === "signup" && step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300"
                >
                  ← Back
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-xl btn-electric font-bold text-sm flex items-center justify-center gap-2 shadow-glow"
              >
                <span>
                  {mode === "signin"
                    ? "Sign In to Creator OS"
                    : step === 1
                    ? "Continue to Claim Subdomain"
                    : `Claim ${subdomain}.${ROOT_DOMAIN} & Launch`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="relative py-2">
            <div className="border-t border-white/10" />
            <span className="absolute left-1/2 -translate-x-1/2 -top-1 bg-[#0d111c] px-3 text-[11px] font-mono text-slate-400">
              OR CONTINUE WITH OAUTH
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="py-2.5 px-4 rounded-xl bg-[#07090f] hover:bg-white/5 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Google OAuth</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("github")}
              className="py-2.5 px-4 rounded-xl bg-[#07090f] hover:bg-white/5 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>GitHub OAuth</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-mono text-slate-400">Loading Authentication...</div>}>
      <AuthPageInner />
    </Suspense>
  );
}
