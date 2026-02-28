import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";

// Register the layout extension once
if (typeof cytoscape === "function" && !cytoscape.prototype?.__xdcCoseBilkent) {
  cytoscape.use(coseBilkent);
  // non-enumerable flag to avoid duplicate use() calls in fast refresh
  Object.defineProperty(cytoscape.prototype, "__xdcCoseBilkent", {
    value: true,
    configurable: false,
  });
}

const CLUSTER_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#f97316",
  "#e11d48",
  "#06b6d4",
  "#facc15",
  "#ec4899",
  "#14b8a6",
  "#4ade80",
];

export function CytoscapeInner({ elements, onNodeSelect, selectedAddress }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "font-size": 6,
            color: "#e5e7eb",
            "text-outline-width": 1,
            "text-outline-color": "#020617",
            "text-opacity": 0,
            "min-zoomed-font-size": 8,
            "background-color": (ele) => {
              const clusterId = ele.data("clusterId");
              if (clusterId == null) return "rgba(148, 163, 184, 0.25)";
              const color = CLUSTER_COLORS[clusterId % CLUSTER_COLORS.length];
              return color;
            },
            "background-opacity": (ele) => {
              const pct = ele.data("percentage") || 0;
              if (pct > 5) return 0.95;
              if (pct > 1) return 0.85;
              return 0.7;
            },
            "border-color": (ele) => {
              const clusterId = ele.data("clusterId");
              if (clusterId == null) return "rgba(148, 163, 184, 0.4)";
              const color = CLUSTER_COLORS[clusterId % CLUSTER_COLORS.length];
              return color;
            },
            "border-width": (ele) => {
              const pct = ele.data("percentage") || 0;
              if (pct > 5) return 3;
              if (pct > 1) return 2;
              return 1;
            },
            "overlay-opacity": 0,
            width: (ele) => {
              const pct = ele.data("percentage") || 0;
              const balance = ele.data("balance") || 0;
              const base = 8;
              const sizeFromPct = Math.sqrt(Math.max(pct, 0)) * 8;
              const sizeFromBalance = Math.log10(Math.max(balance, 0.000001) + 1) * 14;
              const scaled = base + Math.min(64, sizeFromPct + sizeFromBalance);
              return scaled;
            },
            height: (ele) => {
              const pct = ele.data("percentage") || 0;
              const balance = ele.data("balance") || 0;
              const base = 8;
              const sizeFromPct = Math.sqrt(Math.max(pct, 0)) * 8;
              const sizeFromBalance = Math.log10(Math.max(balance, 0.000001) + 1) * 14;
              const scaled = base + Math.min(64, sizeFromPct + sizeFromBalance);
              return scaled;
            },
            "shadow-blur": 18,
            "shadow-color": (ele) => {
              const clusterId = ele.data("clusterId");
              if (clusterId == null) return "rgba(15,23,42,0.9)";
              const color = CLUSTER_COLORS[clusterId % CLUSTER_COLORS.length];
              return color;
            },
            "shadow-opacity": 0.8,
          },
        },
        {
          selector: "edge",
          style: {
            width: 0.6,
            "line-color": "rgba(148,163,184,0.45)",
            "curve-style": "haystack",
            "haystack-radius": 0.6,
            opacity: 0.45,
          },
        },
        {
          selector: "node:selected",
          style: {
            "border-width": 4,
            "border-color": "#f9a8d4",
            "background-opacity": 1,
            "shadow-blur": 28,
            "shadow-color": "#f472b6",
            "text-opacity": 1,
          },
        },
      ],
      layout: {
        name: "cose-bilkent",
        animate: "end",
        animationDuration: 1400,
        fit: true,
        padding: 80,
        idealEdgeLength: 60,
        nodeRepulsion: 8000,
        edgeElasticity: 0.2,
        nestingFactor: 0.9,
        gravity: 0.3,
        numIter: 2500,
      },
      wheelSensitivity: 0.2,
    });

    cy.on("tap", "node", (evt) => {
      const node = evt.target;
      onNodeSelect?.(node.data());
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, [elements, onNodeSelect]);

  useEffect(() => {
    if (!cyRef.current || !selectedAddress) return;
    const cy = cyRef.current;
    cy.nodes().unselect();
    const node = cy.getElementById(selectedAddress.toLowerCase());
    if (node && node.nonempty()) {
      node.select();
      cy.animate({
        center: { eles: node },
        zoom: 1.2,
        duration: 500,
      });
    }
  }, [selectedAddress]);

  return <div ref={containerRef} className="cytoscape-container" />;
}

export default CytoscapeInner;

