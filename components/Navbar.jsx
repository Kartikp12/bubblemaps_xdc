import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

function SearchBar({ onSubmit, initialValue }) {
  const [value, setValue] = React.useState(initialValue ?? "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit?.(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-2 flex-1 min-w-0 max-w-2xl rounded-full bg-slate-900/70 px-3 py-1.5 text-sm shadow-lg shadow-black/40 ring-1 ring-slate-700/60 backdrop-blur-xl sm:mx-4 sm:px-4"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full min-w-0 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
        placeholder="Search Tokens (Name, Ticker, Address)"
      />
    </form>
  );
}

export function Navbar({ showSearch = true, initialSearch }) {
  const router = useRouter();

  const handleSearch = (term) => {
    const value = term.trim();
    if (!value) return;
    if (value.startsWith("0x") || value.toLowerCase().startsWith("xdc")) {
      router.push(`/token/${value}`);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="nav-blur sticky top-0 z-40 w-full overflow-x-hidden border-b border-slate-800/60"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
        <button
          type="button"
          onClick={() => router.push("/app")}
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-sky-400 text-xs font-extrabold shadow-lg shadow-fuchsia-500/40">
            BM
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-xs font-semibold tracking-wide text-slate-300">
              XDC Bubblemaps
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              XDC Network
            </span>
          </div>
          <span className="text-xs font-semibold tracking-wide text-slate-300 sm:hidden">
            Bubblemaps
          </span>
        </button>

        {showSearch && (
          <div className="order-last w-full min-w-0 basis-full sm:order-none sm:flex-1 sm:basis-0">
            <SearchBar onSubmit={handleSearch} initialValue={initialSearch} />
          </div>
        )}

        <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
          <Link href="/token-terminal" className="shrink-0">
            <button
              type="button"
              className="networkMetricsBtn whitespace-nowrap rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-lg shadow-black/50 ring-1 ring-slate-700/80 transition hover:bg-slate-800/95 sm:px-4"
            >
              <span className="hidden sm:inline">Network Metrics</span>
              <span className="sm:hidden">Metrics</span>
            </button>
          </Link>
          <div className="pill-chip flex shrink-0 items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-100 shadow-md shadow-purple-500/40 sm:px-3">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            <span>XDC</span>
          </div>
          <button
            type="button"
            className="shrink-0 whitespace-nowrap rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-lg shadow-black/50 ring-1 ring-slate-700/80 transition hover:bg-slate-800/95 sm:px-4"
          >
            Login
          </button>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;

