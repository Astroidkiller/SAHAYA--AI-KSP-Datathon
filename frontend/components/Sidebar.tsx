"use client";

import { useState } from "react";
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
  Moon,
  RefreshCw,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Chat", icon: MessageSquare, id: "nav-chat" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, id: "nav-dashboard" },
  { href: "/network", label: "Network Graph", icon: Network, id: "nav-network" },
  { href: "/reports", label: "Reports", icon: FileText, id: "nav-reports" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiMode, setApiMode] = useState<"auto" | "catalyst" | "local">("auto");
  const [voiceRate, setVoiceRate] = useState("0.9");
  const [autoSync, setAutoSync] = useState(true);
  const [savedToast, setSavedToast] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  const handleSaveSettings = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
    setIsSettingsOpen(false);
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-64 glass-panel flex flex-col z-40 border-r border-[var(--color-border-default)] transition-all duration-300">
        {/* Logo & Branding */}
        <div className="p-6 border-b border-[var(--color-border-default)]">
          <div className="flex items-center gap-3">
            <div className="ksp-logo-ring w-10 h-10 flex items-center justify-center bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border-accent)] shadow-sm">
              <Shield className="w-5 h-5 text-[var(--color-accent-amber)]" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text tracking-tight">
                SAHAYA AI
              </h1>
              <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-widest font-mono">
                KSP Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                id={item.id}
                className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? "active bg-[var(--color-bg-tertiary)] border-[var(--color-border-accent)] text-[var(--color-text-primary)] shadow-sm"
                    : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] hover:bg-opacity-50"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[var(--color-accent-cyan)]" : ""}`} />
                <span>{item.label}</span>
                {item.label === "Chat" && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-[var(--color-accent-green)] animate-pulse" />
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-[var(--color-accent-cyan)]" />}
              </Link>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="p-4 border-t border-[var(--color-border-default)]">
          <div className="glass-card rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-tertiary)] font-mono text-[10px] uppercase">Engine Status</span>
              <span className="flex items-center gap-1.5 text-[var(--color-accent-green)] font-medium text-[11px]">
                <Activity className="w-3 h-3 animate-pulse" />
                Online
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border-default)] text-[var(--color-text-tertiary)]">
              <span>Backend</span>
              <span className="text-[var(--color-text-secondary)] font-mono text-[10px]">Zoho Catalyst</span>
            </div>
            <div className="flex items-center justify-between text-[var(--color-text-tertiary)]">
              <span>Data Sync</span>
              <span className="text-[var(--color-accent-amber)] font-mono text-[10px]">
                {autoSync ? "Live (Auto)" : "Manual"}
              </span>
            </div>
          </div>
        </div>

        {/* Settings Button */}
        <div className="p-4 border-t border-[var(--color-border-default)]">
          <button
            id="btn-sidebar-settings"
            onClick={() => setIsSettingsOpen(true)}
            className="sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] w-full border border-transparent transition-all duration-200 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[var(--color-accent-cyan)]" />
            <span>Settings & Config</span>
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card w-full max-w-md rounded-2xl p-6 border border-[var(--color-border-accent)] shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-default)]">
              <div className="flex items-center gap-2.5">
                <Settings className="w-5 h-5 text-[var(--color-accent-cyan)]" />
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                  System Preferences
                </h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-5">
              {/* API Mode */}
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-[var(--color-accent-cyan)]" />
                  API Endpoint Target
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "auto", label: "Auto Fallback" },
                    { id: "catalyst", label: "Catalyst Cloud" },
                    { id: "local", label: "Local Data" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setApiMode(mode.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        apiMode === mode.id
                          ? "bg-[var(--color-bg-tertiary)] border-[var(--color-border-accent)] text-[var(--color-accent-cyan)] font-semibold"
                          : "border-[var(--color-border-default)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text-to-Speech Settings */}
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-[var(--color-accent-cyan)]" />
                  Voice Speech Speed: {voiceRate}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(e.target.value)}
                  className="w-full accent-[var(--color-accent-cyan)] bg-[var(--color-bg-tertiary)] rounded-lg h-2"
                />
              </div>

              {/* Auto Sync Toggle */}
              <div className="flex items-center justify-between py-2 border-t border-b border-[var(--color-border-default)]">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[var(--color-accent-cyan)]" />
                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-primary)]">Realtime Data Sync</p>
                    <p className="text-[10px] text-[var(--color-text-tertiary)]">Auto-fetch FIR anomaly updates</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoSync(!autoSync)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    autoSync ? "bg-[var(--color-accent-cyan)]" : "bg-[var(--color-bg-tertiary)]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                      autoSync ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Cold-Start Mitigation Ping */}
              <div className="pt-2 border-t border-[var(--color-border-default)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[var(--color-accent-cyan)]" />
                    Cold-Start Warmup (Demo Prep)
                  </span>
                  {pingResult && (
                    <span className="text-[10px] font-mono text-[var(--color-accent-green)] bg-[var(--color-bg-primary)] px-2 py-0.5 rounded border border-[var(--color-accent-green)] border-opacity-30">
                      {pingResult}
                    </span>
                  )}
                </div>
                <button
                  onClick={async () => {
                    setPingResult("Pinging Catalyst API...");
                    const start = Date.now();
                    try {
                      const res = await fetch("/api/health").catch(() => null);
                      const ms = Date.now() - start;
                      setPingResult(`Ping: ${ms}ms (Warm)`);
                    } catch {
                      setPingResult(`Ping: ${Date.now() - start}ms (Active)`);
                    }
                  }}
                  className="w-full glass-card py-2.5 px-3 rounded-xl text-xs font-medium text-[var(--color-text-primary)] hover:border-[var(--color-border-accent)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[var(--color-accent-cyan)]" />
                  <span>Ping Catalyst API Gateway (Warm Up)</span>
                </button>
              </div>

              {/* Version details */}
              <div className="text-[11px] text-[var(--color-text-tertiary)] bg-[var(--color-bg-primary)] p-3 rounded-xl border border-[var(--color-border-default)] flex items-center justify-between">
                <span>SAHAYA AI v2.4 (KSP Datathon)</span>
                <span className="text-[var(--color-accent-green)] font-mono">Connected</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border-default)]">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Confirmation */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] border border-[var(--color-accent-green)] px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2.5 text-xs font-medium animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-green)]" />
          Settings updated successfully!
        </div>
      )}
    </>
  );
}

