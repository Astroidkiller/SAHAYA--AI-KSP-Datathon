"use client";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
} from "lucide-react";
import type { HotspotEntry } from "@/lib/mock-data";

interface HotspotCardProps {
  entry: HotspotEntry;
  rank?: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  Theft: "🔓",
  Robbery: "🔫",
  Assault: "👊",
  Cybercrime: "💻",
  Drug: "💊",
  Murder: "🔪",
  Fraud: "💳",
  Missing: "🔍",
};

const TREND_CONFIG = {
  Rising: {
    icon: TrendingUp,
    class: "trend-rising",
    label: "Rising",
    bg: "rgba(239, 68, 68, 0.1)",
  },
  Stable: {
    icon: Minus,
    class: "trend-stable",
    label: "Stable",
    bg: "rgba(245, 158, 11, 0.1)",
  },
  Declining: {
    icon: TrendingDown,
    class: "trend-declining",
    label: "Declining",
    bg: "rgba(34, 197, 94, 0.1)",
  },
};

function sparklineHeight(caseCount: number, index: number): number {
  const sequence = [0.42, 0.66, 0.5, 0.82, 0.58, 0.9];
  return Math.max(4, (caseCount / 15) * 32 * sequence[index % sequence.length]);
}

export function HotspotCard({ entry, rank }: HotspotCardProps) {
  const trend = TREND_CONFIG[entry.trend];
  const TrendIcon = trend.icon;
  const emoji = CATEGORY_ICONS[entry.crime_category] || "📋";

  return (
    <div className="glass-card rounded-2xl p-5 hover:border-[var(--color-border-accent)] transition-all duration-300 group shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {rank && (
            <span className="text-[10px] font-mono text-[var(--color-text-tertiary)] bg-[var(--color-bg-primary)] w-6 h-6 rounded-lg flex items-center justify-center border border-[var(--color-border-subtle)] font-bold">
              {rank}
            </span>
          )}
          <span className="text-xl">{emoji}</span>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {entry.crime_category}
            </p>
            <p className="text-[11px] text-[var(--color-text-tertiary)] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[var(--color-accent-cyan)]" />
              {entry.district}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ${trend.class}`}
          style={{ background: trend.bg }}
        >
          <TrendIcon className="w-3 h-3" />
          {trend.label}
        </div>
      </div>

      {/* case_count + Sparkline */}
      <div className="flex items-end justify-between pt-2 border-t border-[var(--color-border-subtle)]">
        <div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] font-mono tracking-tight">
            {entry.case_count}
          </p>
          <p className="text-[10px] text-[var(--color-text-tertiary)] font-mono mt-0.5">{entry.period}</p>
        </div>

        {/* Mini sparkline */}
        <div className="flex items-end gap-1 h-8">
          {Array.from({ length: 6 }, (_, i) => {
            const height = sparklineHeight(entry.case_count, i);
            return (
              <div
                key={i}
                className="sparkline-bar w-1.5 rounded-full"
                style={{
                  height: `${height}px`,
                  background:
                    entry.trend === "Rising"
                      ? "rgba(244, 63, 94, 0.6)"
                      : entry.trend === "Declining"
                      ? "rgba(16, 185, 129, 0.6)"
                      : "rgba(245, 158, 11, 0.6)",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Summary Stat Card ──

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  accent?: string;
}

export function StatCard({ label, value, icon, trend, accent = "cyan" }: StatCardProps) {
  const accentColors: Record<string, string> = {
    cyan: "var(--color-accent-cyan)",
    amber: "var(--color-accent-amber)",
    red: "var(--color-accent-red)",
    green: "var(--color-accent-green)",
    purple: "var(--color-accent-purple)",
  };

  return (
    <div className="glass-card rounded-2xl p-5 hover:border-[var(--color-border-accent)] transition-all duration-300 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--color-border-subtle)]"
          style={{ background: `${accentColors[accent]}15` }}
        >
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-semibold text-[var(--color-accent-green)] bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-[var(--color-text-primary)] font-mono tracking-tight">
        {value}
      </p>
      <p className="text-xs font-medium text-[var(--color-text-tertiary)] mt-1">{label}</p>
    </div>
  );
}
