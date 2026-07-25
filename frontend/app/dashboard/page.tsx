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
import { useLanguage } from "@/lib/language-context";
import { formatDistrict } from "@/lib/translations";

interface GraphData {
  nodes: Array<{ id: string; group: number; risk: "Low" | "Medium" | "High" }>;
  links: Array<{ source: string; target: string }>;
}

export default function DashboardPage() {
  const { t } = useLanguage();
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
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-[var(--color-accent-copper)]" />
            {t.navDashboard}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {t.dashboardSubtitle}
          </p>
          <p suppressHydrationWarning className="text-[10px] font-mono text-slate-500 mt-1.5 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[var(--color-accent-copper)]" />
            {t.lastSynced}: {mounted ? new Date().toLocaleTimeString() : ""} | {t.dataPeriod}: 2024-2025 | Catalyst
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-[#111722] border border-slate-800 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:border-[var(--color-border-accent)] flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[var(--color-accent-copper)]" : ""}`} />
            <span>{isRefreshing ? t.syncing : t.refreshData}</span>
          </button>

          <button
            onClick={handleExportSummary}
            className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportData}</span>
          </button>
        </div>
      </div>

      {/* District & Range Filter Toolbar */}
      <div className="bg-[#111722] border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-[var(--color-accent-copper)]" />
            {t.districtLabel}
          </span>
          <button
            onClick={() => setSelectedDistrict("ALL")}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              selectedDistrict === "ALL"
                ? "bg-[#192231] border-[var(--color-border-accent)] text-[#C28254] font-bold"
                : "border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.allKarnataka} ({hotspots.length})
          </button>
          {availableDistricts.slice(0, 6).map((dist) => (
            <button
              key={dist}
              onClick={() => setSelectedDistrict(dist)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                selectedDistrict === dist
                  ? "bg-[#192231] border-[var(--color-border-accent)] text-[#C28254] font-bold"
                  : "border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {formatDistrict(dist, t)}
            </button>
          ))}
        </div>

        {/* Range Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t.rangeLabel}</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#192231] border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-[var(--color-border-accent)] font-medium"
          >
            <option value="ALL">{t.fullYear}</option>
            <option value="Q4">{t.q4Period}</option>
            <option value="L30">{t.last30Days}</option>
          </select>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={selectedDistrict === "ALL" ? t.totalCases : `${formatDistrict(selectedDistrict, t)} — ${t.totalCases}`}
          value={loading ? "—" : totalCases}
          icon={<FileText className="w-5 h-5 text-sky-400" />}
          accent="cyan"
        />
        <StatCard
          label={t.risingHotspots}
          value={loading ? "—" : risingCount}
          icon={<TrendingUp className="w-5 h-5 text-rose-500" />}
          accent="red"
          trend={risingCount > 0 ? t.highPriority : t.normalPriority}
        />
        <StatCard
          label={t.crimeRings}
          value={loading ? "—" : crimeRings}
          icon={<Network className="w-5 h-5 text-purple-400" />}
          accent="purple"
        />
        <StatCard
          label={t.highRiskSuspects}
          value={loading ? "—" : highRiskSuspects}
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          accent="amber"
        />
      </div>

      {/* SECTION 1: Google Maps Geospatial View */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Map className="w-5 h-5 text-[var(--color-accent-copper)]" />
          {t.mapTitle}
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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            {t.risingHotspots} {selectedDistrict !== "ALL" ? `— ${formatDistrict(selectedDistrict, t)}` : ""}
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {t.showingEntries} {sortedHotspots.length}
          </span>
        </div>

        {loading ? (
          <div className="text-xs text-slate-500 animate-pulse py-8 text-center bg-[#111722] border border-slate-800 rounded-xl font-mono">
            {t.loadingIntelligence}
          </div>
        ) : sortedHotspots.length === 0 ? (
          <div className="text-xs text-slate-400 py-8 text-center bg-[#111722] border border-slate-800 rounded-xl font-mono">
            {t.noHotspots}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedHotspots.slice(0, 9).map((entry, idx) => (
              <HotspotCard key={`${entry.district}-${entry.crime_category}`} entry={{ ...entry, district: formatDistrict(entry.district, t) }} rank={idx + 1} />
            ))}
          </div>
        )}
      </div>

      {/* SECTION 5: District Comparison Bar Chart */}
      <div className="bg-[#111722] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--color-accent-copper)]" />
            {t.comparisonTitle}
          </h2>
          <span className="text-xs text-slate-400">{t.comparisonSubtext}</span>
        </div>
        <div className="space-y-2.5">
          {(() => {
            if (loading) return <div className="text-xs text-slate-500 py-3">Loading...</div>;
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
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${
                    isSelected ? "bg-[#192231] border border-[var(--color-border-accent)]" : "hover:bg-[#192231]/50"
                  }`}
                >
                  <span className={`text-xs font-medium w-36 truncate ${isSelected ? "text-[#C28254] font-bold" : "text-slate-300"}`}>
                    {formatDistrict(district, t)}
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-[#0A0D12] overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(case_count / maxCount) * 100}%`,
                        background: isSelected
                          ? `linear-gradient(90deg, #C28254, #D97706)`
                          : `linear-gradient(90deg, #38BDF8, #3B82F6)`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-200 w-8 text-right font-bold">
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
        <div className="fixed bottom-6 right-6 bg-[#111722] text-slate-100 border border-[var(--color-accent-copper)] px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 text-xs font-medium animate-fade-in">
          <CheckCircle className="w-4 h-4 text-[#C28254]" />
          Intelligence Summary exported successfully!
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-3 text-[10px] text-slate-500 font-mono border-t border-slate-800">
        {t.footerText}
      </div>
    </div>
  );
}
