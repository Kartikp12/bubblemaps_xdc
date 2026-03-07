import { useRouter } from "next/router";

export function MetricsPageHeader() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-lg bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 ring-1 ring-slate-700/60 transition hover:bg-slate-700/80"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-100">XDC Network Metrics</h1>
      </div>
    </div>
  );
}

export default MetricsPageHeader;
