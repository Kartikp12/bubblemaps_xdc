import React from "react";
import LayoutShell from "../../components/LayoutShell";
import Navbar from "../../components/Navbar";
import TrendingRibbon from "../../components/TrendingRibbon";
import ExploreTokensGrid from "../../components/ExploreTokensGrid";

export default function AppDashboardPage() {
  return (
    <LayoutShell>
      <Navbar />
      <main className="flex-1 pb-12 pt-4">
        <TrendingRibbon />
        <ExploreTokensGrid />
      </main>
    </LayoutShell>
  );
}

