"use client";

import { usePublicData } from "@/lib/use-public-data";
import { useLanguage } from "@/lib/language-context";
import { formatDistrict } from "@/lib/translations";

interface Anomaly {
  district: string;
  crime_category: string;
  report_month: string;
  case_count: number;
  mean: number;
  std_dev: number;
  z_score: number;
  severity: "Critical" | "High" | "Elevated";
  alert: string;
}

const SEVERITY_STYLES = {
  Critical: { bg: "bg-rose-950/40", border: "border-rose-500/40", badge: "bg-rose-950/60 text-rose-400 border border-rose-500/40", icon: "🔴" },
  High: { bg: "bg-amber-950/40", border: "border-amber-500/40", badge: "bg-amber-950/60 text-amber-400 border border-amber-500/40", icon: "🟡" },
  Elevated: { bg: "bg-sky-950/40", border: "border-sky-500/40", badge: "bg-sky-950/60 text-sky-400 border border-sky-500/40", icon: "🔵" },
};

export function AnomalyAlerts() {
  const { t } = useLanguage();
  const { data: anomalies, loading } = usePublicData<Anomaly[]>("anomaly_alerts.json", []);

  if (loading) {
    return (
      <div className="bg-[#111722] border border-slate-800 rounded-xl p-4 h-64 flex items-center justify-center">
        <div className="text-xs font-mono text-slate-500 animate-pulse">Loading anomaly data...</div>
      </div>
    );
  }

  if (anomalies.length === 0) {
    return (
      <div className="bg-[#111722] border border-slate-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 mb-3">
          <span>⚠️</span> {t.anomalyTitle}
        </h3>
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <span>✓</span>
          <span>{t.noAnomalies}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111722] border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <span>⚠️</span> {t.anomalyTitle}
        </h3>
        <span className="text-[10px] font-mono bg-rose-950/40 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-semibold">
          {anomalies.length} alerts
        </span>
      </div>

      <div className="space-y-2.5 max-h-[320px] overflow-y-auto">
        {anomalies.map((anomaly, idx) => {
          const style = SEVERITY_STYLES[anomaly.severity] || SEVERITY_STYLES.Elevated;
          return (
            <div
              key={`anomaly-${idx}-${anomaly.district}-${anomaly.crime_category}`}
              className={`p-3 rounded-lg border ${style.bg} ${style.border} flex items-center justify-between gap-3`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">{style.icon}</span>
                  <span className="text-xs font-bold text-slate-100">{formatDistrict(anomaly.district, t)}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({anomaly.crime_category})</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">{anomaly.alert}</p>
              </div>
              <div className="text-right shrink-0 font-mono">
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${style.badge}`}>
                  {anomaly.severity} (Z={anomaly.z_score})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
