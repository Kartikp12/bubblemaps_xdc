import React from "react";
import { motion } from "framer-motion";

function formatPct(value) {
  if (!Number.isFinite(value)) return "0%";
  if (value >= 1) return `${value.toFixed(2)}%`;
  return `${value.toFixed(3)}%`;
}

export function HolderDetailPanel({ token, holder, cluster, flow }) {
  if (!holder || !token) return null;

  const clusterPct = cluster?.clusterSupplyPct ?? 0;
  const inCount = flow?.inCount ?? 0;
  const outCount = flow?.outCount ?? 0;
  const inValue = flow?.inValue ?? 0;
  const outValue = flow?.outValue ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="glass-panel-soft max-w-md rounded-2xl border border-slate-800/80 bg-slate-950/95 px-4 py-3 text-xs text-slate-100 shadow-2xl"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-fuchsia-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-fuchsia-200">
              Holder #{holder.rank != null ? holder.rank + 1 : "–"}
            </span>
            {cluster && (
              <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] text-slate-300">
                Cluster #{cluster.id} · {formatPct(clusterPct)} of visible supply
              </span>
            )}
          </div>
          <span className="mt-1 font-mono text-[11px] text-slate-200">
            {holder.address}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <div className="rounded-xl bg-slate-900/80 px-3 py-2 ring-1 ring-slate-800/80">
          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
            Amount
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-50">
            {holder.balanceFloat.toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-500">{token.symbol}</div>
        </div>

        <div className="rounded-xl bg-slate-900/80 px-3 py-2 ring-1 ring-slate-800/80">
          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
            Of supply
          </div>
          <div className="mt-1 text-sm font-semibold text-emerald-300">
            {formatPct(holder.percentage)}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-500">of total</div>
        </div>

        <div className="rounded-xl bg-slate-900/80 px-3 py-2 ring-1 ring-slate-800/80">
          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
            Cluster
          </div>
          <div className="mt-1 text-sm font-semibold text-fuchsia-300">
            {cluster ? formatPct(clusterPct) : "–"}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-500">cluster share</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-xl bg-emerald-500/10 px-3 py-2 ring-1 ring-emerald-400/40">
          <div className="text-[10px] uppercase tracking-[0.16em] text-emerald-300">
            In
          </div>
          <div className="mt-1 text-[11px] text-slate-100">
            {inValue.toLocaleString(undefined, { maximumFractionDigits: 4 })} {token.symbol}
          </div>
          <div className="mt-0.5 text-[10px] text-emerald-300">
            from {inCount} {inCount === 1 ? "address" : "addresses"}
          </div>
        </div>

        <div className="rounded-xl bg-rose-500/10 px-3 py-2 ring-1 ring-rose-400/40">
          <div className="text-[10px] uppercase tracking-[0.16em] text-rose-300">
            Out
          </div>
          <div className="mt-1 text-[11px] text-slate-100">
            {outValue.toLocaleString(undefined, { maximumFractionDigits: 4 })} {token.symbol}
          </div>
          <div className="mt-0.5 text-[10px] text-rose-300">
            to {outCount} {outCount === 1 ? "address" : "addresses"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default HolderDetailPanel;

