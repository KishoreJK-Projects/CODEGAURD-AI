"use client";

import { useState } from "react";

type Finding = {
  severity: "High" | "Medium" | "Low";
  title: string;
  description: string;
  file?: string;
};

const SEVERITY_STYLE: Record<Finding["severity"], { bg: string; border: string; text: string; scale: number }> = {
  High: { bg: "rgba(249,115,115,0.18)", border: "#f97373", text: "#fca5a5", scale: 1 },
  Medium: { bg: "rgba(251,191,36,0.14)", border: "#fbbf24", text: "#fde68a", scale: 0.85 },
  Low: { bg: "rgba(157,255,114,0.1)", border: "#9dff72", text: "#bbf7d0", scale: 0.7 },
};

/** Real findings only — one cell per real finding, no synthetic entries. */
export default function ThreatHeatmap({ findings }: { findings: Finding[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (findings.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-base font-semibold text-white">Threat Heatmap</h2>
        <p className="mt-3 text-sm text-gray-400">No findings detected — nothing to display.</p>
      </div>
    );
  }

  const ordered = [...findings].sort((a, b) => {
    const rank = { High: 0, Medium: 1, Low: 2 };
    return rank[a.severity] - rank[b.severity];
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="text-base font-semibold text-white">Threat Heatmap</h2>
      <p className="mt-1 text-xs text-gray-500">
        One cell per real finding — size and intensity scale with severity.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {ordered.map((finding, i) => {
          const style = SEVERITY_STYLE[finding.severity];
          const isOpen = openIndex === i;
          return (
            <button
              key={i}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="rounded-lg border p-3 text-left transition hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-white/30"
              style={{
                background: style.bg,
                borderColor: style.border,
                width: `${64 + style.scale * 48}px`,
                height: `${64 + style.scale * 48}px`,
              }}
              title={`${finding.severity}: ${finding.title}`}
            >
              <span className="block text-[10px] font-semibold uppercase" style={{ color: style.text }}>
                {finding.severity}
              </span>
            </button>
          );
        })}
      </div>

      {openIndex !== null && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-semibold text-white">{ordered[openIndex].title}</p>
          <p className="mt-1 text-xs text-gray-400">{ordered[openIndex].description}</p>
          {ordered[openIndex].file && (
            <p className="mt-2 font-mono text-[11px] text-gray-500">{ordered[openIndex].file}</p>
          )}
        </div>
      )}
    </div>
  );
}
