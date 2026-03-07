import MetricCard from "./MetricCard";
import MetricsSection from "./MetricsSection";

export function MarketMetrics({ metrics }) {
  if (!metrics) return null;
  return (
    <MetricsSection title="Market Metrics">
      <MetricCard label="Price (USD)" value={metrics.price} type="price" />
      <MetricCard
        label="Market Cap (Circulating)"
        value={metrics.market_cap_circulating}
        type="usd_compact"
      />
      <MetricCard
        label="Market Cap (Fully Diluted)"
        value={metrics.market_cap_fully_diluted}
        type="usd_compact"
      />
      <MetricCard
        label="Token Supply (Circulating)"
        value={metrics.token_supply_circulating}
        type="compact"
      />
    </MetricsSection>
  );
}

export default MarketMetrics;
