import { formatValue } from "../../lib/metricFormatters";

export function MetricCard({ label, value, type = "number" }) {
  
  return (
    <div className="rounded-xl bg-slate-900/80 p-4 ring-1 ring-slate-700/60">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-100">{formatValue(value, type)}</p>
      
    </div>
  );
}

export default MetricCard;
