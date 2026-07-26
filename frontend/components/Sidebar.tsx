"use client";

import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  LayoutDashboard,
  Network,
  FileText,
  Shield,
  Settings,
  Activity,
  X,
  Database,
  Volume2,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  Globe,
  Lock
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function Sidebar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiMode, setApiMode] = useState<"auto" | "catalyst" | "local">("auto");
  const [voiceRate, setVoiceRate] = useState("0.9");
  const [autoSync, setAutoSync] = useState(true);
  const [savedToast, setSavedToast] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);
  const isPingingRef = useRef(false);

  const NAV_ITEMS = [
    { href: "/", label: t.navChat, icon: MessageSquare, id: "nav-chat" },
    { href: "/dashboard/", label: t.navDashboard, icon: LayoutDashboard, id: "nav-dashboard" },
    { href: "/network/", label: t.navNetwork, icon: Network, id: "nav-network" },
    { href: "/reports/", label: t.navReports, icon: FileText, id: "nav-reports" },
  ];

  const handleSaveSettings = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
    setIsSettingsOpen(false);
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-64 glass-panel flex flex-col z-40 border-r border-[#1e293b]">
        {/* Official Govt of Karnataka Top Banner */}
        <div className="bg-[#0b1320] px-4 py-1.5 border-b border-amber-600/30 flex items-center justify-between text-[9px] font-mono text-amber-500/90 font-bold tracking-wider uppercase">
          <span>{t.govtBanner}</span>
        </div>

        {/* KSP Official Logo & Branding */}
        <div className="p-4 border-b border-slate-800 bg-[#0f172a]/60">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition-all cursor-pointer group"
            title={t.navChat}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-[#1e293b] rounded-lg border border-amber-500/40 shadow-inner shrink-0 group-hover:border-amber-400">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-100 font-mono group-hover:text-amber-400 transition-colors">
                {t.appName}
              </h1>
              <p className="text-[9px] text-amber-400/90 uppercase tracking-widest font-mono font-bold">
                {t.kspTitle}
              </p>
            </div>
          </Link>

          {/* Official Use Tag */}
          <div className="mt-2.5 flex items-center gap-1 text-[9px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            <Lock className="w-2.5 h-2.5 text-amber-400" />
            <span>{t.confidentialBadge}</span>
          </div>

          {/* Language Switcher Pill */}
          <div className="mt-3 flex items-center justify-between bg-[#070b12] p-1 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 px-2 flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-400" /> BILINGUAL:
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-amber-500 text-slate-950 font-extrabold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("kn")}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  language === "kn"
                    ? "bg-amber-500 text-slate-950 font-extrabold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const currentPath = (pathname || "").toLowerCase();
            const isActive = currentPath.includes("dashboard")
              ? item.href.includes("dashboard")
              : currentPath.includes("network")
              ? item.href.includes("network")
              : currentPath.includes("reports")
              ? item.href.includes("reports")
              : item.href === "/";
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                id={item.id}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all border ${
                  isActive
                    ? "bg-[#1e293b] border-amber-500/50 text-slate-100 shadow-sm"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]/40"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-400" : ""}`} />
                <span>{item.label}</span>
                {item.href === "/" && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-amber-400" />}
              </a>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="p-3 border-t border-slate-800">
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-mono text-[10px] uppercase">{t.systemStatus}</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] font-bold">
                <Activity className="w-3 h-3 animate-pulse" />
                {t.online}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-slate-400 text-[11px]">
              <span>Platform</span>
              <span className="text-slate-200 font-mono text-[10px]">Zoho Catalyst</span>
            </div>
          </div>
        </div>

        {/* Settings Action Button */}
        <div className="p-3 border-t border-slate-800">
          <button
            id="btn-sidebar-settings"
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-[#1e293b] w-full border border-transparent transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>{t.settingsTitle}</span>
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0f172a] w-full max-w-md rounded-xl p-6 border border-amber-500/40 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Settings className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100">
                  {t.settingsTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Language Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  Bilingual Display Mode / ಭಾಷೆ
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      language === "en"
                        ? "bg-[#1e293b] border-amber-500/50 text-amber-400 font-extrabold"
                        : "border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    English (Default)
                  </button>
                  <button
                    onClick={() => setLanguage("kn")}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      language === "kn"
                        ? "bg-[#1e293b] border-amber-500/50 text-amber-400 font-extrabold"
                        : "border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    ಕನ್ನಡ (Bilingual English)
                  </button>
                </div>
              </div>

              {/* Endpoint Target */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  API Gateway Target
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "auto", label: "Auto Gateway" },
                    { id: "catalyst", label: "Catalyst Cloud" },
                    { id: "local", label: "SCRB Local" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setApiMode(mode.id as any)}
                      className={`px-2 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        apiMode === mode.id
                          ? "bg-[#1e293b] border-amber-500/50 text-amber-400 font-bold"
                          : "border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text-to-Speech Settings */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  Voice Speech Speed: {voiceRate}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(e.target.value)}
                  className="w-full accent-amber-400 bg-slate-800 rounded-lg h-2"
                />
              </div>

              {/* Auto Sync Toggle */}
              <div className="flex items-center justify-between py-2 border-t border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Realtime Data Sync</p>
                    <p className="text-[10px] text-slate-400">Auto-fetch FIR anomaly updates</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoSync(!autoSync)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    autoSync ? "bg-amber-500" : "bg-slate-800"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      autoSync ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Cold-Start Mitigation Ping */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    Gateway Warmup
                  </span>
                  {pingResult && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-emerald-500/30">
                      {pingResult}
                    </span>
                  )}
                </div>
                <button
                  onClick={async () => {
                    if (isPingingRef.current) return;
                    isPingingRef.current = true;
                    setPingResult(t.pingingGateway);
                    const start = Date.now();
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 4000);
                    try {
                      const res = await fetch("/api/health", { signal: controller.signal });
                      clearTimeout(timeoutId);
                      if (!res.ok) {
                        setPingResult(`${t.gatewayError} (${res.status})`);
                        return;
                      }
                      const ms = Date.now() - start;
                      setPingResult(`${t.gatewayActive} (${ms}ms)`);
                    } catch (err: any) {
                      clearTimeout(timeoutId);
                      if (err?.name === "AbortError") {
                        setPingResult(`${t.gatewayOffline} (${t.gatewayTimeout})`);
                      } else if (err?.message?.includes("HTTP")) {
                        setPingResult(`${t.gatewayError} (${err.message})`);
                      } else {
                        setPingResult(t.gatewayOffline);
                      }
                    } finally {
                      isPingingRef.current = false;
                    }
                  }}
                  className="w-full bg-[#1e293b] py-2 px-3 rounded-lg text-xs font-bold text-slate-200 hover:border-amber-500/40 flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-800"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ping Catalyst API Gateway</span>
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="btn-primary px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5 cursor-pointer bg-amber-500 text-slate-950 hover:bg-amber-400"
              >
                Save Config
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Confirmation */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 bg-[#0f172a] text-slate-100 border border-emerald-500/40 px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Settings updated successfully!
        </div>
      )}
    </>
  );
}
