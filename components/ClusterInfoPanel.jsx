import React from "react";
import { motion } from "framer-motion";

function formatPct(value) {
  if (!Number.isFinite(value)) return "0%";
  if (value >= 1) return `${value.toFixed(2)}%`;
  return `${value.toFixed(3)}%`;
}

export function ClusterInfoPanel({ token, stats, selectedHolder, clusters }) {
  const cluster =
    selectedHolder && selectedHolder.clusterId != null
      ? clusters?.find((c) => c.id === selectedHolder.clusterId)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass-panel-soft mt-4 inline-flex flex-wrap items-center gap-4 rounded-2xl border border-slate-800/70 px-4 py-3 text-xs text-slate-200 shadow-xl"
    >
      <div className="flex items-center gap-3">
        <div className="bubble-panel flex h-10 w-10 items-center justify-center text-[11px] font-semibold">
          {token?.symbol?.slice(0, 3) ?? "TOK"}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-100">
            {token?.name ?? "Token"}
          </span>
          <span className="text-[11px] text-slate-500">
            {token?.symbol} · Total Supply{" "}
            {token
              ? token.totalSupply.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })
              : "-"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[11px]">
        <div className="rounded-full bg-slate-900/80 px-3 py-1 ring-1 ring-slate-700/80">
          Holders: <span className="font-semibold">{stats?.holdersCount ?? 0}</span>
        </div>
        <div className="rounded-full bg-slate-900/80 px-3 py-1 ring-1 ring-slate-700/80">
          Transfers analyzed:{" "}
          <span className="font-semibold">{stats?.transfersAnalyzed ?? 0}</span>
        </div>
        {cluster && (
          <div className="rounded-full bg-fuchsia-500/20 px-3 py-1 ring-1 ring-fuchsia-400/60">
            Cluster #{cluster.id} · Cluster Supply {formatPct(cluster.clusterSupplyPct)}
          </div>
        )}
        {selectedHolder && (
          <div className="rounded-full bg-emerald-500/15 px-3 py-1 ring-1 ring-emerald-400/60">
            <span className="font-mono">
              {selectedHolder.address.slice(0, 6)}...{selectedHolder.address.slice(-4)}
            </span>{" "}
            · {formatPct(selectedHolder.percentage)} of total supply
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ClusterInfoPanel;

