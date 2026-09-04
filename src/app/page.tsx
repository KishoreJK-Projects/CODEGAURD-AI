"use client";

import { useState } from "react";
import Link from "next/link";
import { useMagnetic } from "@/hooks/useMagnetic";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  Code2,
  GitBranch,
  Github,
  LockKeyhole,
  Menu,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
  Zap,
  Activity,
  ChevronRight,
  Layers
} from "lucide-react";
import AuroraBackground from "@/components/effects/AuroraBackground";
import ParticleField from "@/components/effects/ParticleField";
import AICore from "@/components/effects/AICore";
import SpotlightCard from "@/components/ui/SpotlightCard";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const heroCta = useMagnetic<HTMLAnchorElement>();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06080c] text-[#f2f4f7]">
      {/* Dynamic Backgrounds */}
      <AuroraBackground />
      <ParticleField />

      {/* Navigation */}
      <header className="nav-glass">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="nav-logo" aria-label="CodeGuard AI Home">
            <div className="nav-logo-mark">
              <ShieldCheck size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.02em]">
              CodeGuard<span className="text-[#7fff6e]">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main Navigation">
            <a href="#platform" className="nav-link">Platform</a>
            <a href="#intelligence" className="nav-link">AI Engine</a>
            <a href="#security" className="nav-link">Security</a>
            <a href="#developers" className="nav-link">Developers</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => {
                const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true });
                window.dispatchEvent(event);
              }}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-[#9aa3af] transition hover:border-white/20 hover:text-white"
              aria-label="Open command palette"
            >
              <span>Command Palette</span>
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-white/70">Ctrl+K</kbd>
            </button>
            <a
              href="/api/auth/signin/github"
              className="btn btn-primary"
            >
              <Github size={15} /> Connect GitHub
            </a>
            <Link
              href="/dashboard"
              className="btn btn-ghost"
            >
              Dashboard <ArrowRight size={14} />
            </Link>
          </div>

          <button
            className="rounded-lg border border-white/10 p-2 text-[#9aa3af] md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-x-4 top-20 z-50 rounded-2xl border border-white/10 bg-[#0a0d13]/95 p-5 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-3">
            <a
              href="#platform"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-[#9aa3af] transition hover:bg-white/5 hover:text-white"
            >
              Platform
            </a>
            <a
              href="#intelligence"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-[#9aa3af] transition hover:bg-white/5 hover:text-white"
            >
              AI Engine
            </a>
            <a
              href="#security"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-[#9aa3af] transition hover:bg-white/5 hover:text-white"
            >
              Security
            </a>
            <a
              href="#developers"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-[#9aa3af] transition hover:bg-white/5 hover:text-white"
            >
              Developers
            </a>
            <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-4">
              <a href="/api/auth/signin/github" className="btn btn-primary w-full">
                <Github size={15} /> Connect GitHub
              </a>
              <Link href="/dashboard" className="btn btn-ghost w-full">
                Go to Dashboard
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-6 pt-28 pb-16 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="eyebrow mb-6">
              <span className="pulse-dot" />
              Autonomous Code Intelligence & Security
            </div>

            <h1 className="hero-tagline">
              <span className="kinetic-word" style={{ ["--delay" as string]: "0.1s" }}>Ship</span>{" "}
              <span className="kinetic-word" style={{ ["--delay" as string]: "0.2s" }}>better</span>{" "}
              <span className="kinetic-word" style={{ ["--delay" as string]: "0.3s" }}>code.</span>
              <span className="block text-[#7fff6e]">
                <span className="kinetic-word" style={{ ["--delay" as string]: "0.4s" }}>With</span>{" "}
                <span className="kinetic-word" style={{ ["--delay" as string]: "0.5s" }}>intelligence.</span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#9aa3af] sm:text-lg">
              CodeGuard AI analyzes your entire GitHub repositories, scans sensitive file vectors,
              computes real-time health scores, and delivers actionable AI security insights.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                ref={heroCta.ref}
                style={heroCta.style}
                href="/api/auth/signin/github"
                className="btn btn-primary lg"
              >
                <Github size={17} /> Connect GitHub <ArrowRight size={15} />
              </a>
              <Link href="/dashboard" className="btn btn-ghost lg">
                <Terminal size={16} /> Open Dashboard
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-6 text-xs text-[#62707e]">
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-[#7fff6e]" /> Zero code execution
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-[#7fff6e]" /> Server-side security
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Check size={14} className="text-[#7fff6e]" /> Real-time GitHub sync
              </span>
            </div>
          </div>

          {/* Futuristic AI Core Visual */}
          <div className="flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#7fff6e]/10 to-[#5fb4ff]/10 blur-2xl opacity-60" />
              <div className="glass-panel relative p-6 sm:p-8">
                <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs text-[#62707e]">
                  <span className="flex items-center gap-2 font-mono">
                    <span className="h-2 w-2 rounded-full bg-[#7fff6e] animate-pulse" />
                    ENGINE_STATUS: ACTIVE
                  </span>
                  <span className="font-mono">v1.0.0</span>
                </div>
                <AICore />
                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4 text-center">
                  <div className="rounded-lg bg-white/[0.02] p-2">
                    <div className="text-[10px] uppercase text-[#62707e]">Accuracy</div>
                    <div className="text-xs font-semibold text-[#7fff6e]">Deterministic</div>
                  </div>
                  <div className="rounded-lg bg-white/[0.02] p-2">
                    <div className="text-[10px] uppercase text-[#62707e]">Privacy</div>
                    <div className="text-xs font-semibold text-[#5fb4ff]">Airgapped</div>
                  </div>
                  <div className="rounded-lg bg-white/[0.02] p-2">
                    <div className="text-[10px] uppercase text-[#62707e]">Speed</div>
                    <div className="text-xs font-semibold text-[#b794ff]">Sub-second</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.015] py-4">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 text-xs uppercase tracking-[0.16em] text-[#9aa3af] sm:grid-cols-4 lg:px-8">
          <span className="flex items-center justify-center gap-2"><Github size={15} className="text-[#7fff6e]" /> GitHub Native OAuth</span>
          <span className="flex items-center justify-center gap-2"><LockKeyhole size={15} className="text-[#5fb4ff]" /> Zero Token Leakage</span>
          <span className="flex items-center justify-center gap-2"><BrainCircuit size={15} className="text-[#b794ff]" /> Gemini 1.5 Engine</span>
          <span className="flex items-center justify-center gap-2"><ShieldCheck size={15} className="text-[#7fff6e]" /> Static Code Security</span>
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="platform" className="relative z-10 mx-auto max-w-7xl px-6 py-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow mb-4">
            <span className="pulse-dot" /> Unified Architecture
          </div>
          <h2 className="text-heading">Engineered for security from the first commit.</h2>
          <p className="mt-4 text-body text-[#9aa3af]">
            CodeGuard transforms raw GitHub repositories into actionable intelligence, prioritizing vulnerabilities before pull requests merge.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <SpotlightCard className="feature-card flex flex-col justify-between">
            <div>
              <div className="icon-box icon-box-green feature-card-icon">
                <BrainCircuit size={22} />
              </div>
              <span className="font-mono text-xs font-semibold text-[#7fff6e]">01 // DEEP SCAN</span>
              <h3 className="mt-3 text-lg font-bold text-white">Repository Tree Analysis</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#9aa3af]">
                Recursively audits file structure, categorizing source code, dependency manifests, sensitive files, and uncommitted artifacts.
              </p>
            </div>
          </SpotlightCard>

          <SpotlightCard className="feature-card flex flex-col justify-between">
            <div>
              <div className="icon-box icon-box-red feature-card-icon">
                <LockKeyhole size={22} />
              </div>
              <span className="font-mono text-xs font-semibold text-[#ff6b6b]">02 // VULNERABILITY</span>
              <h3 className="mt-3 text-lg font-bold text-white">Secret & Pattern Detection</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#9aa3af]">
                Identifies exposed certificates, private keys, dangerous configuration files, and unprotected credential vectors.
              </p>
            </div>
          </SpotlightCard>

          <SpotlightCard className="feature-card flex flex-col justify-between">
            <div>
              <div className="icon-box icon-box-blue feature-card-icon">
                <Zap size={22} />
              </div>
              <span className="font-mono text-xs font-semibold text-[#5fb4ff]">03 // AI REMEDIATION</span>
              <h3 className="mt-3 text-lg font-bold text-white">Actionable AI Insights</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#9aa3af]">
                Feeds sanitized findings into Gemini models for targeted impact assessments, prevention strategies, and safe refactor snippets.
              </p>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* AI Intelligence Showcase */}
      <section id="intelligence" className="relative z-10 mx-auto max-w-7xl px-6 pb-28 lg:px-8">
        <div className="glass-panel grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <div className="icon-box icon-box-blue mb-6">
              <BrainCircuit size={22} />
            </div>
            <span className="section-kicker">AI Code Copilot</span>
            <h2 className="mt-3 text-subheading sm:text-heading">
              Understand root causes, not just alarm bells.
            </h2>
            <p className="mt-4 text-body">
              Every flagged security risk is accompanied by AI explanations detailing potential exploit vectors and precise remediation code.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-[#9aa3af]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7fff6e]/10 text-[#7fff6e]">✓</div>
                <span>Strict privacy boundary — no keys or tokens sent to AI</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#9aa3af]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5fb4ff]/10 text-[#5fb4ff]">✓</div>
                <span>Deterministic scoring combined with LLM explanations</span>
              </div>
            </div>
          </div>

          {/* Interactive Mock Code Snippet */}
          <div className="rounded-2xl border border-white/10 bg-[#080b10] p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff6b6b]/80" />
                <span className="h-3 w-3 rounded-full bg-[#ffd060]/80" />
                <span className="h-3 w-3 rounded-full bg-[#7fff6e]/80" />
                <span className="ml-2 font-mono text-xs text-[#62707e]">auth/session.ts</span>
              </div>
              <span className="badge badge-red">High Risk</span>
            </div>

            <div className="code-block mt-4 text-xs">
              <div className="text-[#62707e]">// Flagged pattern: hardcoded JWT fallback</div>
              <div><span className="code-purple">const</span> SECRET = process.env.SECRET || <span className="code-string">&quot;default_dev_key&quot;</span>;</div>
              <div className="mt-2"><span className="code-purple">export function</span> <span className="code-blue">verifyToken</span>(token: string) &#123;</div>
              <div className="pl-4">return jwt.verify(token, SECRET);</div>
              <div>&#125;</div>
            </div>

            <div className="ai-panel mt-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#5fb4ff]">
                <Sparkles size={14} /> AI Recommendation
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#9aa3af]">
                Fallback secret permits signature forging if environment variable fails to load. Enforce mandatory runtime validation:
              </p>
              <div className="mt-2 rounded bg-black/40 p-2 font-mono text-[11px] text-[#7fff6e]">
                if (!process.env.SECRET) throw new Error(&quot;MISSING_AUTH_SECRET&quot;);
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Analytics Bento Grid */}
      <section id="security" className="relative z-10 mx-auto max-w-7xl px-6 pb-28 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Security Risk Vector Overview */}
          <SpotlightCard className="p-8">
            <div className="icon-box icon-box-red mb-6">
              <ShieldCheck size={22} />
            </div>
            <span className="section-kicker text-[#ff6b6b]">Security Telemetry</span>
            <h3 className="mt-2 text-2xl font-semibold">Pre-Merge Risk Mitigation</h3>
            <p className="mt-3 text-sm text-[#9aa3af]">
              Live classification of repositories according to vulnerability density.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                <div className="flex items-center gap-3">
                  <span className="severity-dot severity-high" />
                  <div>
                    <div className="text-xs font-medium text-white">Sensitive Credentials</div>
                    <div className="font-mono text-[10px] text-[#62707e]">.env, .pem, private keys</div>
                  </div>
                </div>
                <span className="badge badge-red">High Priority</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                <div className="flex items-center gap-3">
                  <span className="severity-dot severity-medium" />
                  <div>
                    <div className="text-xs font-medium text-white">Missing Lockfiles</div>
                    <div className="font-mono text-[10px] text-[#62707e]">package-lock, yarn.lock</div>
                  </div>
                </div>
                <span className="badge badge-yellow">Medium Priority</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                <div className="flex items-center gap-3">
                  <span className="severity-dot severity-low" />
                  <div>
                    <div className="text-xs font-medium text-white">Large Binaries</div>
                    <div className="font-mono text-[10px] text-[#62707e]">Blobs &gt; 5MB</div>
                  </div>
                </div>
                <span className="badge badge-green">Low Priority</span>
              </div>
            </div>
          </SpotlightCard>

          {/* Quality & Health Matrix */}
          <SpotlightCard className="p-8">
            <div className="icon-box icon-box-green mb-6">
              <BarChart3 size={22} />
            </div>
            <span className="section-kicker">Engineering Health</span>
            <h3 className="mt-2 text-2xl font-semibold">Deterministic Scoring Engine</h3>
            <p className="mt-3 text-sm text-[#9aa3af]">
              CodeGuard aggregates security signals (60%) and code quality indicators (40%) into a unified score.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <div className="text-3xl font-bold text-[#7fff6e]">60%</div>
                <div className="mt-1 text-xs text-[#9aa3af]">Security Weight</div>
                <div className="mt-2 font-mono text-[10px] text-[#62707e]">High (-20) Med (-10)</div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <div className="text-3xl font-bold text-[#5fb4ff]">40%</div>
                <div className="mt-1 text-xs text-[#9aa3af]">Quality Weight</div>
                <div className="mt-2 font-mono text-[10px] text-[#62707e]">Tests, Docs, Hygiene</div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between text-xs text-[#9aa3af]">
                <span>Automated Formula</span>
                <span className="font-mono text-[#7fff6e]">Score = Sec(0.6) + Qual(0.4)</span>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* Developers Final CTA */}
      <section id="developers" className="relative z-10 mx-auto max-w-7xl px-6 pb-32 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#7fff6e]/20 bg-gradient-to-b from-[#7fff6e]/[0.05] to-transparent p-10 text-center sm:p-16">
          <div className="absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-[#7fff6e]/10 blur-[100px]" />
          <div className="relative mx-auto max-w-2xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7fff6e]/10 text-[#7fff6e]">
              <Sparkles size={24} />
            </div>
            <h2 className="mt-6 text-heading font-semibold">
              Secure your engineering pipeline today.
            </h2>
            <p className="mt-4 text-body">
              Connect your GitHub account with read-only permissions and run live audits across all your repositories in seconds.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href="/api/auth/signin/github" className="btn btn-primary lg">
                <Github size={17} /> Connect GitHub Account
              </a>
              <Link href="/dashboard" className="btn btn-ghost lg">
                Open Command Center
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#06080c] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs text-[#62707e] sm:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#7fff6e]" />
            <span>&copy; {new Date().getFullYear()} CodeGuard AI. Production-grade Repository Intelligence.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition">Platform</Link>
            <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub ↗</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
