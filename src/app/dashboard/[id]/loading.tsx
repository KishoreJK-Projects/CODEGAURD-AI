import ScanProgress from "@/components/ui/ScanProgress";

export default function RepositoryAnalysisLoading() {
  return (
    <main className="min-h-screen bg-[#06080c] p-6 text-[#f2f4f7] md:p-10">
      <div className="mx-auto max-w-6xl">
        <ScanProgress done={false} />
      </div>
    </main>
  );
}
