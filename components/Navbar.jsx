import React from "react";
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
      className="mx-4 flex-1 max-w-2xl rounded-full bg-slate-900/70 px-4 py-1.5 text-sm shadow-lg shadow-black/40 ring-1 ring-slate-700/60 backdrop-blur-xl"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
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
      className="nav-blur sticky top-0 z-40 border-b border-slate-800/60"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <button
          type="button"
          onClick={() => router.push("/app")}
          className="flex items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-sky-400 text-xs font-extrabold shadow-lg shadow-fuchsia-500/40">
            BM
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold tracking-wide text-slate-300">
              XDC Bubblemaps
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              XDC Network
            </span>
          </div>
        </button>

        {showSearch && <SearchBar onSubmit={handleSearch} initialValue={initialSearch} />}

        <div className="ml-auto flex items-center gap-3">
          <div className="pill-chip flex items-center gap-1 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-md shadow-purple-500/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>XDC</span>
          </div>
          <button
            type="button"
            className="rounded-full bg-slate-900/80 px-4 py-1.5 text-xs font-medium text-slate-100 shadow-lg shadow-black/50 ring-1 ring-slate-700/80 transition hover:bg-slate-800/95"
          >
            Login
          </button>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;

