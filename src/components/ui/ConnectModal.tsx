"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Github, Search, Key, ArrowRight, X, ShieldCheck, Sparkles } from "lucide-react";

type ConnectModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SUGGESTED_ACCOUNTS = [
  "vercel",
  "shadcn",
  "facebook",
  "tailwindlabs",
];

export default function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState<"oauth" | "username">("oauth");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleOAuthConnect = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  const handleUsernameConnect = async (customUser?: string) => {
    const targetUser = (customUser || username).trim();
    if (!targetUser) return;

    setLoading(true);
    try {
      await signIn("quick-connect", {
        username: targetUser,
        token: token.trim(),
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0d14] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7fff6e]/10 text-[#7fff6e] ring-1 ring-[#7fff6e]/30">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Connect to CodeGuard</h3>
              <p className="text-xs text-[#9aa3af]">Analyze GitHub repository security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#9aa3af] transition hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab("oauth")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 transition ${
              activeTab === "oauth"
                ? "bg-[#7fff6e]/15 text-[#7fff6e] shadow-sm font-semibold"
                : "text-[#9aa3af] hover:text-white"
            }`}
          >
            <Github size={14} /> GitHub Account
          </button>
          <button
            onClick={() => setActiveTab("username")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 transition ${
              activeTab === "username"
                ? "bg-[#5fb4ff]/15 text-[#5fb4ff] shadow-sm font-semibold"
                : "text-[#9aa3af] hover:text-white"
            }`}
          >
            <Search size={14} /> Scan Any User / Org
          </button>
        </div>

        {/* Tab 1: GitHub OAuth Login */}
        {activeTab === "oauth" && (
          <div className="mt-6 space-y-4">
            <p className="text-xs leading-relaxed text-[#9aa3af]">
              Authenticate with your GitHub account to analyze all your personal and organization repositories with real-time sync.
            </p>

            <button
              onClick={handleOAuthConnect}
              className="btn btn-primary w-full justify-center py-3 text-sm font-semibold shadow-lg shadow-[#7fff6e]/10"
            >
              <Github size={16} /> Continue with GitHub <ArrowRight size={15} />
            </button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-white/[0.08]" />
              <span className="absolute bg-[#0a0d14] px-3 text-[11px] text-[#62707e]">or explore instantly</span>
            </div>

            <button
              onClick={() => handleUsernameConnect("kaisejan")}
              disabled={loading}
              className="btn btn-ghost w-full justify-center py-2.5 text-xs text-[#9aa3af] hover:text-white"
            >
              <Sparkles size={13} className="text-[#7fff6e]" />
              <span>Explore Demo Showcase</span>
            </button>
          </div>
        )}

        {/* Tab 2: Scan by Username / Org */}
        {activeTab === "username" && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9aa3af]">
                GitHub Username or Organization
              </label>
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#62707e]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUsernameConnect();
                  }}
                  placeholder="e.g. vercel, shadcn, or any username"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#62707e] transition focus:border-[#5fb4ff]/50 focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Quick Suggestion Pills */}
            <div>
              <span className="text-[11px] text-[#62707e]">Popular suggestions:</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {SUGGESTED_ACCOUNTS.map((acc) => (
                  <button
                    key={acc}
                    onClick={() => {
                      setUsername(acc);
                      handleUsernameConnect(acc);
                    }}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2 py-1 text-[11px] text-[#9aa3af] transition hover:border-[#5fb4ff]/40 hover:bg-[#5fb4ff]/10 hover:text-white"
                  >
                    @{acc}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9aa3af]">
                Personal Access Token <span className="text-[#62707e]">(Optional, for private repos)</span>
              </label>
              <div className="relative">
                <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#62707e]" />
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_... (optional)"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#62707e] transition focus:border-[#5fb4ff]/50 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => handleUsernameConnect()}
              disabled={loading || !username.trim()}
              className="btn btn-primary w-full justify-center py-2.5 text-sm font-semibold disabled:opacity-40"
            >
              {loading ? (
                <span className="flex items-center gap-2">Scanning...</span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search size={15} /> Load &amp; Audit Repositories <ArrowRight size={14} />
                </span>
              )}
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 border-t border-white/[0.06] pt-4 text-center text-[11px] text-[#62707e]">
          🔒 CodeGuard operates in a strictly read-only, airgapped analysis environment.
        </div>
      </div>
    </div>
  );
}
