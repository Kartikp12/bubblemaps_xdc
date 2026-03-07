import { formatMetricDate } from "../../lib/metricFormatters";
import { GRANULARITIES } from "./constants";

export function MetricsFilterBar({
  timeRange,
  onTimeRangeChange,
  metricsDate,
  isFallbackGranularity,
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl bg-slate-900/60 p-4 ring-1 ring-slate-700/60">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Time range</span>
        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
          className="rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-slate-200 focus:border-slate-500 focus:outline-none"
        >
          {GRANULARITIES.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>
      {metricsDate && (
        <span className="text-sm text-slate-400">
          Data as of {formatMetricDate(metricsDate)}
        </span>
      )}
      {isFallbackGranularity && (
        <span className="text-xs text-amber-400/90">
          Showing latest available data (API did not return {timeRange} granularity)
        </span>
      )}
    </div>
  );
}

export default MetricsFilterBar;
