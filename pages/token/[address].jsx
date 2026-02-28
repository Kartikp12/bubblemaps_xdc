import React from "react";
import { useRouter } from "next/router";
import LayoutShell from "../../components/LayoutShell";
import Navbar from "../../components/Navbar";
import BubbleGraph from "../../components/BubbleGraph";
import AddressSidebar from "../../components/AddressSidebar";
import ClusterInfoPanel from "../../components/ClusterInfoPanel";
import HolderDetailPanel from "../../components/HolderDetailPanel";
import { useTokenAnalyticsQuery } from "../../lib/useTokenAnalyticsQuery";
import { useUiStore } from "../../store/useUiStore";

export default function TokenAnalyticsPage() {
  const router = useRouter();
  const rawAddress = typeof router.query.address === "string" ? router.query.address : "";
  const normalizedAddress = rawAddress ? rawAddress.replace(/^xdc/i, "0x") : "";

  const isReady = router.isReady && Boolean(normalizedAddress);

  const { data, isLoading, isError, error } = useTokenAnalyticsQuery(
    isReady ? normalizedAddress : undefined,
  );

  const selectedHolder = useUiStore((s) => s.selectedHolder);
  const setSelectedHolder = useUiStore((s) => s.setSelectedHolder);
  const filters = useUiStore((s) => s.sidebarFilters);
  const toggleFilter = useUiStore((s) => s.toggleSidebarFilter);

  const holders = React.useMemo(() => {
    if (!data?.holders) return [];
    return data.holders;
  }, [data]);

  return (
    <LayoutShell>
      <Navbar />
      <main className="flex-1 pb-10 pt-4">
        <div className="mx-auto max-w-6xl px-4">
          {!isReady && (
            <div className="glass-panel-soft mb-4 rounded-2xl px-4 py-3 text-sm text-slate-300">
              Preparing analytics view…
            </div>
          )}

          {isReady && isError && (
            <div className="glass-panel-soft mt-6 rounded-2xl px-4 py-3 text-sm text-rose-300">
              Failed to load token analytics from XDC RPC.
              <span className="mt-1 block text-xs text-rose-200/80">
                {error?.message ?? "Unknown error"}
              </span>
            </div>
          )}

          {isReady && (
            <>
              {data && (
                <div className="mb-4">
                  <ClusterInfoPanel
                    token={data.token}
                    stats={data.stats}
                    selectedHolder={selectedHolder}
                    clusters={data.clusters}
                  />
                </div>
              )}

              <div className="mt-2 flex flex-col gap-4 md:mt-4 md:flex-row">
                <div className="relative flex-1">
                  {data && selectedHolder && (
                    <div className="pointer-events-auto absolute left-3 top-3 z-20 max-w-md">
                      <HolderDetailPanel
                        token={data.token}
                        holder={{
                          ...selectedHolder,
                          rank: data.holders.findIndex(
                            (h) => h.address.toLowerCase() === selectedHolder.address.toLowerCase(),
                          ),
                        }}
                        cluster={
                          selectedHolder.clusterId != null
                            ? data.clusters.find((c) => c.id === selectedHolder.clusterId)
                            : null
                        }
                        flow={data.addressFlows?.[selectedHolder.address.toLowerCase()]}
                      />
                    </div>
                  )}
                  <BubbleGraph
                    graph={data?.graph}
                    clusters={data?.clusters}
                    isLoading={isLoading || !data}
                    onNodeSelect={(node) => {
                      if (!data?.holders) return;
                      const holder = data.holders.find(
                        (h) => h.address.toLowerCase() === node.id.toLowerCase(),
                      );
                      if (holder) setSelectedHolder(holder);
                    }}
                    selectedAddress={selectedHolder?.address}
                  />
                </div>
                <div className="mt-3 w-full md:mt-0 md:w-80">
                  {isLoading && !data && (
                    <div className="glass-panel-soft h-[420px] animate-pulse rounded-3xl bg-slate-900/80 md:h-[520px]" />
                  )}
                  {data && (
                    <AddressSidebar
                      holders={holders}
                      filters={filters}
                      onToggleFilter={toggleFilter}
                      onSelect={setSelectedHolder}
                      selected={selectedHolder}
                    />
                  )}
                </div>
              </div>

            </>
          )}
        </div>
      </main>
    </LayoutShell>
  );
}

