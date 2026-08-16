"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  FileCode,
  Layers,
  Lock,
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileWarning,
  CheckCircle2,
  HardDrive,
  RefreshCw
} from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ScanProgress from "@/components/ui/ScanProgress";
import CountUp from "@/components/ui/CountUp";
import RepositoryGraph from "@/components/ui/RepositoryGraph";
import ActivityFeed from "@/components/ui/ActivityFeed";
import SecurityRadar from "@/components/ui/SecurityRadar";
import ThreatHeatmap from "@/components/ui/ThreatHeatmap";

type Finding = {
  severity: "High" | "Medium" | "Low";
  title: string;
  description: string;
  file?: string;
};

type AnalysisData = {
  repository: {
    id: number;
    name: string;
    fullName: string;
  };
  summary: {
    totalFiles: number;
    sourceFiles: number;
    dependencyFiles: number;
    sensitiveFiles: number;
    largeFiles: number;
  };
  scores: {
    codeGuardScore: number;
    securityScore: number;
    codeQuality: number;
  };
  findings: Finding[];
};

export default function RepositoryAnalysis({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedFindings, setExpandedFindings] = useState<Record<string, boolean>>({});
  const [aiInsights, setAiInsights] = useState<Record<string, { loading: boolean; text?: string; error?: string }>>({});

  useEffect(() => {
    async function loadAnalysis() {
      try {
        const response = await fetch(`/api/analysis/${resolvedParams.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to analyze repository.");
        }

        setAnalysis(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();
  }, [resolvedParams.id]);

  const toggleFinding = (id: string) => {
    setExpandedFindings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchAiInsight = async (finding: Finding, key: string) => {
    if (aiInsights[key]?.text || aiInsights[key]?.loading) return;

    setAiInsights((prev) => ({ ...prev, [key]: { loading: true } }));

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          findingTitle: finding.title,
          findingDescription: finding.description,
          findingSeverity: finding.severity,
          repoName: analysis?.repository?.name,
          file: finding.file,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI service unavailable.");
      }

      setAiInsights((prev) => ({
        ...prev,
        [key]: { loading: false, text: data.insight },
      }));
    } catch (err) {
      setAiInsights((prev) => ({
        ...prev,
        [key]: {
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load insight.",
        },
      }));
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#06080c] p-6 text-[#f2f4f7] md:p-10">
        <div className="mx-auto max-w-6xl">
          <ScanProgress done={false} />
        </div>
      </main>
    );
  }

  if (error || !analysis) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#06080c] p-6 text-[#f2f4f7]">
        <div className="glass-panel max-w-md p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff6b6b]/10 text-[#ff6b6b]">
            <AlertTriangle size={24} />
          </div>
          <h1 className="mt-4 text-xl font-bold">Analysis Failed</h1>
          <p className="mt-2 text-sm text-[#9aa3af]">{error || "Could not analyze repository."}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/dashboard" className="btn btn-primary">
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const severityCounts = {
    High: analysis.findings.filter((f) => f.severity === "High").length,
    Medium: analysis.findings.filter((f) => f.severity === "Medium").length,
    Low: analysis.findings.filter((f) => f.severity === "Low").length,
  };

  return (
    <main className="min-h-screen bg-[#06080c] p-6 text-[#f2f4f7] md:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-medium text-[#9aa3af] transition hover:text-white"
          >
            <ArrowLeft size={14} /> Back to Repositories
          </Link>

          <div className="flex items-center gap-3">
            <span className="badge badge-green flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7fff6e] animate-pulse" />
              Audit Complete
            </span>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-[#9aa3af] hover:text-white"
            >
              <RefreshCw size={12} /> Rescan
            </button>
          </div>
        </div>

        {/* Repository Header */}
        <div className="mt-8">
          <span className="text-label">STATIC AUDIT REPORT</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {analysis.repository.name}
          </h1>
          <p className="mt-1 font-mono text-xs text-[#62707e]">
            {analysis.repository.fullName}
          </p>
        </div>

        {/* Live Score Cards — asymmetric bento: overall score dominates */}
        <div className="mt-8 grid gap-5 md:grid-cols-6">
          {/* CodeGuard Overall Score — dominant card */}
          <SpotlightCard className="p-8 text-center flex flex-col items-center justify-center md:col-span-3 md:row-span-2">
            <div className="text-xs font-semibold text-[#9aa3af] uppercase tracking-wider">
              CodeGuard Overall Score
            </div>
            <div className="my-6">
              <div className="text-7xl font-bold font-mono text-[#7fff6e]">
                <CountUp to={analysis.scores.codeGuardScore} />
                <span className="text-2xl text-[#62707e] font-normal">/100</span>
              </div>
            </div>
            <div className="w-full progress-bar-wrap">
              <div
                className="progress-bar-fill bg-[#7fff6e]"
                style={{ ["--bar-w" as string]: `${analysis.scores.codeGuardScore}%` }}
              />
            </div>
          </SpotlightCard>

          {/* Security Score */}
          <SpotlightCard className="p-5 text-center flex flex-col items-center justify-between md:col-span-3">
            <div className="text-xs font-semibold text-[#9aa3af] uppercase tracking-wider">
              Security Posture Score
            </div>
            <div className="my-3">
              <div className="text-4xl font-bold font-mono text-[#ffd060]">
                <CountUp to={analysis.scores.securityScore} />
                <span className="text-lg text-[#62707e] font-normal">/100</span>
              </div>
            </div>
            <div className="w-full progress-bar-wrap">
              <div
                className="progress-bar-fill bg-[#ffd060]"
                style={{ ["--bar-w" as string]: `${analysis.scores.securityScore}%` }}
              />
            </div>
          </SpotlightCard>

          {/* Code Quality */}
          <SpotlightCard className="p-5 text-center flex flex-col items-center justify-between md:col-span-3">
            <div className="text-xs font-semibold text-[#9aa3af] uppercase tracking-wider">
              Code Quality Index
            </div>
            <div className="my-3">
              <div className="text-4xl font-bold font-mono text-[#5fb4ff]">
                <CountUp to={analysis.scores.codeQuality} suffix="%" />
              </div>
            </div>
            <div className="w-full progress-bar-wrap">
              <div
                className="progress-bar-fill bg-[#5fb4ff]"
                style={{ ["--bar-w" as string]: `${analysis.scores.codeQuality}%` }}
              />
            </div>
          </SpotlightCard>
        </div>

        {/* Live File Breakdown */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between text-xs text-[#62707e]">
              <span>Total Files</span>
              <FileCode size={14} className="text-[#9aa3af]" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono">
              <CountUp to={analysis.summary.totalFiles} />
            </div>
          </div>

          <div className="glass-panel p-4">
            <div className="flex items-center justify-between text-xs text-[#62707e]">
              <span>Source Files</span>
              <FileCode size={14} className="text-[#5fb4ff]" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#5fb4ff]">
              <CountUp to={analysis.summary.sourceFiles} />
            </div>
          </div>

          <div className="glass-panel p-4">
            <div className="flex items-center justify-between text-xs text-[#62707e]">
              <span>Dependencies</span>
              <Layers size={14} className="text-[#b794ff]" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#b794ff]">
              <CountUp to={analysis.summary.dependencyFiles} />
            </div>
          </div>

          <div className="glass-panel p-4">
            <div className="flex items-center justify-between text-xs text-[#62707e]">
              <span>High Risk Signals</span>
              <Lock size={14} className="text-[#ff6b6b]" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#ff6b6b]">
              <CountUp to={analysis.summary.sensitiveFiles} />
            </div>
          </div>

          <div className="glass-panel p-4">
            <div className="flex items-center justify-between text-xs text-[#62707e]">
              <span>Large Blobs &gt;5MB</span>
              <HardDrive size={14} className="text-[#ffd060]" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#ffd060]">
              <CountUp to={analysis.summary.largeFiles} />
            </div>
          </div>
        </div>

        {/* Severity Distribution Heatmap */}
        <section className="mt-8 glass-panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Severity Distribution</h2>
            <span className="text-xs text-[#62707e]">Deterministic Findings Count</span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#ff6b6b]/20 bg-[#ff6b6b]/5 p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#9aa3af]">High Severity</div>
                <div className="mt-1 text-2xl font-bold font-mono text-[#ff6b6b]">
                  {severityCounts.High}
                </div>
              </div>
              <span className="severity-dot severity-high" />
            </div>

            <div className="rounded-xl border border-[#ffd060]/20 bg-[#ffd060]/5 p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#9aa3af]">Medium Severity</div>
                <div className="mt-1 text-2xl font-bold font-mono text-[#ffd060]">
                  {severityCounts.Medium}
                </div>
              </div>
              <span className="severity-dot severity-medium" />
            </div>

            <div className="rounded-xl border border-[#7fff6e]/20 bg-[#7fff6e]/5 p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#9aa3af]">Low Severity</div>
                <div className="mt-1 text-2xl font-bold font-mono text-[#7fff6e]">
                  {severityCounts.Low}
                </div>
              </div>
              <span className="severity-dot severity-low" />
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <SecurityRadar scores={analysis.scores} summary={analysis.summary} />
          <ThreatHeatmap findings={analysis.findings} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <RepositoryGraph
            repoName={analysis.repository.name}
            summary={analysis.summary}
            findings={analysis.findings}
          />
          <ActivityFeed
            repoName={analysis.repository.name}
            summary={analysis.summary}
            scores={analysis.scores}
            findings={analysis.findings}
          />
        </div>

        {/* Security Findings & AI Remediation */}
        <section className="mt-8 glass-panel p-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <h2 className="text-lg font-semibold">Detected Findings &amp; AI Copilot</h2>
              <p className="text-xs text-[#9aa3af]">
                Click any finding to inspect detailed risk assessments and generate server-side AI remediation.
              </p>
            </div>
            <span className="badge badge-ghost font-mono">
              {analysis.findings.length} findings
            </span>
          </div>

          {analysis.findings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7fff6e]/10 text-[#7fff6e]">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">No security vulnerabilities detected</h3>
              <p className="mt-1 text-xs text-[#9aa3af]">
                This repository adheres to standard security and hygiene guidelines for the scanned files.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {analysis.findings.map((finding, idx) => {
                const key = `${finding.severity}-${finding.title}-${idx}`;
                const isExpanded = !!expandedFindings[key];
                const aiState = aiInsights[key];

                return (
                  <div
                    key={key}
                    className={`finding-card ${finding.severity.toLowerCase()}`}
                  >
                    <div
                      onClick={() => toggleFinding(key)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleFinding(key);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      className="finding-header flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`severity-dot severity-${finding.severity.toLowerCase()}`} />
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate text-white">
                            {finding.title}
                          </div>
                          {finding.file && (
                            <span className="finding-file font-mono">
                              {finding.file}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`badge ${
                            finding.severity === "High"
                              ? "badge-red"
                              : finding.severity === "Medium"
                              ? "badge-yellow"
                              : "badge-green"
                          }`}
                        >
                          {finding.severity}
                        </span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="finding-body">
                        <p className="mt-2 text-xs leading-relaxed text-[#9aa3af]">
                          {finding.description}
                        </p>

                        {/* AI Copilot Action */}
                        <div className="mt-4 border-t border-white/[0.06] pt-3">
                          {!aiState?.text && !aiState?.loading && (
                            <button
                              onClick={() => fetchAiInsight(finding, key)}
                              className="btn btn-ghost"
                              style={{ padding: "6px 12px", fontSize: 11 }}
                            >
                              <Sparkles size={13} className="text-[#5fb4ff]" />
                              Generate AI Remediation Guidance
                            </button>
                          )}

                          {aiState?.loading && (
                            <div className="flex items-center gap-2 text-xs text-[#5fb4ff]">
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#5fb4ff] border-t-transparent" />
                              <span>Consulting Gemini AI Copilot...</span>
                            </div>
                          )}

                          {aiState?.error && (
                            <div className="text-xs text-[#ff6b6b] mt-1">
                              {aiState.error}
                            </div>
                          )}

                          {aiState?.text && (
                            <div className="ai-panel mt-3">
                              <div className="flex items-center justify-between text-xs font-semibold text-[#5fb4ff] mb-2">
                                <span className="flex items-center gap-1.5">
                                  <Sparkles size={14} /> AI Security Remediation
                                </span>
                                <span className="text-[10px] text-[#62707e] font-normal">
                                  Sanitized Context Only
                                </span>
                              </div>
                              <div className="text-xs text-[#f2f4f7] leading-relaxed whitespace-pre-line font-mono bg-black/30 p-3 rounded-lg border border-white/5">
                                {aiState.text}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
