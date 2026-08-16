"use client";

import { useState } from "react";

type Finding = {
  severity: "High" | "Medium" | "Low";
  title: string;
  file?: string;
};

type Summary = {
  totalFiles: number;
  sourceFiles: number;
  dependencyFiles: number;
  sensitiveFiles: number;
  largeFiles: number;
};

/**
 * Node-link view of the repository's real composition.
 * NOTE: /api/analysis/[id] does not return the actual file tree, only
 * aggregate counts + findings — so this graphs those real categories and
 * real flagged files, rather than inventing a fake folder structure.
 */
export default function RepositoryGraph({
  repoName,
  summary,
  findings,
}: {
  repoName: string;
  summary: Summary;
  findings: Finding[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const categories = [
    { key: "source", label: "Source Files", value: summary.sourceFiles, color: "#5b9dff" },
    { key: "deps", label: "Dependencies", value: summary.dependencyFiles, color: "#9dff72" },
    { key: "sensitive", label: "Sensitive Files", value: summary.sensitiveFiles, color: "#fbbf24" },
    { key: "large", label: "Large Files", value: summary.largeFiles, color: "#f97373" },
  ].filter((c) => c.value > 0);

  const flaggedFiles = findings.filter((f) => f.file);
  const cx = 260;
  const cy = 210;
  const catRadius = 130;
  const fileRadius = 230;

  const severityColor: Record<string, string> = {
    High: "#f97373",
    Medium: "#fbbf24",
    Low: "#9dff72",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="text-base font-semibold text-white">Repository Composition</h2>
      <p className="mt-1 text-xs text-gray-500">
        Real category counts and flagged files from this analysis. Hover or tap a node.
      </p>

      <svg viewBox="0 0 520 420" className="mt-4 w-full" role="img" aria-label="Repository composition graph">
        {categories.map((c, i) => {
          const angle = (i / categories.length) * 2 * Math.PI - Math.PI / 2;
          const x = cx + catRadius * Math.cos(angle);
          const y = cy + catRadius * Math.sin(angle);
          return (
            <line
              key={`line-${c.key}`}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={active === c.key ? c.color : "rgba(255,255,255,0.12)"}
              strokeWidth={active === c.key ? 2 : 1}
            />
          );
        })}

        {flaggedFiles.map((f, i) => {
          const angle = (i / Math.max(flaggedFiles.length, 1)) * 2 * Math.PI - Math.PI / 2 + 0.3;
          const x = cx + fileRadius * Math.cos(angle);
          const y = cy + fileRadius * Math.sin(angle);
          return (
            <line
              key={`fline-${i}`}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          );
        })}

        <circle cx={cx} cy={cy} r={34} fill="rgba(157,255,114,0.08)" stroke="#9dff72" strokeWidth={1.5} />
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="10" fill="#9dff72" fontWeight={600}>
          {repoName.length > 14 ? repoName.slice(0, 13) + "…" : repoName}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fill="#6b7280">
          {summary.totalFiles} files
        </text>

        {categories.map((c, i) => {
          const angle = (i / categories.length) * 2 * Math.PI - Math.PI / 2;
          const x = cx + catRadius * Math.cos(angle);
          const y = cy + catRadius * Math.sin(angle);
          const r = 18 + Math.min(14, c.value / 5);
          return (
            <g
              key={c.key}
              onMouseEnter={() => setActive(c.key)}
              onMouseLeave={() => setActive(null)}
              style={{ cursor: "default" }}
            >
              <circle cx={x} cy={y} r={r} fill={`${c.color}22`} stroke={c.color} strokeWidth={1.5} />
              <text x={x} y={y - 2} textAnchor="middle" fontSize="11" fill={c.color} fontWeight={700}>
                {c.value}
              </text>
              <text x={x} y={y + r + 12} textAnchor="middle" fontSize="9" fill="#9ca3af">
                {c.label}
              </text>
            </g>
          );
        })}

        {flaggedFiles.map((f, i) => {
          const angle = (i / Math.max(flaggedFiles.length, 1)) * 2 * Math.PI - Math.PI / 2 + 0.3;
          const x = cx + fileRadius * Math.cos(angle);
          const y = cy + fileRadius * Math.sin(angle);
          const color = severityColor[f.severity] || "#9ca3af";
          return (
            <g key={`fnode-${i}`}>
              <circle cx={x} cy={y} r={5} fill={color} opacity={0.85}>
                <title>{`${f.severity}: ${f.file}`}</title>
              </circle>
            </g>
          );
        })}
      </svg>

      {flaggedFiles.length === 0 && categories.length === 0 && (
        <p className="mt-2 text-xs text-gray-500">No categorized files to display yet.</p>
      )}
    </div>
  );
}
