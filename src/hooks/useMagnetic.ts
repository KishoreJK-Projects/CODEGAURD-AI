"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Subtle magnetic pull toward the cursor for important CTAs.
 * Disabled for prefers-reduced-motion and coarse (touch) pointers.
 */
export function useMagnetic<T extends HTMLElement>(strength = 16) {
  const ref = useRef<T | null>(null);
  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const reset = () =>
      setStyle({
        transform: "translate(0px, 0px)",
        transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      const radius = Math.max(rect.width, rect.height) * 1.5;

      if (dist < radius) {
        const pull = (1 - dist / radius) * (strength / 100);
        setStyle({
          transform: `translate(${dx * pull}px, ${dy * pull}px)`,
          transition: "transform 0.12s ease-out",
        });
      } else {
        reset();
      }
    };

    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);

    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, [strength]);

  return { ref, style };
}
