"use client";

import { CheckCircle2, GitBranch, ShieldAlert, FileSearch, Gauge } from "lucide-react";

type Finding = { severity: "High" | "Medium" | "Low" };

type Summary = {
  totalFiles: number;
  sourceFiles: number;
  dependencyFiles: number;
  sensitiveFiles: number;
  largeFiles: number;
};

type Scores = { codeGuardScore: number; securityScore: number; codeQuality: number };

/**
 * Every line here is derived directly from the real AnalysisResult for this
 * run — there's no persisted history (no DB yet), so this is a real recap of
 * *this* analysis, not a fabricated multi-day activity log.
 */
export default function ActivityFeed({
  repoName,
  summary,
  scores,
  findings,
}: {
  repoName: string;
  summary: Summary;
  scores: Scores;
  findings: Finding[];
}) {
  const high = findings.filter((f) => f.severity === "High").length;
  const medium = findings.filter((f) => f.severity === "Medium").length;

  const events = [
    {
      icon: GitBranch,
      color: "text-[#9dff72]",
      text: `Fetched ${repoName} — ${summary.totalFiles} files discovered`,
    },
    {
      icon: FileSearch,
      color: "text-blue-300",
      text: `Dependency check complete — ${summary.dependencyFiles} manifest file(s) reviewed`,
    },
    summary.sensitiveFiles > 0
      ? {
          icon: ShieldAlert,
          color: "text-yellow-300",
          text: `${summary.sensitiveFiles} sensitive file(s) flagged for review`,
        }
      : null,
    {
      icon: ShieldAlert,
      color: high > 0 ? "text-red-300" : "text-[#9dff72]",
      text:
        findings.length === 0
          ? "Security scan complete — no findings"
          : `Security scan complete — ${findings.length} finding(s) (${high} high, ${medium} medium)`,
    },
    {
      icon: Gauge,
      color: "text-[#9dff72]",
      text: `CodeGuard Score calculated — ${scores.codeGuardScore}/100 (security ${scores.securityScore}, quality ${scores.codeQuality}%)`,
    },
    {
      icon: CheckCircle2,
      color: "text-[#9dff72]",
      text: "Analysis complete",
    },
  ].filter(Boolean) as { icon: typeof CheckCircle2; color: string; text: string }[];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="text-base font-semibold text-white">Analysis Activity</h2>
      <p className="mt-1 text-xs text-gray-500">Real events from this analysis run.</p>

      <ol className="mt-4 space-y-3">
        {events.map((event, i) => {
          const Icon = event.icon;
          return (
            <li key={i} className="flex items-start gap-3 text-sm">
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${event.color}`} />
              <span className="text-gray-300">{event.text}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
