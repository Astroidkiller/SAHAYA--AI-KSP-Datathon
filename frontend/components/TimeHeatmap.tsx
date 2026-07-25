"use client";

import { useMemo } from "react";
import { usePublicData } from "@/lib/use-public-data";
import { useLanguage } from "@/lib/language-context";

/**
 * Time-of-Day × Day-of-Week Crime Heatmap
 * A 7×24 grid showing crime frequency patterns.
 */

const DAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYS_KN = ["ಸೋಮ", "ಮಂಗಳ", "ಬುಧ", "ಗುರು", "ಶುಕ್ರ", "ಶನಿ", "ಭಾನುವಾರ"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function getHeatColor(value: number, max: number): string {
  if (max === 0) return "rgba(30, 41, 59, 0.5)";
  const ratio = value / max;
  if (ratio === 0) return "rgba(30, 41, 59, 0.5)";
  if (ratio < 0.25) return "rgba(34, 197, 94, 0.3)";
  if (ratio < 0.5) return "rgba(34, 197, 94, 0.6)";
  if (ratio < 0.75) return "rgba(245, 158, 11, 0.7)";
  return "rgba(239, 68, 68, 0.85)";
}

function formatHour(h: number): string {
  if (h === 0) return "12A";
  if (h < 12) return `${h}A`;
  if (h === 12) return "12P";
  return `${h - 12}P`;
}

interface TimeHeatmapProps {
  categoryFilter?: string;
}

interface FIRRecord {
  category: string;
  day_of_week: string;
  hour_of_day: number;
}

export function TimeHeatmap({ categoryFilter }: TimeHeatmapProps) {
  const { language, t } = useLanguage();
  const { data: firData, loading } = usePublicData<FIRRecord[]>("fir_records.json", []);

  const DAYS = language === "kn" ? DAYS_KN : DAYS_EN;

  const { grid, maxVal, totalCrimes, peakTime } = useMemo(() => {
    const g: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    let total = 0;
    let max = 0;
    let peak = { day: "", hour: 0, count: 0 };

    const dayIndexMap: Record<string, number> = {
      Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6,
    };

    firData.forEach((fir) => {
      if (categoryFilter && fir.category.toLowerCase() !== categoryFilter.toLowerCase()) return;
      const dIdx = dayIndexMap[fir.day_of_week];
      const hIdx = fir.hour_of_day;
      if (dIdx !== undefined && hIdx !== undefined && hIdx >= 0 && hIdx < 24) {
        g[dIdx][hIdx]++;
        total++;
        if (g[dIdx][hIdx] > max) {
          max = g[dIdx][hIdx];
          peak = { day: DAYS_EN[dIdx], hour: hIdx, count: g[dIdx][hIdx] };
        }
      }
    });

    return { grid: g, maxVal: max, totalCrimes: total, peakTime: max > 0 ? peak : null };
  }, [firData, categoryFilter]);

  if (loading) {
    return (
      <div className="bg-[#111722] border border-slate-800 rounded-xl p-4 h-64 flex items-center justify-center">
        <div className="text-xs font-mono text-slate-500 animate-pulse">Loading heatmap...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#111722] border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <span>📅</span> {t.spatiotemporalTitle}
        </h3>
        {peakTime && (
          <span className="text-[10px] font-mono bg-rose-950/40 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-semibold">
            {t.peakCrimeTime}: {peakTime.day} {formatHour(peakTime.hour)} ({peakTime.count} FIRs)
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="w-12 text-[10px] text-slate-500 font-mono p-1"></th>
              {HOURS.map((h) => (
                <th key={h} className="text-[9px] text-slate-400 font-mono p-1">
                  {formatHour(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, dIdx) => (
              <tr key={day}>
                <td className="text-[10px] font-bold text-slate-300 p-1 text-left font-mono">{day}</td>
                {HOURS.map((hIdx) => {
                  const val = grid[dIdx][hIdx];
                  return (
                    <td
                      key={hIdx}
                      className="p-0.5"
                      title={`${day} ${formatHour(hIdx)}: ${val} incidents`}
                    >
                      <div
                        className="w-full h-5 rounded-sm transition-all duration-200 hover:scale-115 cursor-pointer flex items-center justify-center text-[9px] font-mono font-bold text-white/90"
                        style={{ backgroundColor: getHeatColor(val, maxVal) }}
                      >
                        {val > 0 ? val : ""}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
