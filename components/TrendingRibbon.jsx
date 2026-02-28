import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FALLBACK_TOKENS } from "../lib/trendingTokens";

export function TrendingRibbon() {
  const router = useRouter();

  return (
    <div className="mt-3 w-full overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <div className="mb-1 flex items-center justify-between px-1 text-[11px] uppercase tracking-[0.25em] text-slate-500">
          <span>Trending Tokens</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="glass-panel-soft relative flex items-center overflow-x-auto px-3 py-2 scrollbar-thin"
        >
          <div className="flex min-w-max gap-3">
            {FALLBACK_TOKENS.map((token, idx) => (
              <button
                key={token.address}
                type="button"
                onClick={() => router.push(`/token/${token.address}`)}
                className="group flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs text-slate-200 ring-1 ring-slate-700/70 transition hover:bg-slate-900/90 hover:ring-purple-400/70"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-sky-400 text-[11px] font-semibold text-slate-50 shadow-md shadow-fuchsia-500/40">
                  #{idx + 1}
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[11px] font-semibold tracking-wide">
                    {token.symbol}
                  </span>
                  <span className="text-[10px] text-slate-400">{token.name}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TrendingRibbon;

