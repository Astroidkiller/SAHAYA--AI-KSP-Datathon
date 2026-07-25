"use client";

import { useMemo, useRef, useEffect } from "react";
import { usePublicData } from "@/lib/use-public-data";
import { useLanguage } from "@/lib/language-context";
import { formatDistrict } from "@/lib/translations";

interface ForecastEntry {
  district: string;
  crime_category: string;
  historical_months: string[];
  historical_counts: number[];
  moving_average_3m: number;
  trend_slope: number;
  trend_direction: string;
  std_deviation: number;
  forecasted_periods: Array<{
    month: string;
    predicted_count: number;
    lower_bound: number;
    upper_bound: number;
  }>;
}

function Sparkline({ entry }: { entry: ForecastEntry }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const values = [...entry.historical_counts];
    if (entry.forecasted_periods && entry.forecasted_periods.length > 0) {
      values.push(entry.forecasted_periods[0].predicted_count);
    }

    const min = Math.min(...values);
    const max = Math.max(...values, min + 1);

    ctx.clearRect(0, 0, w, h);

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = entry.trend_direction === "Rising" ? "#f43f5e" : "#10b981";
    ctx.lineWidth = 2;

    values.forEach((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * (h - 8) - 4;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  }, [entry]);

  return <canvas ref={canvasRef} className="w-full h-8 block" />;
}

export function ForecastPanel() {
  const { t } = useLanguage();
  const { data: forecastData, loading } = usePublicData<ForecastEntry[]>("forecast_answers.json", []);

  const risingForecasts = useMemo(() => {
    return forecastData.filter((f) => f.trend_direction === "Rising");
  }, [forecastData]);

  return (
    <div className="bg-[#111722] border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <span>📈</span> {t.forecastTitle}
        </h3>
        <span className="text-[10px] font-mono bg-rose-950/40 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-semibold">
          {risingForecasts.length} rising
        </span>
      </div>

      {loading ? (
        <div className="text-xs text-slate-500 animate-pulse py-8 text-center">Loading forecast model...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {forecastData.slice(0, 4).map((entry, idx) => (
            <div
              key={`forecast-${idx}-${entry.district}-${entry.crime_category}`}
              className="bg-[#192231] border border-slate-800 rounded-lg p-3 flex flex-col justify-between hover:border-[var(--color-border-accent)] transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{formatDistrict(entry.district, t)}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{entry.crime_category}</p>
                </div>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                    entry.trend_direction === "Rising"
                      ? "bg-rose-950/40 text-rose-400 border border-rose-500/30"
                      : "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {entry.trend_direction === "Rising" ? "↗ RISING" : "↘ STABLE"}
                </span>
              </div>
              <Sparkline entry={entry} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
