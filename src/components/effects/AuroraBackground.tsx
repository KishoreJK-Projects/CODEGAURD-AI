"use client";

export default function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Aurora blob 1 — green */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "55vw",
          height: "55vw",
          maxWidth: 700,
          maxHeight: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(127,255,110,0.13) 0%, rgba(127,255,110,0.04) 50%, transparent 70%)",
          filter: "blur(60px)",
          animation: "aurora-drift 18s ease-in-out infinite",
          animationDelay: "0s",
        }}
      />

      {/* Aurora blob 2 — blue */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "-15%",
          width: "50vw",
          height: "50vw",
          maxWidth: 600,
          maxHeight: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(95,180,255,0.09) 0%, rgba(95,180,255,0.03) 50%, transparent 70%)",
          filter: "blur(80px)",
          animation: "aurora-drift-2 24s ease-in-out infinite",
          animationDelay: "-8s",
        }}
      />

      {/* Aurora blob 3 — violet subtle */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "20%",
          width: "35vw",
          height: "35vw",
          maxWidth: 450,
          maxHeight: 450,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(183,148,255,0.06) 0%, transparent 65%)",
          filter: "blur(70px)",
          animation: "aurora-drift 28s ease-in-out infinite",
          animationDelay: "-14s",
        }}
      />

      {/* Very subtle noise texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        }}
      />
    </div>
  );
}
