"use client";

import { Network } from "lucide-react";
import { NetworkGraph } from "@/components/NetworkGraph";
import { usePublicData } from "@/lib/use-public-data";
import type { GraphData } from "@/lib/mock-data";
import { useLanguage } from "@/lib/language-context";

export default function NetworkPage() {
  const { t } = useLanguage();
  const { data: graphData, loading } = usePublicData<GraphData>("graph_data.json", { nodes: [], links: [] });

  const highRiskCount = graphData.nodes.filter((n) => n.risk === "High").length;
  const clusterCount = new Set(graphData.nodes.map((n) => n.group)).size;

  return (
    <div className="min-h-screen p-6 md:p-8 flex flex-col space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
          <Network className="w-6 h-6 text-[var(--color-accent-copper)]" />
          {t.networkTitle}
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          {t.networkSubtitle}
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#111722] border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{t.suspectsCount}</span>
          <p className="text-xl font-bold font-mono text-slate-100 mt-1">
            {loading ? "—" : graphData.nodes.length}
          </p>
        </div>
        <div className="bg-[#111722] border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{t.connectionsCount}</span>
          <p className="text-xl font-bold font-mono text-slate-100 mt-1">
            {loading ? "—" : graphData.links.length}
          </p>
        </div>
        <div className="bg-[#111722] border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{t.highRiskCount}</span>
          <p className="text-xl font-bold font-mono text-rose-500 mt-1">
            {loading ? "—" : highRiskCount}
          </p>
        </div>
        <div className="bg-[#111722] border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{t.clustersCount}</span>
          <p className="text-xl font-bold font-mono text-purple-400 mt-1">
            {loading ? "—" : clusterCount}
          </p>
        </div>
      </div>

      {/* Graph View */}
      <div className="flex-1 min-h-[520px] rounded-xl overflow-hidden border border-slate-800 bg-[#111722]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-xs font-mono text-slate-500 animate-pulse">
            Loading syndicate network graph...
          </div>
        ) : (
          <NetworkGraph data={graphData} />
        )}
      </div>
    </div>
  );
}
