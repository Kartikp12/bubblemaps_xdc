import { useEffect, useState, useMemo } from "react";
import LayoutShell from "../components/LayoutShell";
import { getDailyRows, aggregateMetrics } from "../lib/aggregateMetrics";
import {
  MetricsPageHeader,
  MetricsFilterBar,
  UserActivityMetrics,
  RevenueFinancialMetrics,
  MarketMetrics,
  TradingMetrics,
  NetworkActivityMetrics,
  EcosystemMetrics,
} from "../components/network-metrics";

export default function TokenTerminalPage() {
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("daily");

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("/api/xdc-metrics");
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Failed to fetch");
        setRawData(json.raw?.data ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  const dailyRows = useMemo(() => getDailyRows(rawData ?? []), [rawData]);

  const metrics = useMemo(
    () => (dailyRows.length > 0 ? aggregateMetrics(dailyRows, timeRange) : null),
    [dailyRows, timeRange]
  );

  const isFallbackGranularity = false;

  const metricsDate = metrics?.datetime ?? metrics?.timestamp ?? metrics?.date ?? null;

  if (loading) {
    return (
      <LayoutShell>
        <div className="flex min-h-screen items-center justify-center px-4">
          <p className="text-slate-400">Loading metrics...</p>
        </div>
      </LayoutShell>
    );
  }

  if (error) {
    return (
      <LayoutShell>
        <div className="flex min-h-screen items-center justify-center px-4">
          <p className="text-red-400">Error: {error}</p>
        </div>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell>
      <div className="min-h-screen overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
          <MetricsPageHeader />

          <MetricsFilterBar
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            metricsDate={metricsDate}
            isFallbackGranularity={isFallbackGranularity}
          />

          {metrics && (
            <div className="space-y-10 pb-12">
              <UserActivityMetrics metrics={metrics} timeRange={timeRange} />
              <RevenueFinancialMetrics metrics={metrics} timeRange={timeRange} />
              <MarketMetrics metrics={metrics} />
              <TradingMetrics metrics={metrics} />
              <NetworkActivityMetrics metrics={metrics} />
              <EcosystemMetrics metrics={metrics} />
            </div>
          )}

          {!metrics && rawData && (
            <p className="py-8 text-slate-500">No metrics available.</p>
          )}
        </div>
      </div>
    </LayoutShell>
  );
}
