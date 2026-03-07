/**
 * Normalize granularity from API row (day/daily/WEEK/weekly etc. -> daily/weekly/monthly/quarterly).
 */
function getRowGranularity(row) {
  const raw =
    row.granularity ??
    row.granularity_id ??
    row.interval ??
    row.period ??
    row.range ??
    row.aggregation;
  if (raw == null || raw === "") return "daily";
  const r = String(raw).toLowerCase().trim();
  if (r === "day" || r === "daily" || r === "d") return "daily";
  if (r === "week" || r === "weekly" || r === "w") return "weekly";
  if (r === "month" || r === "monthly" || r === "m") return "monthly";
  if (r === "quarter" || r === "quarterly" || r === "q") return "quarterly";
  if (r === "year" || r === "yearly") return "yearly";
  return r;
}

/**
 * Get sort key (timestamp) from a row for ordering.
 */
function getRowDate(row) {
  const raw = row.datetime ?? row.timestamp ?? row.date ?? row.time;
  if (!raw) return 0;
  const t = new Date(raw).getTime();
  return Number.isNaN(t) ? 0 : t;
}

/** Metric keys to SUM over the period (e.g. last 7/30/90 days). */
const SUM_KEYS = [
  "fees",
  "revenue",
  "transaction_count",
  "code_commits",
  "token_trading_volume",
  "token_turnover_circulating",
  "token_turnover_fully_diluted",
  "active_developers",
  "active_addresses_daily",
  "user_dau",
  "ecosystem_dex_trading_volume",
];

/** Metric keys to AVERAGE over the period. */
const AVG_KEYS = ["transactions_per_second", "block_time"];

/** Metric keys to take from latest row only (point-in-time). */
const LATEST_KEYS = [
  "datetime",
  "timestamp",
  "date",
  "price",
  "market_cap_circulating",
  "market_cap_fully_diluted",
  "token_supply_circulating",
  "ecosystem_tvl",
  "active_addresses_weekly",
  "active_addresses_monthly",
  "active_addresses_quarterly",
  "user_wau",
  "user_mau",
  "user_qau",
  "transaction_fee_average",
];

/**
 * Get daily-granularity rows from raw data, sorted by date descending (newest first).
 */
export function getDailyRows(rawData) {
  if (!Array.isArray(rawData) || !rawData.length) return [];
  const daily = rawData.filter((row) => getRowGranularity(row) === "daily");
  const rows = daily.length > 0 ? daily : rawData;
  return [...rows].sort((a, b) => getRowDate(b) - getRowDate(a));
}

/**
 * Safe numeric add (treats null/undefined/NaN as 0).
 */
function add(a, b) {
  const x = Number(a);
  const y = Number(b);
  if (Number.isNaN(x) && Number.isNaN(y)) return null;
  return (Number.isNaN(x) ? 0 : x) + (Number.isNaN(y) ? 0 : y);
}

/**
 * Aggregate rows into a single metrics object.
 * - daily: 1 row
 * - weekly: sum/avg over first 7 rows
 * - monthly: sum/avg over first 30 rows
 * - quarterly: sum/avg over first 90 rows
 * Point-in-time fields (price, market_cap, etc.) come from the latest row of the slice.
 */
export function aggregateMetrics(dailyRows, timeRange) {
  if (!Array.isArray(dailyRows) || !dailyRows.length) return null;
  const range = timeRange?.toLowerCase() ?? "daily";
  const limits = { daily: 1, weekly: 7, monthly: 30, quarterly: 90 };
  const n = Math.min(dailyRows.length, limits[range] ?? 1);
  const slice = dailyRows.slice(0, n);
  const latest = slice[0];

  const out = {};

  for (const key of LATEST_KEYS) {
    if (latest[key] !== undefined) out[key] = latest[key];
  }

  for (const key of SUM_KEYS) {
    let sum = null;
    for (const row of slice) {
      const v = row[key];
      if (v != null && v !== "") sum = add(sum, v);
    }
    if (sum !== null) out[key] = sum;
  }

  for (const key of AVG_KEYS) {
    let sum = null;
    let count = 0;
    for (const row of slice) {
      const v = row[key];
      if (v != null && v !== "" && !Number.isNaN(Number(v))) {
        sum = add(sum, v);
        count += 1;
      }
    }
    if (count > 0 && sum !== null) out[key] = sum / count;
  }

  // Map summed active_addresses_daily / user_dau to period-specific keys for UI
  if (range === "weekly") {
    if (out.active_addresses_daily != null) out.active_addresses_weekly = out.active_addresses_daily;
    if (out.user_dau != null) out.user_wau = out.user_dau;
  }
  if (range === "monthly") {
    if (out.active_addresses_daily != null) out.active_addresses_monthly = out.active_addresses_daily;
    if (out.user_dau != null) out.user_mau = out.user_dau;
  }
  if (range === "quarterly") {
    if (out.active_addresses_daily != null) out.active_addresses_quarterly = out.active_addresses_daily;
    if (out.user_dau != null) out.user_qau = out.user_dau;
  }

  return out;
}
