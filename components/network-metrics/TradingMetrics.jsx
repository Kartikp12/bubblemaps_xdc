import MetricCard from "./MetricCard";
import MetricsSection from "./MetricsSection";

export function TradingMetrics({ metrics }) {
  if (!metrics) return null;
  return (
    <MetricsSection title="Trading Metrics">
      <MetricCard
        label="Token Trading Volume"
        value={metrics.token_trading_volume}
        type="usd_compact"
      />
      <MetricCard
        label="Token Turnover (Circulating)"
        value={metrics.token_turnover_circulating}
        type="compact"
      />
      <MetricCard
        label="Token Turnover (Fully Diluted)"
        value={metrics.token_turnover_fully_diluted}
        type="compact"
      />
    </MetricsSection>
  );
}

export default TradingMetrics;
