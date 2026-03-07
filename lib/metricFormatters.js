export function formatCompact(num) {
  const abs = Math.abs(num);
  if (abs >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (abs >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function formatValue(value, type = "number") {
  if (value == null || value === "" || Number.isNaN(Number(value))) return "—";
  const num = Number(value);
  if (type === "price") {
    return "$" + num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }
  if (type === "usd") {
    const abs = Math.abs(num);
    if (abs >= 1e9) return "$" + (num / 1e9).toFixed(2) + "B";
    if (abs >= 1e6) return "$" + (num / 1e6).toFixed(2) + "M";
    if (abs >= 1e3) return "$" + (num / 1e3).toFixed(2) + "K";
    return "$" + num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (type === "usd_compact") {
    const abs = Math.abs(num);
    if (abs >= 1e9) return "$" + (num / 1e9).toFixed(2) + "B";
    if (abs >= 1e6) return "$" + (num / 1e6).toFixed(2) + "M";
    if (abs >= 1e3) return "$" + (num / 1e3).toFixed(2) + "K";
    return "$" + num.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
  if (type === "integer") {
    return Math.round(num).toLocaleString("en-US");
  }
  if (type === "compact") {
    return formatCompact(num);
  }
  if (type === "seconds") {
    const seconds = num / 1000;
    return seconds.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " s";
  }
  if (type === "percentage") {
    const pct = Math.abs(num) > 0 && Math.abs(num) <= 2 ? num * 100 : num;
    return pct.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
  }
  return num.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export function formatMetricDate(datetime) {
  if (!datetime) return "";
  const d = new Date(datetime);
  if (Number.isNaN(d.getTime())) return String(datetime);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
