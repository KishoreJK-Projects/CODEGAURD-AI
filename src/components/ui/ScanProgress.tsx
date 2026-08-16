"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

const STEPS = [
  "Connecting to GitHub",
  "Fetching repository",
  "Inspecting files",
  "Analyzing dependencies",
  "Scanning security risks",
  "Generating AI insights",
  "Analysis complete",
];

interface ScanProgressProps {
  /** Whether the real API request has completed */
  done?: boolean;
  /** Error message from the real API, if any */
  error?: string;
}

export default function ScanProgress({ done = false, error }: ScanProgressProps) {
  const [step, setStep] = useState(0);

  /* Cosmetic step progression — NOT claiming to reflect real backend stages.
     Steps 0-5 are purely UI; step 6 activates only when `done` prop becomes true. */
  useEffect(() => {
    if (done || error) return;
    if (step >= STEPS.length - 2) return; // Hold at step 5 until real response arrives

    const delay = step === 0 ? 300 : step < 3 ? 600 : 900;
    const t = setTimeout(() => setStep((s) => s + 1), delay);
    return () => clearTimeout(t);
  }, [step, done, error]);

  // Advance to "complete" only when the real fetch finishes
  useEffect(() => {
    if (done) setStep(STEPS.length - 1);
  }, [done]);

  if (error) {
    return (
      <div className="scan-container">
        <div className="scan-orb" style={{ borderColor: "var(--red-border)", background: "var(--red-dim)" }}>
          <ShieldCheck size={28} color="var(--red)" />
        </div>
        <p style={{ color: "var(--red)", fontSize: 14, fontWeight: 600 }}>Analysis failed</p>
        <p style={{ color: "var(--text-3)", fontSize: 13 }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="scan-container" aria-live="polite" aria-label="Repository scan progress">
      {/* Orb */}
      <div style={{ position: "relative" }}>
        <div className="scan-orb">
          {step === STEPS.length - 1
            ? <CheckCircle2 size={30} color="var(--green)" />
            : <ShieldCheck size={28} color="var(--green)" />
          }
          {step < STEPS.length - 1 && <div className="scan-beam" />}
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`scan-step ${i === step ? "active" : i < step ? "done" : ""}`}
            style={{ opacity: i > step + 1 ? 0.3 : 1 }}
          >
            {i < step ? (
              <CheckCircle2 size={14} color="var(--green)" />
            ) : i === step ? (
              <span
                style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "var(--green)",
                  display: "inline-block",
                  animation: "glow-breathe 1s ease-in-out infinite",
                }}
              />
            ) : (
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--text-4)", display: "inline-block" }} />
            )}
            {s}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "var(--text-4)", marginTop: 8 }}>
        Visual progress indicator — actual analysis runs server-side
      </p>
    </div>
  );
}
