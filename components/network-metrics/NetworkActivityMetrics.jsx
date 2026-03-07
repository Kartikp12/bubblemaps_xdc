import MetricCard from "./MetricCard";
import MetricsSection from "./MetricsSection";

export function NetworkActivityMetrics({ metrics }) {
  if (!metrics) return null;
  return (
    <MetricsSection title="Network Activity">
      <MetricCard
        label="Transaction Count"
        value={metrics.transaction_count}
        type="compact"
      />
      <MetricCard
        label="Transactions Per Second"
        value={metrics.transactions_per_second}
        type="number"
      />
      <MetricCard
        label="Transaction Fee (Average)"
        value={metrics.transaction_fee_average}
        type="usd"
      />
      <MetricCard label="Block Time" value={metrics.block_time} type="seconds" />
    </MetricsSection>
  );
}

export default NetworkActivityMetrics;
