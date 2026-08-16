"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Github,
  ShieldCheck,
  BrainCircuit,
  Home,
  Search,
  ArrowRight,
} from "lucide-react";

type Command = {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  shortcut?: string[];
  action: () => void;
  group: string;
};

export default function CommandPalette() {
  const router  = useRouter();
  const [open, setOpen]     = useState(false);
  const [query, setQuery]   = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: "home",
      label: "Go to Home",
      description: "Landing page",
      icon: <Home size={14} />,
      group: "Navigation",
      action: () => router.push("/"),
    },
    {
      id: "dashboard",
      label: "Go to Dashboard",
      description: "Your GitHub repositories",
      icon: <LayoutDashboard size={14} />,
      shortcut: ["G", "D"],
      group: "Navigation",
      action: () => router.push("/dashboard"),
    },
    {
      id: "github",
      label: "Connect GitHub",
      description: "Sign in with GitHub OAuth",
      icon: <Github size={14} />,
      group: "Actions",
      action: () => { window.location.href = "/api/auth/signin/github"; },
    },
    {
      id: "security",
      label: "View Security",
      description: "Navigate to security section",
      icon: <ShieldCheck size={14} />,
      group: "Navigation",
      action: () => {
        router.push("/");
        setTimeout(() => document.querySelector("#security")?.scrollIntoView({ behavior: "smooth" }), 100);
      },
    },
    {
      id: "ai",
      label: "AI Intelligence",
      description: "Navigate to AI features",
      icon: <BrainCircuit size={14} />,
      group: "Navigation",
      action: () => {
        router.push("/");
        setTimeout(() => document.querySelector("#intelligence")?.scrollIntoView({ behavior: "smooth" }), 100);
      },
    },
  ];

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          (c.description?.toLowerCase().includes(query.toLowerCase()))
      )
    : commands;

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    (acc[cmd.group] = acc[cmd.group] || []).push(cmd);
    return acc;
  }, {});

  const runSelected = useCallback(() => {
    if (filtered[selected]) {
      filtered[selected].action();
      setOpen(false);
      setQuery("");
    }
  }, [filtered, selected]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setSelected(0);
        setQuery("");
      }
      if (!open) return;
      if (e.key === "Escape") { setOpen(false); setQuery(""); }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected((v) => Math.min(v + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelected((v) => Math.max(v - 1, 0)); }
      if (e.key === "Enter")     { e.preventDefault(); runSelected(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, runSelected]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  if (!open) return null;

  let idx = -1;

  return (
    <div
      className="palette-overlay"
      onClick={() => { setOpen(false); setQuery(""); }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="palette-box" onClick={(e) => e.stopPropagation()}>
        {/* Search input */}
        <div className="palette-input-wrap">
          <Search size={16} style={{ color: "var(--text-3)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            className="palette-input"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Command search"
            autoComplete="off"
          />
          <kbd className="palette-key" style={{ fontSize: 10, color: "var(--text-4)" }}>ESC</kbd>
        </div>

        {/* Command list */}
        <div className="palette-list" role="listbox">
          {Object.entries(grouped).map(([group, cmds]) => (
            <div key={group}>
              <div className="palette-section">{group}</div>
              {cmds.map((cmd) => {
                idx++;
                const currentIdx = idx;
                return (
                  <button
                    key={cmd.id}
                    role="option"
                    aria-selected={selected === currentIdx}
                    className={`palette-item${selected === currentIdx ? " selected" : ""}`}
                    onMouseEnter={() => setSelected(currentIdx)}
                    onClick={() => { cmd.action(); setOpen(false); setQuery(""); }}
                  >
                    <span className="palette-item-icon">{cmd.icon}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "block", fontWeight: 500, fontSize: 13 }}>{cmd.label}</span>
                      {cmd.description && (
                        <span style={{ fontSize: 11, color: "var(--text-3)" }}>{cmd.description}</span>
                      )}
                    </span>
                    {cmd.shortcut && (
                      <span className="palette-kbd">
                        {cmd.shortcut.map((k) => <span key={k} className="palette-key">{k}</span>)}
                      </span>
                    )}
                    <ArrowRight size={12} style={{ color: "var(--text-4)", flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>
              No commands found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        <div className="palette-footer">
          <span><kbd className="palette-key">↑↓</kbd> navigate</span>
          <span><kbd className="palette-key">↵</kbd> select</span>
          <span><kbd className="palette-key">ESC</kbd> close</span>
          <span style={{ marginLeft: "auto" }}>
            <kbd className="palette-key">⌘</kbd><kbd className="palette-key">K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
