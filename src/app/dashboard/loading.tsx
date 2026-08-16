export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#06080c] p-6 text-[#f2f4f7] md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="skeleton h-4 w-28" />
          <div className="skeleton h-10 w-72" />
          <div className="skeleton h-4 w-96" />
        </div>

        {/* Counter Skeleton */}
        <div className="mt-8 flex gap-3">
          <div className="skeleton h-8 w-32 rounded-full" />
        </div>

        {/* Bento / Grid Skeleton */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="glass-panel flex flex-col justify-between p-6 space-y-4"
              style={{ minHeight: 220 }}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="skeleton h-6 w-40" />
                  <div className="skeleton h-5 w-16 rounded-md" />
                </div>
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-8 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
