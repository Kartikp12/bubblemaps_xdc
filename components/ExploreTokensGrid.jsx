import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FALLBACK_TOKENS } from "../lib/trendingTokens";

export function ExploreTokensGrid() {
  const router = useRouter();

  return (
    <section className="mt-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              Explore Tokens
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              XRC20 tokens on the XDC Network. Click a token to open the bubble map.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {FALLBACK_TOKENS.map((token) => (
            <button
              key={token.address}
              type="button"
              onClick={() => router.push(`/token/${token.address}`)}
              className="glass-panel-soft group flex flex-col rounded-2xl p-4 text-left transition hover:-translate-y-0.5 hover:bg-slate-900/90 hover:ring-1 hover:ring-purple-400/70"
            >
              <div className="flex items-center gap-3">
                <div className="bubble-panel flex h-10 w-10 items-center justify-center text-xs font-semibold text-slate-50">
                  {token.symbol.slice(0, 3)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-100">
                    {token.symbol}
                  </span>
                  <span className="text-xs text-slate-400">{token.name}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate">
                  {token.address.slice(0, 10)}...{token.address.slice(-6)}
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-500/40">
                  Live on-chain data
                </span>
              </div>
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ExploreTokensGrid;

