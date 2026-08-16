"use client";

import Link from "next/link";
import { AlertOctagon, RefreshCw, LayoutDashboard } from "lucide-react";

export default function AnalysisError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06080c] p-6 text-[#f2f4f7]">
      <div className="glass-panel max-w-md p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff6b6b]/10 text-[#ff6b6b]">
          <AlertOctagon size={28} />
        </div>

        <h1 className="mt-5 text-xl font-bold">Analysis Terminated</h1>
        <p className="mt-2 text-sm text-[#9aa3af]">
          {error.message || "Unable to complete repository inspection."}
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <button onClick={() => reset()} className="btn btn-primary">
            <RefreshCw size={14} /> Retry Audit
          </button>
          <Link href="/dashboard" className="btn btn-ghost">
            <LayoutDashboard size={14} /> Repositories
          </Link>
        </div>
      </div>
    </main>
  );
}
