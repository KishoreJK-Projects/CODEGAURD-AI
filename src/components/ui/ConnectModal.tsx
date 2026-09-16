"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Github, Zap, Key, ArrowRight, X, ShieldCheck, User } from "lucide-react";

type ConnectModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  const [username, setUsername] = useState("kaisejan");
  const [token, setToken] = useState("");
  const [tab, setTab] = useState<"instant" | "custom" | "oauth">("instant");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickConnect = async (customUser?: string) => {
    setLoading(true);
    try {
      await signIn("quick-connect", {
        username: (customUser || username || "kaisejan").trim(),
        token: token.trim(),
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOAuth = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0d14] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7fff6e]/10 text-[#7fff6e] ring-1 ring-[#7fff6e]/30">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Connect to CodeGuard AI</h3>
              <p className="text-xs text-[#9aa3af]">Choose your preferred connection method</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#9aa3af] transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1 text-xs font-medium">
          <button
            onClick={() => setTab("instant")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition ${
              tab === "instant"
                ? "bg-[#7fff6e]/15 text-[#7fff6e] shadow-sm"
                : "text-[#9aa3af] hover:text-white"
            }`}
          >
            <Zap size={13} /> 1-Click Fast
          </button>
          <button
            onClick={() => setTab("custom")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition ${
              tab === "custom"
                ? "bg-[#5fb4ff]/15 text-[#5fb4ff] shadow-sm"
                : "text-[#9aa3af] hover:text-white"
            }`}
          >
            <User size={13} /> Any Username
          </button>
          <button
            onClick={() => setTab("oauth")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition ${
              tab === "oauth"
                ? "bg-purple-500/15 text-purple-400 shadow-sm"
                : "text-[#9aa3af] hover:text-white"
            }`}
          >
            <Github size={13} /> OAuth App
          </button>
        </div>

        {/* Tab 1: Instant 1-Click */}
        {tab === "instant" && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-[#7fff6e]/20 bg-[#7fff6e]/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7fff6e]/10 text-[#7fff6e] font-bold text-base">
                  K
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">kaisejan</div>
                  <div className="text-xs text-[#9aa3af]">Instant access to your GitHub repositories</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleQuickConnect("kaisejan")}
              disabled={loading}
              className="btn btn-primary w-full justify-center py-3 text-sm font-semibold"
            >
              {loading ? (
                <span className="flex items-center gap-2">Connecting...</span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap size={16} /> Launch Dashboard as @kaisejan <ArrowRight size={15} />
                </span>
              )}
            </button>
          </div>
        )}

        {/* Tab 2: Custom Username or Token */}
        {tab === "custom" && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9aa3af]">
                GitHub Username
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#62707e]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. kaisejan or torvalds"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-4 text-sm text-white placeholder-[#62707e] focus:border-[#5fb4ff]/50 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9aa3af]">
                Personal Access Token <span className="text-[#62707e]">(Optional, for private repos)</span>
              </label>
              <div className="relative">
                <Key size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#62707e]" />
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_... (optional)"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-4 text-sm text-white placeholder-[#62707e] focus:border-[#5fb4ff]/50 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => handleQuickConnect()}
              disabled={loading || !username.trim()}
              className="btn btn-primary w-full justify-center py-2.5 text-sm font-semibold"
            >
              {loading ? "Connecting..." : "Connect Account"}
            </button>
          </div>
        )}

        {/* Tab 3: Standard GitHub OAuth */}
        {tab === "oauth" && (
          <div className="mt-6 space-y-4 text-center">
            <p className="text-xs leading-relaxed text-[#9aa3af]">
              Authenticate directly with your configured GitHub OAuth Application with full repository access permissions.
            </p>

            <button
              onClick={handleOAuth}
              className="btn btn-primary w-full justify-center py-3 text-sm font-semibold"
            >
              <Github size={16} /> Sign in via GitHub OAuth <ArrowRight size={15} />
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-[11px] text-[#62707e]">
          🔒 CodeGuard operates in a strictly sandboxed, read-only analysis environment.
        </div>
      </div>
    </div>
  );
}
