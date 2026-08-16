"use client";

type Scores = { codeGuardScore: number; securityScore: number; codeQuality: number };
type Summary = { sensitiveFiles: number; largeFiles: number };

/**
 * 4 axes, all real or clearly-derived from real values — nothing invented:
 * - Security / Code Quality / CodeGuard Score: direct from AnalysisResult.scores
 * - File Hygiene: derived as 100 minus a penalty for real sensitive/large file counts
 */
export default function SecurityRadar({ scores, summary }: { scores: Scores; summary: Summary }) {
  const fileHygiene = Math.max(
    0,
    100 - summary.sensitiveFiles * 15 - summary.largeFiles * 5
  );

  const axes = [
    { label: "Security", value: scores.securityScore },
    { label: "Code Quality", value: scores.codeQuality },
    { label: "CodeGuard Score", value: scores.codeGuardScore },
    { label: "File Hygiene", value: fileHygiene },
  ];

  const cx = 140;
  const cy = 140;
  const r = 100;
  const angleFor = (i: number) => (i / axes.length) * 2 * Math.PI - Math.PI / 2;

  const point = (i: number, value: number) => {
    const a = angleFor(i);
    const dist = (Math.max(0, Math.min(100, value)) / 100) * r;
    return [cx + dist * Math.cos(a), cy + dist * Math.sin(a)];
  };

  const polygonPoints = axes.map((ax, i) => point(i, ax.value).join(",")).join(" ");

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="text-base font-semibold text-white">Security Radar</h2>
      <p className="mt-1 text-xs text-gray-500">
        Real scores, plus a hygiene score derived from real sensitive/large-file counts.
      </p>

      <svg viewBox="0 0 280 280" className="mx-auto mt-4 w-full max-w-[280px]" role="img" aria-label="Security radar chart">
        {[0.25, 0.5, 0.75, 1].map((ring) => (
          <polygon
            key={ring}
            points={axes.map((_, i) => point(i, ring * 100).join(",")).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        ))}

        {axes.map((ax, i) => {
          const [x, y] = point(i, 100);
          return (
            <line key={ax.label} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          );
        })}

        <polygon points={polygonPoints} fill="rgba(157,255,114,0.15)" stroke="#9dff72" strokeWidth={2} />

        {axes.map((ax, i) => {
          const [x, y] = point(i, ax.value);
          return <circle key={ax.label} cx={x} cy={y} r={3.5} fill="#9dff72" />;
        })}

        {axes.map((ax, i) => {
          const [lx, ly] = point(i, 122);
          return (
            <text
              key={ax.label}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill="#9ca3af"
            >
              {ax.label} ({Math.round(ax.value)})
            </text>
          );
        })}
      </svg>
    </div>
  );
}
