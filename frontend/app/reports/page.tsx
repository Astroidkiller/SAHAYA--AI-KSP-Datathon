"use client";

import { useState } from "react";
import { FileText, Download, Printer, Calendar, Plus, Search, X, CheckCircle, Sparkles, Filter } from "lucide-react";

interface ReportItem {
  id: string;
  title: string;
  date: string;
  type: "Quarterly" | "Intelligence" | "Assessment" | "Monthly" | "Hotspot";
  status: "Ready" | "Processing";
  district: string;
  contentSummary?: string;
}

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: "RPT-001",
    title: "Bengaluru Urban Crime Summary Q4 2024",
    date: "2024-12-15",
    type: "Quarterly",
    status: "Ready",
    district: "Bengaluru Urban",
    contentSummary: "Quarterly statistical breakdown of Property Crime vs Violent Crime across 14 police stations in Bengaluru Urban.",
  },
  {
    id: "RPT-002",
    title: "Drug Network Analysis — Cross-District Syndicate",
    date: "2024-12-10",
    type: "Intelligence",
    status: "Ready",
    district: "Mangaluru & Udupi",
    contentSummary: "Suspect connection graph mapping 12 key operatives involved in NDPS syndicate operations.",
  },
  {
    id: "RPT-003",
    title: "Suspect Risk Assessment — Batch 12 High Risk Profiles",
    date: "2024-12-08",
    type: "Assessment",
    status: "Processing",
    district: "Mysuru",
    contentSummary: "Automated risk scores derived from past FIR frequency, gang ties, and bail violations.",
  },
  {
    id: "RPT-004",
    title: "Monthly Crime Trend & Anomaly Report — November",
    date: "2024-11-30",
    type: "Monthly",
    status: "Ready",
    district: "Hubballi-Dharwad",
    contentSummary: "Spatiotemporal hotspot shifts and nighttime theft spikes detected by forecaster circuit worker.",
  },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDistrict, setNewDistrict] = useState("Bengaluru Urban");
  const [newType, setNewType] = useState<ReportItem["type"]>("Quarterly");

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "ALL" || r.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReport: ReportItem = {
      id: `RPT-00${reports.length + 1}`,
      title: newTitle.trim(),
      date: new Date().toISOString().split("T")[0],
      type: newType,
      status: "Ready",
      district: newDistrict,
      contentSummary: `Custom intelligence report generated for ${newDistrict} focusing on ${newType.toLowerCase()} analytics and crime patterns.`,
    };

    setReports([newReport, ...reports]);
    setIsModalOpen(false);
    setNewTitle("");
    showToast(`Report "${newReport.title}" generated successfully!`);
  };

  const handleDownloadPDF = (report: ReportItem) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("Pop-up blocked. Please allow pop-ups to print PDF.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${report.title} — KSP Intelligence</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            h1 { color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 8px; }
            .meta { font-size: 12px; color: #64748b; margin-bottom: 20px; }
            .badge { background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
            .content { background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 20px; }
            footer { margin-top: 50px; font-size: 11px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="meta">KARNATAKA STATE POLICE — SAHAYA AI INTELLIGENCE SYSTEM</div>
          <h1>${report.title}</h1>
          <p><strong>Report ID:</strong> <span class="badge">${report.id}</span> | <strong>Date:</strong> ${report.date}</p>
          <p><strong>Type:</strong> ${report.type} | <strong>District:</strong> ${report.district}</p>
          <div class="content">
            <h3>Executive Summary</h3>
            <p>${report.contentSummary || "Intelligence data extracted from FIR records and predictive AI models."}</p>
            <p>Generated via Zoho Catalyst Headless SmartBrowz Engine.</p>
          </div>
          <footer>Confidential — For Police Department Use Only • SAHAYA AI Intelligence Platform</footer>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
    showToast(`PDF print dialogue opened for ${report.id}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border-default)] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
            <FileText className="w-7 h-7 text-[var(--color-accent-cyan)]" />
            Intelligence Reports
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
            Generated dossiers, case summaries, and exportable PDF intelligence
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Report</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[var(--color-text-tertiary)] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report title, ID, or district..."
            className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-xl pl-9 pr-4 py-2 text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-border-accent)]"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs text-[var(--color-text-tertiary)] flex items-center gap-1">
            <Filter className="w-3 h-3 text-[var(--color-accent-cyan)]" /> Type:
          </span>
          {["ALL", "Quarterly", "Intelligence", "Assessment", "Monthly"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                selectedType === t
                  ? "bg-[var(--color-bg-tertiary)] border-[var(--color-border-accent)] text-[var(--color-accent-cyan)] font-semibold"
                  : "border-[var(--color-border-default)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-xs text-[var(--color-text-tertiary)]">
            No reports found matching &quot;{searchQuery}&quot;.
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[var(--color-border-accent)] transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-accent)] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[var(--color-accent-cyan)]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {report.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                    {report.contentSummary}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="text-[10px] font-mono text-[var(--color-accent-cyan)] bg-[var(--color-bg-primary)] px-2 py-0.5 rounded border border-[var(--color-border-default)]">
                      {report.id}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-tertiary)] flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {report.date}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-tertiary)] bg-[var(--color-bg-primary)] px-2 py-0.5 rounded">
                      {report.district}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span
                  className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${
                    report.status === "Ready"
                      ? "bg-[var(--color-accent-green)] bg-opacity-15 text-[var(--color-accent-green)] border border-[var(--color-accent-green)] border-opacity-30"
                      : "bg-[var(--color-accent-amber)] bg-opacity-15 text-[var(--color-accent-amber)] border border-[var(--color-accent-amber)] border-opacity-30"
                  }`}
                >
                  {report.status}
                </span>

                {report.status === "Ready" && (
                  <button
                    onClick={() => handleDownloadPDF(report)}
                    className="glass-card px-3.5 py-1.5 rounded-xl text-xs font-medium text-[var(--color-text-primary)] hover:border-[var(--color-border-accent)] flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-[var(--color-accent-cyan)]" />
                    <span>Print PDF</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* PDF Export Note */}
      <div className="glass-card rounded-2xl p-5 border border-[var(--color-border-default)]">
        <p className="text-xs text-[var(--color-text-tertiary)] flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[var(--color-accent-cyan)] shrink-0 mt-0.5" />
          <span>
            <strong>Zoho Catalyst SmartBrowz Integration:</strong> Automated PDF report generation connects directly to Catalyst Headless PDF rendering functions. Click &quot;Print PDF&quot; on any report to generate a formal police dossier layout.
          </span>
        </p>
      </div>

      {/* Generate Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card w-full max-w-lg rounded-2xl p-6 border border-[var(--color-border-accent)] shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-default)]">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[var(--color-accent-cyan)]" />
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                  Generate Intelligence Dossier
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateReport} className="py-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1.5">
                  Report Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Cybercrime Hotspots & Theft Surge Analysis"
                  className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-border-accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1.5">
                    Target District
                  </label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-xl px-3 py-2.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-border-accent)]"
                  >
                    <option value="Bengaluru Urban">Bengaluru Urban</option>
                    <option value="Mysuru">Mysuru</option>
                    <option value="Hubballi-Dharwad">Hubballi-Dharwad</option>
                    <option value="Mangaluru">Mangaluru</option>
                    <option value="Belagavi">Belagavi</option>
                    <option value="Kalaburagi">Kalaburagi</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1.5">
                    Report Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-xl px-3 py-2.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-border-accent)]"
                  >
                    <option value="Quarterly">Quarterly</option>
                    <option value="Intelligence">Intelligence</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-default)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-tertiary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Generate Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] border border-[var(--color-accent-green)] px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 text-xs font-medium animate-fade-in">
          <CheckCircle className="w-4 h-4 text-[var(--color-accent-green)]" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}

