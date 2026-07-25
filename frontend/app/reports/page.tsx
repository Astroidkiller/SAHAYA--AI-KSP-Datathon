"use client";

import { useState } from "react";
import { FileText, Download, Calendar, Plus, Search, X, CheckCircle, Sparkles, Filter } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { formatDistrict } from "@/lib/translations";

export default function ReportsPage() {
  const { t } = useLanguage();
  const [reports, setReports] = useState(t.initialReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDistrict, setNewDistrict] = useState("Bengaluru Urban");
  const [newType, setNewType] = useState<string>("Quarterly");

  // Keep reports synced if initial state changes or lang switches
  const currentReports = reports.length > 0 ? reports : t.initialReports;

  const filteredReports = currentReports.filter((r) => {
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

    const newReport = {
      id: `RPT-${String(currentReports.length + 1).padStart(3, "0")}`,
      title: newTitle.trim(),
      date: new Date().toISOString().split("T")[0],
      type: newType,
      status: "Ready",
      district: newDistrict,
      contentSummary: `Custom intelligence report generated for ${newDistrict} focusing on ${newType.toLowerCase()} analytics.`,
    };

    setReports([newReport, ...currentReports]);
    setIsModalOpen(false);
    setNewTitle("");
    showToast(`Report "${newReport.title}" generated successfully!`);
  };

  const handleDownloadPDF = (report: any) => {
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
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[var(--color-accent-copper)]" />
            {t.reportsTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {t.reportsSubtitle}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{t.generateReportBtn}</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[#111722] border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-[#0A0D12] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[var(--color-border-accent)]"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[var(--color-accent-copper)]" /> TYPE:
          </span>
          {["ALL", "Quarterly", "Intelligence", "Assessment", "Monthly"].map((typeItem) => (
            <button
              key={typeItem}
              onClick={() => setSelectedType(typeItem)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                selectedType === typeItem
                  ? "bg-[#192231] border-[var(--color-border-accent)] text-[#C28254] font-bold"
                  : "border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {typeItem === "ALL" ? t.typeAll : t.reportTypes[typeItem] || typeItem}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="bg-[#111722] border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400 font-mono">
            {t.noReports} {searchQuery ? `("${searchQuery}")` : ""}
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-[#111722] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[var(--color-border-accent)] transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#192231] border border-slate-800 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[var(--color-accent-copper)]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {report.contentSummary}
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5 mt-2">
                    <span className="text-[10px] font-mono text-[var(--color-accent-copper)] bg-[#0A0D12] px-2 py-0.5 rounded border border-slate-800">
                      {report.id}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {report.date}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-[#0A0D12] px-2 py-0.5 rounded font-mono">
                      {formatDistrict(report.district, t)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span
                  className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded ${
                    report.status === "Ready"
                      ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-950/40 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {t.statusLabels[report.status] || report.status}
                </span>

                {report.status === "Ready" && (
                  <button
                    onClick={() => handleDownloadPDF(report)}
                    className="bg-[#192231] border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:border-[var(--color-border-accent)] flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-[var(--color-accent-copper)]" />
                    <span>{t.printPdf}</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* PDF Export Note */}
      <div className="bg-[#111722] border border-slate-800 rounded-xl p-4">
        <p className="text-xs text-slate-400 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[var(--color-accent-copper)] shrink-0 mt-0.5" />
          <span>{t.smartBrowzNote}</span>
        </p>
      </div>

      {/* Generate Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#111722] w-full max-w-lg rounded-xl p-6 border border-[var(--color-border-accent)] shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[var(--color-accent-copper)]" />
                <h3 className="text-base font-bold text-slate-100">
                  {t.modalTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateReport} className="py-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  {t.modalTitleLabel}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Cybercrime Hotspots & Theft Surge Analysis"
                  className="w-full bg-[#0A0D12] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--color-border-accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    {t.modalDistrictLabel}
                  </label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full bg-[#0A0D12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--color-border-accent)]"
                  >
                    <option value="Bengaluru Urban">{formatDistrict("Bengaluru Urban", t)}</option>
                    <option value="Mysuru">{formatDistrict("Mysuru", t)}</option>
                    <option value="Hubballi-Dharwad">{formatDistrict("Hubballi-Dharwad", t)}</option>
                    <option value="Mangaluru">{formatDistrict("Mangaluru", t)}</option>
                    <option value="Belagavi">{formatDistrict("Belagavi", t)}</option>
                    <option value="Kalaburagi">{formatDistrict("Kalaburagi", t)}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    {t.modalTypeLabel}
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-[#0A0D12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--color-border-accent)]"
                  >
                    <option value="Quarterly">{t.reportTypes.Quarterly}</option>
                    <option value="Intelligence">{t.reportTypes.Intelligence}</option>
                    <option value="Assessment">{t.reportTypes.Assessment}</option>
                    <option value="Monthly">{t.reportTypes.Monthly}</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 cursor-pointer"
                >
                  {t.modalCancel}
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {t.modalSubmit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#111722] text-slate-100 border border-emerald-500/40 px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 text-xs font-medium animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
