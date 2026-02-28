import React from "react";
import { motion } from "framer-motion";

function formatPct(value) {
  if (!Number.isFinite(value)) return "0%";
  if (value >= 1) return `${value.toFixed(2)}%`;
  return `${value.toFixed(3)}%`;
}

export function AddressSidebar({ holders, filters, onToggleFilter, onSelect, selected }) {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    let list = holders ?? [];
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter((h) => h.address.toLowerCase().includes(term));
    }
    return list.slice(0, 200);
  }, [holders, search]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass-panel-soft flex h-[420px] flex-col rounded-3xl border border-slate-800/60 bg-slate-950/90 p-4 shadow-2xl md:h-[520px]"
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Address List
          </h3>
        </div>
      </div>

      <div className="mb-3 flex gap-2 text-[11px] text-slate-300">
        {["contracts", "cex", "dex"].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onToggleFilter(key)}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 ring-1 text-[11px] ${
              filters[key]
                ? "bg-fuchsia-500/30 text-slate-50 ring-fuchsia-400/70"
                : "bg-slate-900/80 text-slate-400 ring-slate-700/80"
            }`}
          >
            <span
              className={`h-3 w-3 rounded-[6px] ${
                filters[key] ? "bg-fuchsia-400" : "bg-slate-600"
              }`}
            />
            <span className="uppercase tracking-[0.18em]">{key}</span>
          </button>
        ))}
      </div>

      <div className="mb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search address"
          className="w-full rounded-full bg-slate-900/80 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 ring-1 ring-slate-700/80 focus:outline-none focus:ring-fuchsia-500/70"
        />
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto pt-1 text-xs">
        {filtered.map((h, idx) => (
          <button
            type="button"
            key={h.address}
            onClick={() => onSelect(h)}
            className={`mb-1.5 flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left transition ${
              selected && selected.address === h.address
                ? "bg-fuchsia-500/25 ring-1 ring-fuchsia-400/80"
                : "bg-slate-900/60 hover:bg-slate-800/90"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-5 text-[10px] text-slate-500">#{idx + 1}</span>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-slate-200">
                  {h.address.slice(0, 8)}...{h.address.slice(-6)}
                </span>
                <span className="text-[10px] text-slate-500">
                  {formatPct(h.percentage)} of supply
                </span>
              </div>
            </div>
            <div className="text-[10px] font-semibold text-slate-200">
              {h.balanceFloat.toLocaleString(undefined, {
                maximumFractionDigits: 4,
              })}
            </div>
          </button>
        ))}
        {!filtered.length && (
          <div className="mt-12 text-center text-xs text-slate-500">No holders found.</div>
        )}
      </div>
    </motion.aside>
  );
}

export default AddressSidebar;

