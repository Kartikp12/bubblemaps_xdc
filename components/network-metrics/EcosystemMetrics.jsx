import MetricCard from "./MetricCard";
import MetricsSection from "./MetricsSection";

export function EcosystemMetrics({ metrics }) {
  if (!metrics) return null;
  return (
    <MetricsSection title="Ecosystem Metrics">
      <MetricCard label="Ecosystem TVL" value={metrics.ecosystem_tvl} type="usd_compact" />
      <MetricCard
        label="Ecosystem DEX Trading Volume"
        value={metrics.ecosystem_dex_trading_volume}
        type="usd_compact"
      />
    </MetricsSection>
  );
}

export default EcosystemMetrics;
