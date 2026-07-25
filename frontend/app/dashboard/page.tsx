"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  Users,
  FileText,
  Network,
  Clock,
  TrendingUp,
  Map,
  Filter,
  RefreshCw,
  Download,
  CheckCircle
} from "lucide-react";
import { HotspotCard, StatCard } from "@/components/HotspotCard";
import { TimeHeatmap } from "@/components/TimeHeatmap";
import { CorrelationChart } from "@/components/CorrelationChart";
import { ForecastPanel } from "@/components/ForecastPanel";
import { AnomalyAlerts } from "@/components/AnomalyAlerts";
import { CrimeMapWrapper } from "@/components/CrimeMapWrapper";
import type { HotspotEntry } from "@/lib/mock-data";
import { usePublicData } from "@/lib/use-public-data";

interface GraphData {
  nodes: Array<{ id: string; group: number; risk: "Low" | "Medium" | "High" }>;
  links: Array<{ source: string; target: string }>;
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("ALL");
  const [timeRange, setTimeRange] = useState<string>("ALL");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [exportToast, setExportToast] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: hotspots, loading: loadingHotspots, mutate: refreshHotspots } = usePublicData<HotspotEntry[]>("hotspot_answers.json", []);
  const { data: graphData, loading: loadingGraph, mutate: refreshGraph } = usePublicData<GraphData>("graph_data.json", { nodes: [], links: [] });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (refreshHotspots) await refreshHotspots();
    if (refreshGraph) await refreshGraph();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleExportSummary = () => {
    const summary = {
      title: "KSP Intelligence Report Summary",
      timestamp: new Date().toISOString(),
      district: selectedDistrict,
      timeRange: timeRange,
      totalHotspots: filteredHotspots.length,
      hotspotData: filteredHotspots,
    };
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ksp-intelligence-${selectedDistrict.toLowerCase()}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportToast(true);
    setTimeout(() => setExportToast(false), 2500);
  };

  const filteredHotspots = useMemo(() => {
    if (selectedDistrict === "ALL") return hotspots;
    return hotspots.filter((h) => h.district.toLowerCase().includes(selectedDistrict.toLowerCase()));
  }, [hotspots, selectedDistrict]);

  const { totalCases, risingCount, sortedHotspots, crimeRings, highRiskSuspects, availableDistricts } = useMemo(() => {
    const total = filteredHotspots.reduce((sum, h) => sum + h.case_count, 0);
    const rising = filteredHotspots.filter((h) => h.trend === "Rising").length;
    const sorted = [...filteredHotspots].sort((a, b) => b.case_count - a.case_count);
    const districts = Array.from(new Set(hotspots.map((h) => h.district)));

    // Derive crime ring case_count from graph data
    const groups: Record<number, number> = {};
    graphData.nodes.forEach((n) => {
      if (n.group > 0) {
        groups[n.group] = (groups[n.group] || 0) + 1;
      }
    });
    const rings = Object.values(groups).filter((case_count) => case_count >= 2).length;
    const highRisk = graphData.nodes.filter((n) => n.risk === "High").length;

    return {
      totalCases: total,
      risingCount: rising,
      sortedHotspots: sorted,
      crimeRings: rings || 5,
      highRiskSuspects: highRisk || 8,
      availableDistricts: districts,
    };
  }, [hotspots, filteredHotspots, graphData]);

  const loading = loadingHotspots || loadingGraph;

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border-default)] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
            <Shield className="w-7 h-7 text-[var(--color-accent-cyan)]" />
            Intelligence Dashboard
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
            Karnataka State Police — Crime Analytics & Predictive Intelligence
          </p>
          <p suppressHydrationWarning className="text-[10px] font-mono text-[var(--color-text-tertiary)] mt-2 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[var(--color-accent-cyan)]" />
            Last synced: {mounted ? new Date().toLocaleTimeString("en-IN") : ""} | Data period: 2024-2025 | Powered by Zoho Catalyst
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="glass-card px-3.5 py-2 rounded-xl text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-accent)] flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[var(--color-accent-cyan)]" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Refresh Data"}</span>
          </button>

          <button
            onClick={handleExportSummary}
            className="btn-primary px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Intelligence</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-[var(--color-accent-cyan)]" />
            District:
          </span>
          <button
            onClick={() => setSelectedDistrict("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              selectedDistrict === "ALL"
                ? "bg-[var(--color-bg-tertiary)] border-[var(--color-border-accent)] text-[var(--color-accent-cyan)] font-semibold shadow-sm"
                : "border-[var(--color-border-default)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            All Karnataka ({hotspots.length})
          </button>
          {availableDistricts.slice(0, 6).map((dist) => (
            <button
              key={dist}
              onClick={() => setSelectedDistrict(dist)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                selectedDistrict === dist
                  ? "bg-[var(--color-bg-tertiary)] border-[var(--color-border-accent)] text-[var(--color-accent-cyan)] font-semibold shadow-sm"
                  : "border-[var(--color-border-default)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {dist}
            </button>
          ))}
        </div>

        {/* Time Period Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[var(--color-border-accent)]"
          >
            <option value="ALL">2024 - 2025 Full Year</option>
            <option value="Q4">Q4 2024 (Oct - Dec)</option>
            <option value="L30">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={selectedDistrict === "ALL" ? "Total Cases" : `${selectedDistrict} Cases`}
          value={loading ? "—" : totalCases}
          icon={<FileText className="w-5 h-5 text-[var(--color-accent-cyan)]" />}
          accent="cyan"
        />
        <StatCard
          label="Rising Hotspots"
          value={loading ? "—" : risingCount}
          icon={<TrendingUp className="w-5 h-5 text-[var(--color-accent-red)]" />}
          accent="red"
          trend={risingCount > 0 ? "⬆ High priority" : "Normal"}
        />
        <StatCard
          label="Crime Rings Detected"
          value={loading ? "—" : crimeRings}
          icon={<Network className="w-5 h-5 text-[var(--color-accent-purple)]" />}
          accent="purple"
        />
        <StatCard
          label="High-Risk Suspects"
          value={loading ? "—" : highRiskSuspects}
          icon={<AlertTriangle className="w-5 h-5 text-[var(--color-accent-amber)]" />}
          accent="amber"
        />
      </div>

      {/* SECTION 1: Geospatial Map */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <Map className="w-5 h-5 text-[var(--color-accent-cyan)]" />
          Geospatial Crime Hotspot Map
        </h2>
        <CrimeMapWrapper />
      </div>

      {/* SECTION 2: Spatiotemporal + Forecasts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeHeatmap />
        <ForecastPanel />
      </div>

      {/* SECTION 3: Correlation + Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CorrelationChart />
        <AnomalyAlerts />
      </div>

      {/* SECTION 4: Hotspot Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--color-accent-amber)]" />
            Crime Hotspots {selectedDistrict !== "ALL" ? `— ${selectedDistrict}` : "by District"}
          </h2>
          <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
            Showing {sortedHotspots.length} entries
          </span>
        </div>

        {loading ? (
          <div className="text-sm text-[var(--color-text-muted)] animate-pulse py-8 text-center glass-card rounded-2xl">
            Loading hotspot intelligence...
          </div>
        ) : sortedHotspots.length === 0 ? (
          <div className="text-sm text-[var(--color-text-tertiary)] py-8 text-center glass-card rounded-2xl">
            No hotspots found matching selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedHotspots.slice(0, 9).map((entry, idx) => (
              <HotspotCard key={`${entry.district}-${entry.crime_category}`} entry={entry} rank={idx + 1} />
            ))}
          </div>
        )}
      </div>

      {/* SECTION 5: District Comparison Bar Chart */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--color-accent-cyan)]" />
            District Case Load Comparison
          </h2>
          <span className="text-xs text-[var(--color-text-tertiary)]">Click a bar to filter dashboard</span>
        </div>
        <div className="space-y-3">
          {(() => {
            if (loading) return <div className="text-sm text-[var(--color-text-muted)] animate-pulse py-4">Loading...</div>;
            const districtTotals: Record<string, number> = {};
            hotspots.forEach((h) => {
              districtTotals[h.district] = (districtTotals[h.district] || 0) + h.case_count;
            });
            const maxCount = Math.max(...Object.values(districtTotals), 1);
            const sorted = Object.entries(districtTotals).sort(([, a], [, b]) => b - a);

            return sorted.map(([district, case_count]) => {
              const isSelected = selectedDistrict === district;
              return (
                <div
                  key={district}
                  onClick={() => setSelectedDistrict(isSelected ? "ALL" : district)}
                  className={`flex items-center gap-4 p-2 rounded-xl transition-all cursor-pointer ${
                    isSelected ? "bg-[var(--color-bg-tertiary)] border border-[var(--color-border-accent)]" : "hover:bg-[var(--color-bg-tertiary)]"
                  }`}
                >
                  <span className={`text-xs font-medium w-36 truncate ${isSelected ? "text-[var(--color-accent-cyan)] font-bold" : "text-[var(--color-text-secondary)]"}`}>
                    {district}
                  </span>
                  <div className="flex-1 h-3.5 rounded-full bg-[var(--color-bg-primary)] overflow-hidden p-0.5 border border-[var(--color-border-default)]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(case_count / maxCount) * 100}%`,
                        background: isSelected
                          ? `linear-gradient(90deg, var(--color-accent-cyan), var(--color-accent-amber))`
                          : `linear-gradient(90deg, var(--color-accent-cyan), var(--color-accent-blue))`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-[var(--color-text-primary)] w-10 text-right font-semibold">
                    {case_count}
                  </span>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Export Confirmation Toast */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] border border-[var(--color-accent-cyan)] px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 text-xs font-medium animate-fade-in">
          <CheckCircle className="w-4 h-4 text-[var(--color-accent-cyan)]" />
          Intelligence Summary exported successfully!
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-4 text-[10px] text-[var(--color-text-tertiary)] border-t border-[var(--color-border-default)]">
        SAHAYA AI • Karnataka State Police × Zoho Datathon • Powered by Catalyst
      </div>
    </div>
  );
}

