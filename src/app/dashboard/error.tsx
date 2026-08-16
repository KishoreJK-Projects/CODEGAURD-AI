"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error securely
    console.error("Dashboard error boundary caught:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06080c] p-6 text-[#f2f4f7]">
      <div className="glass-panel max-w-md p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff6b6b]/10 text-[#ff6b6b]">
          <AlertTriangle size={28} />
        </div>

        <h1 className="mt-5 text-xl font-bold">Failed to load repositories</h1>
        <p className="mt-2 text-sm text-[#9aa3af]">
          {error.message || "An unexpected error occurred while communicating with GitHub."}
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <button onClick={() => reset()} className="btn btn-primary">
            <RefreshCw size={14} /> Try again
          </button>
          <Link href="/" className="btn btn-ghost">
            <Home size={14} /> Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
