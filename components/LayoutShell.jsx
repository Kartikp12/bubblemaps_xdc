import React from "react";

export function LayoutShell({ children }) {
  return (
    <div className="gradient-page min-h-screen text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-40 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -top-20 right-10 h-60 w-60 rounded-full bg-sky-400/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </div>
  );
}

export default LayoutShell;

