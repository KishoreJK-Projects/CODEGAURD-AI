"use client";

import { useEffect, useRef } from "react";

const NODES = [
  { id: "github",   label: "GitHub",      angle: 0,    color: "#f2f4f7" },
  { id: "security", label: "Security",    angle: 72,   color: "#ff6b6b" },
  { id: "quality",  label: "Code Quality",angle: 144,  color: "#7fff6e" },
  { id: "ai",       label: "AI Engine",   angle: 216,  color: "#5fb4ff" },
  { id: "analytics",label: "Analytics",   angle: 288,  color: "#b794ff" },
];

const R_ORBIT = 120; // orbit radius from center
const SIZE    = 320; // svg viewBox size
const CX      = SIZE / 2;
const CY      = SIZE / 2;

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function nodePos(angle: number) {
  return {
    x: CX + R_ORBIT * Math.cos(toRad(angle - 90)),
    y: CY + R_ORBIT * Math.sin(toRad(angle - 90)),
  };
}

export default function AICore() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Animate the orbit ring rotation via CSS var
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    let angle = 0;
    let raf = 0;
    const tick = () => {
      angle = (angle + 0.08) % 360;
      svgRef.current?.style.setProperty("--core-angle", `${angle}deg`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-label="AI Core visualization showing GitHub, Security, Code Quality, AI Engine and Analytics connected to the central intelligence hub"
      role="img"
      style={{ position: "relative", width: "100%", maxWidth: SIZE, margin: "0 auto" }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        <defs>
          {/* Core glow */}
          <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#7fff6e" stopOpacity="0.35" />
            <stop offset="60%"  stopColor="#7fff6e" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#7fff6e" stopOpacity="0" />
          </radialGradient>
          {/* Orbit ring gradient */}
          <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#7fff6e" stopOpacity="0.5" />
            <stop offset="50%"  stopColor="#5fb4ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#b794ff" stopOpacity="0.1" />
          </linearGradient>
          {/* Beam gradient */}
          <linearGradient id="beam-green" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#7fff6e" stopOpacity="0" />
            <stop offset="50%"  stopColor="#7fff6e" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7fff6e" stopOpacity="0" />
          </linearGradient>
          {/* Pulse ring filter */}
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Node glow */}
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Outer glow blob */}
        <circle cx={CX} cy={CY} r={R_ORBIT + 40} fill="url(#core-grad)" />

        {/* Orbit ring */}
        <circle
          cx={CX} cy={CY}
          r={R_ORBIT}
          fill="none"
          stroke="rgba(127,255,110,0.12)"
          strokeWidth="1"
          strokeDasharray="4 8"
          style={{ transformOrigin: `${CX}px ${CY}px`, transform: "rotate(var(--core-angle, 0deg))" }}
        />

        {/* Connection lines from center to nodes */}
        {NODES.map((n) => {
          const { x, y } = nodePos(n.angle);
          return (
            <line
              key={`line-${n.id}`}
              x1={CX} y1={CY} x2={x} y2={y}
              stroke={n.color}
              strokeOpacity="0.12"
              strokeWidth="1"
            />
          );
        })}

        {/* Animated data pulses */}
        {NODES.map((n, i) => {
          const { x, y } = nodePos(n.angle);
          const len = Math.sqrt((x-CX)**2 + (y-CY)**2);
          return (
            <line
              key={`pulse-${n.id}`}
              x1={CX} y1={CY} x2={x} y2={y}
              stroke={n.color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.7"
              strokeDasharray={`6 ${len}`}
              strokeDashoffset={len}
              filter="url(#glow-green)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from={len}
                to={-len}
                dur={`${2.5 + i * 0.4}s`}
                repeatCount="indefinite"
                calcMode="linear"
              />
            </line>
          );
        })}

        {/* Core inner rings */}
        <circle cx={CX} cy={CY} r={38} fill="rgba(127,255,110,0.04)" stroke="rgba(127,255,110,0.25)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={26} fill="rgba(127,255,110,0.06)" stroke="rgba(127,255,110,0.4)" strokeWidth="1">
          <animate attributeName="r" values="24;28;24" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Core center */}
        <circle cx={CX} cy={CY} r={16} fill="rgba(127,255,110,0.15)" stroke="rgba(127,255,110,0.8)" strokeWidth="1.5" filter="url(#glow-green)" />

        {/* Core label */}
        <text
          x={CX} y={CY - 4}
          textAnchor="middle"
          fill="rgba(127,255,110,0.9)"
          fontSize="7"
          fontWeight="700"
          letterSpacing="0.12em"
          fontFamily="system-ui"
        >
          CODE
        </text>
        <text
          x={CX} y={CY + 6}
          textAnchor="middle"
          fill="rgba(127,255,110,0.9)"
          fontSize="7"
          fontWeight="700"
          letterSpacing="0.12em"
          fontFamily="system-ui"
        >
          GUARD
        </text>

        {/* Satellite nodes */}
        {NODES.map((n) => {
          const { x, y } = nodePos(n.angle);
          const isLeft = x < CX - 10;
          return (
            <g key={n.id} filter="url(#node-glow)">
              <circle cx={x} cy={y} r={16} fill="rgba(10,14,20,0.9)" stroke={n.color} strokeWidth="1" strokeOpacity="0.5" />
              <circle cx={x} cy={y} r={4} fill={n.color} fillOpacity="0.9" />
              <text
                x={isLeft ? x - 22 : x + 22}
                y={y + 4}
                textAnchor={isLeft ? "end" : "start"}
                fill="rgba(255,255,255,0.6)"
                fontSize="9"
                fontFamily="system-ui"
                fontWeight="600"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
