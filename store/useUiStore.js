import { create } from "zustand";

export const useUiStore = create((set) => ({
  selectedToken: null,
  setSelectedToken: (token) => set({ selectedToken: token }),

  selectedHolder: null,
  setSelectedHolder: (holder) => set({ selectedHolder: holder }),

  sidebarFilters: {
    contracts: true,
    cex: true,
    dex: true,
  },
  toggleSidebarFilter: (key) =>
    set((state) => ({
      sidebarFilters: {
        ...state.sidebarFilters,
        [key]: !state.sidebarFilters[key],
      },
    })),
}));

