import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const CytoscapeComponent = dynamic(
  () => import("./CytoscapeInner").then((m) => m.CytoscapeInner),
  { ssr: false },
);

export function BubbleGraph({
  graph,
  clusters,
  onNodeSelect,
  selectedAddress,
  isLoading,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-panel relative h-[420px] w-full overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-950/95 shadow-2xl md:h-[520px]"
    >
      <div className="absolute inset-0">
        <CytoscapeComponent
          elements={graph?.elements ?? []}
          clusters={clusters ?? []}
          onNodeSelect={onNodeSelect}
          selectedAddress={selectedAddress}
        />
      </div>
      {(isLoading || !graph?.elements?.length) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40">
          <div className="relative mb-4 flex h-20 w-20 items-center justify-center">
            <div className="bubble-loader-orbit absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-sky-400 opacity-60" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-slate-200 shadow-xl shadow-fuchsia-500/60">
              XDC
            </div>
          </div>
          <p className="text-xs text-slate-300">Computing live holder clusters…</p>
        </div>
      )}
    </motion.div>
  );
}

export default BubbleGraph;

