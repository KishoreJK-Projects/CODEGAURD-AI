"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Lock,
  Globe,
  ExternalLink,
  Sparkles,
  RefreshCw,
  FolderGit2,
  AlertCircle,
  Code,
  ArrowRight,
  Filter,
  LogOut,
  Layers,
  ChevronRight
} from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import AuroraBackground from "@/components/effects/AuroraBackground";

type Repository = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  language: string | null;
  updatedAt: string;
  private: boolean;
};

// Map languages to aesthetic accent colors
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Dart: "#00B4AB",
};

export default function DashboardOverview() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "public" | "private">("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  async function loadRepositories() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/repositories");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load GitHub repositories.");
      }

      setRepositories(data.repositories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRepositories();
  }, []);

  // Compute unique languages
  const languages = useMemo(() => {
    const langs = new Set<string>();
    repositories.forEach((repo) => {
      if (repo.language) langs.add(repo.language);
    });
    return Array.from(langs).sort();
  }, [repositories]);

  // Filtered repositories
  const filteredRepositories = useMemo(() => {
    return repositories.filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        repo.fullName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesVisibility =
        selectedFilter === "all" ||
        (selectedFilter === "private" && repo.private) ||
        (selectedFilter === "public" && !repo.private);

      const matchesLanguage =
        selectedLanguage === "all" || repo.language === selectedLanguage;

      return matchesSearch && matchesVisibility && matchesLanguage;
    });
  }, [repositories, searchQuery, selectedFilter, selectedLanguage]);

  // Compute stats
  const stats = useMemo(() => {
    const total = repositories.length;
    const privateCount = repositories.filter((r) => r.private).length;
    const publicCount = total - privateCount;
    return { total, privateCount, publicCount, languageCount: languages.length };
  }, [repositories, languages]);

  return (
    <div className="relative min-h-screen bg-[#06080c] text-[#f2f4f7]">
      <AuroraBackground />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#06080c]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 transition opacity-90 hover:opacity-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7fff6e]/10 text-[#7fff6e] ring-1 ring-[#7fff6e]/30">
                <ShieldCheck size={18} strokeWidth={2.5} />
              </div>
              <span className="text-base font-semibold tracking-tight text-white">
                CodeGuard<span className="text-[#7fff6e]">AI</span>
              </span>
            </Link>

            <div className="hidden h-4 w-px bg-white/10 sm:block" />

            <span className="hidden text-xs font-medium text-[#9aa3af] sm:block">
              Repository Security Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true });
                window.dispatchEvent(event);
              }}
              className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-[#9aa3af] transition hover:border-white/20 hover:text-white sm:flex"
            >
              <span>Command Palette</span>
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-white/70">Ctrl+K</kbd>
            </button>

            <button
              onClick={loadRepositories}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[#9aa3af] transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
              title="Refresh repositories"
            >
              <RefreshCw size={13} className={loading ? "animate-spin text-[#7fff6e]" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <a
              href="/api/auth/signout"
              className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome & Stats Banner */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#7fff6e]/20 bg-[#7fff6e]/5 px-3 py-1 text-xs font-medium text-[#7fff6e]">
              <Sparkles size={12} />
              <span>Live GitHub Sync</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Connected Repositories
            </h1>
            <p className="mt-1 text-sm text-[#9aa3af]">
              Select any repository to launch a real-time static security scan, hygiene score evaluation, and AI-powered vulnerability audit.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 backdrop-blur-sm">
              <span className="text-xs text-[#9aa3af]">Total Repos</span>
              <div className="mt-1 text-xl font-bold text-white sm:text-2xl">{stats.total}</div>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 backdrop-blur-sm">
              <span className="text-xs text-[#9aa3af]">Public</span>
              <div className="mt-1 text-xl font-bold text-[#7fff6e] sm:text-2xl">{stats.publicCount}</div>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 backdrop-blur-sm">
              <span className="text-xs text-[#9aa3af]">Private</span>
              <div className="mt-1 text-xl font-bold text-[#5fb4ff] sm:text-2xl">{stats.privateCount}</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa3af]" />
            <input
              type="text"
              placeholder="Search repositories by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#62707e] transition focus:border-[#7fff6e]/50 focus:bg-white/[0.06] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Visibility Toggle */}
            <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.02] p-1 text-xs">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`rounded-lg px-3 py-1.5 font-medium transition ${
                  selectedFilter === "all"
                    ? "bg-white/10 text-white"
                    : "text-[#9aa3af] hover:text-white"
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setSelectedFilter("public")}
                className={`rounded-lg px-3 py-1.5 font-medium transition ${
                  selectedFilter === "public"
                    ? "bg-[#7fff6e]/15 text-[#7fff6e]"
                    : "text-[#9aa3af] hover:text-white"
                }`}
              >
                Public ({stats.publicCount})
              </button>
              <button
                onClick={() => setSelectedFilter("private")}
                className={`rounded-lg px-3 py-1.5 font-medium transition ${
                  selectedFilter === "private"
                    ? "bg-[#5fb4ff]/15 text-[#5fb4ff]"
                    : "text-[#9aa3af] hover:text-white"
                }`}
              >
                Private ({stats.privateCount})
              </button>
            </div>

            {/* Language Dropdown */}
            {languages.length > 0 && (
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#0b0f15] px-3 py-2 text-xs font-medium text-[#9aa3af] transition hover:text-white focus:border-[#7fff6e]/50 focus:outline-none"
              >
                <option value="all">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-32 rounded bg-white/10" />
                  <div className="h-5 w-14 rounded-full bg-white/10" />
                </div>
                <div className="mt-3 h-4 w-48 rounded bg-white/5" />
                <div className="mt-2 h-4 w-36 rounded bg-white/5" />
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="h-4 w-20 rounded bg-white/10" />
                  <div className="h-8 w-24 rounded-lg bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              <AlertCircle size={24} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">
              Unable to Load Repositories
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#9aa3af]">
              {error}
            </p>
            <button
              onClick={loadRepositories}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              <RefreshCw size={14} /> Retry Fetch
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredRepositories.length === 0 && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] text-[#9aa3af]">
              <FolderGit2 size={24} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">
              No matching repositories found
            </h3>
            <p className="mt-1 text-sm text-[#9aa3af]">
              {searchQuery
                ? `No repositories matched "${searchQuery}". Try adjusting your search or filters.`
                : "No GitHub repositories were found under your account."}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("all");
                  setSelectedLanguage("all");
                }}
                className="mt-4 text-xs font-medium text-[#7fff6e] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Repositories Grid */}
        {!loading && !error && filteredRepositories.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRepositories.map((repo) => {
              const langColor =
                (repo.language && LANGUAGE_COLORS[repo.language]) || "#9aa3af";

              return (
                <SpotlightCard
                  key={repo.id}
                  className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0b0f15]/80 p-5 backdrop-blur-sm transition duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-[#7fff6e]/5"
                >
                  <div>
                    {/* Top Row: Title & Visibility Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <FolderGit2 size={16} className="shrink-0 text-[#7fff6e]" />
                        <h2 className="truncate font-semibold text-white transition group-hover:text-[#7fff6e]">
                          {repo.name}
                        </h2>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          repo.private
                            ? "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20"
                            : "bg-white/5 text-[#9aa3af] ring-1 ring-white/10"
                        }`}
                      >
                        {repo.private ? <Lock size={10} /> : <Globe size={10} />}
                        {repo.private ? "Private" : "Public"}
                      </span>
                    </div>

                    {/* Repository Description */}
                    <p className="mt-2.5 line-clamp-2 min-h-[2.5rem] text-xs text-[#9aa3af]">
                      {repo.description || "No description provided for this repository."}
                    </p>

                    {/* Meta info: Language and Updated Date */}
                    <div className="mt-4 flex items-center gap-4 text-xs text-[#62707e]">
                      {repo.language && (
                        <div className="flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: langColor }}
                          />
                          <span className="text-[#9aa3af]">{repo.language}</span>
                        </div>
                      )}
                      <div>
                        Updated {new Date(repo.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#9aa3af] transition hover:text-white"
                      title="View on GitHub"
                    >
                      <span>GitHub</span>
                      <ExternalLink size={12} />
                    </a>

                    <Link
                      href={`/dashboard/${repo.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#7fff6e] px-3.5 py-1.5 text-xs font-semibold text-[#06080c] transition hover:bg-[#92ff83] hover:shadow-lg hover:shadow-[#7fff6e]/20"
                    >
                      <span>Scan & Analyze</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
