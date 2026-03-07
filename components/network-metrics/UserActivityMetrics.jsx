import MetricCard from "./MetricCard";
import MetricsSection from "./MetricsSection";

export function UserActivityMetrics({ metrics, timeRange }) {
  if (!metrics) return null;
  return (
    <MetricsSection title="User Activity Metrics">
      {timeRange === "daily" && (
        <>
          <MetricCard
            label="Active Addresses Daily"
            value={metrics.active_addresses_daily}
            type="integer"
          />
          <MetricCard label="User DAU" value={metrics.user_dau} type="integer" />
        </>
      )}
      {timeRange === "weekly" && (
        <>
          <MetricCard
            label="Active Addresses Weekly"
            value={metrics.active_addresses_weekly}
            type="integer"
          />
          <MetricCard label="User WAU" value={metrics.user_wau} type="integer" />
        </>
      )}
      {timeRange === "monthly" && (
        <>
          <MetricCard
            label="Active Addresses Monthly"
            value={metrics.active_addresses_monthly}
            type="integer"
          />
          <MetricCard label="User MAU" value={metrics.user_mau} type="integer" />
        </>
      )}
      {timeRange === "quarterly" && (
        <>
          <MetricCard
            label="Active Addresses (Quarterly)"
            value={metrics.active_addresses_quarterly ?? metrics.active_addresses_monthly}
            type="integer"
          />
          <MetricCard
            label="Active Users (Quarterly)"
            value={metrics.user_qau ?? metrics.user_mau}
            type="integer"
          />
        </>
      )}
      <MetricCard
        label="Active Developers"
        value={metrics.active_developers}
        type="integer"
      />
      <MetricCard label="Code Commits" value={metrics.code_commits} type="integer" />
    </MetricsSection>
  );
}

export default UserActivityMetrics;
