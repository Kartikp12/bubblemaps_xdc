import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import LayoutShell from "../components/LayoutShell";

export default function LandingPage() {
  const router = useRouter();

  return (
    <LayoutShell>
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 ring-1 ring-slate-700/80"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(244,114,182,0.8)]" />
            <span>The Onchain Intelligence Layer for XDC</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-gradient-to-br from-slate-50 via-fuchsia-200 to-sky-200 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl"
          >
            Visualize XDC Token
            <span className="block text-fuchsia-200">Holder Clusters</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
            className="mt-4 max-w-2xl text-sm text-slate-300 md:text-base"
          >
            Explore real-time XRC20 holder distributions, uncover tightly connected wallets,
            and trace liquidity flows across the XDC Network using interactive bubble maps
            powered purely by on-chain data.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={() => router.push("/app")}
              className="primary-button"
            >
              Launch App
            </button>
            <div className="flex items-center gap-2 rounded-full bg-slate-900/70 px-4 py-2 text-xs text-slate-300 ring-1 ring-slate-700/80">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              <span>Live XDC network · RPC failover enabled</span>
            </div>
          </motion.div>
        </div>
      </main>
    </LayoutShell>
  );
}

