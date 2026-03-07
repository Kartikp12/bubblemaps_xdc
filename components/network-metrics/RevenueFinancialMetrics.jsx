import MetricCard from "./MetricCard";
import MetricsSection from "./MetricsSection";

function getPeriodLabel(timeRange) {
  const labels = { daily: "Daily", weekly: "Weekly", monthly: "Monthly", quarterly: "Quarterly" };
  return labels[timeRange] ?? "Daily";
}

export function RevenueFinancialMetrics({ metrics, timeRange }) {
  if (!metrics) return null;
  const period = getPeriodLabel(timeRange);
  return (
    <MetricsSection title="Revenue & Financial Metrics">
      <MetricCard label={`Fees (${period})`} value={metrics.fees} type="usd_compact" />
      <MetricCard label={`Revenue (${period})`} value={metrics.revenue} type="usd_compact" />
    </MetricsSection>
  );
}

export default RevenueFinancialMetrics;
