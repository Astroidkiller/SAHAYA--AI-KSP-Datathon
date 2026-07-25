// ── SAHAYA AI — Official Karnataka State Police Portal Dictionaries ──

export type Language = "en" | "kn";

export interface ReportTranslationItem {
  id: string;
  title: string;
  date: string;
  type: string;
  status: string;
  district: string;
  contentSummary: string;
}

export interface Translations {
  govtBanner: string;
  appName: string;
  subTitle: string;
  kspTitle: string;
  confidentialBadge: string;
  
  // Navigation
  navChat: string;
  navDashboard: string;
  navNetwork: string;
  navReports: string;
  settingsTitle: string;

  // Header & Controls
  systemStatus: string;
  online: string;
  activeSession: string;
  refreshData: string;
  syncing: string;
  exportData: string;
  exportSession: string;
  allKarnataka: string;
  districtLabel: string;
  rangeLabel: string;
  fullYear: string;
  q4Period: string;
  last30Days: string;
  dashboardSubtitle: string;
  lastSynced: string;
  dataPeriod: string;

  // Gateway Ping & Status
  pingingGateway: string;
  gatewayActive: string;
  gatewayOffline: string;
  gatewayError: string;

  // Empty & Loading States
  noAnomalies: string;
  noHotspots: string;
  noReports: string;
  loadingIntelligence: string;

  // Dashboard Stats
  totalCases: string;
  risingHotspots: string;
  crimeRings: string;
  highRiskSuspects: string;
  highPriority: string;
  normalPriority: string;

  // Dashboard Subcomponents & Titles
  spatiotemporalTitle: string;
  peakCrimeTime: string;
  forecastTitle: string;
  correlationTitle: string;
  anomalyTitle: string;
  comparisonTitle: string;
  comparisonSubtext: string;
  showingEntries: string;

  // Map
  mapTitle: string;
  mapLow: string;
  mapMedium: string;
  mapSpike: string;

  // Chat
  chatHeader: string;
  chatSubtitle: string;
  suggestedQueriesTitle: string;
  inputPlaceholder: string;
  listeningKannada: string;
  listeningSubtext: string;
  exportChatToast: string;
  suggestedQueries: Array<{ label: string; icon: string }>;

  // Network
  networkTitle: string;
  networkSubtitle: string;
  suspectsCount: string;
  connectionsCount: string;
  highRiskCount: string;
  clustersCount: string;

  // Reports
  reportsTitle: string;
  reportsSubtitle: string;
  generateReportBtn: string;
  searchPlaceholder: string;
  printPdf: string;
  typeAll: string;
  reportTypes: Record<string, string>;
  statusLabels: Record<string, string>;
  smartBrowzNote: string;
  modalTitle: string;
  modalTitleLabel: string;
  modalDistrictLabel: string;
  modalTypeLabel: string;
  modalCancel: string;
  modalSubmit: string;
  initialReports: ReportTranslationItem[];

  // Footer
  footerText: string;

  // District Names Dictionary
  districts: Record<string, string>;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    govtBanner: "GOVERNMENT OF KARNATAKA • POLICE DEPARTMENT",
    appName: "SAHAYA AI",
    subTitle: "KSP Crime Intelligence Portal",
    kspTitle: "KARNATAKA STATE POLICE • SCRB",
    confidentialBadge: "OFFICIAL POLICE USE ONLY",
    
    // Navigation
    navChat: "Intelligence Chat",
    navDashboard: "Operations Dashboard",
    navNetwork: "Suspect Network",
    navReports: "Intelligence Dossiers",
    settingsTitle: "Portal Config",

    // Header & Controls
    systemStatus: "SCRB System",
    online: "ACTIVE",
    activeSession: "Active Session",
    refreshData: "Sync Intelligence",
    syncing: "Syncing...",
    exportData: "Export Dossier",
    exportSession: "Export Session",
    allKarnataka: "All Districts",
    districtLabel: "District:",
    rangeLabel: "Range:",
    fullYear: "2024 - 2025 Full Year",
    q4Period: "Q4 2024 (Oct - Dec)",
    last30Days: "Last 30 Days",
    dashboardSubtitle: "Karnataka State Police • State Crime Records Bureau (SCRB)",
    lastSynced: "Synced",
    dataPeriod: "Data Period",

    // Gateway Ping & Status
    pingingGateway: "Pinging Gateway...",
    gatewayActive: "Gateway Active",
    gatewayOffline: "Local Mode (Offline)",
    gatewayError: "Gateway Error",

    // Empty & Loading States
    noAnomalies: "No statistical anomalies detected. All trends within 2σ normal variance.",
    noHotspots: "No hotspots found matching selected filter.",
    noReports: "No reports found matching search criteria.",
    loadingIntelligence: "Loading intelligence data...",

    // Dashboard Stats
    totalCases: "Total FIR Cases",
    risingHotspots: "Surge Hotspots",
    crimeRings: "Crime Syndicates",
    highRiskSuspects: "High-Risk Suspects",
    highPriority: "⬆ High Priority Alert",
    normalPriority: "Normal Range",

    // Dashboard Subcomponents & Titles
    spatiotemporalTitle: "Spatiotemporal Crime Pattern (7×24)",
    peakCrimeTime: "PEAK CRIME TIME",
    forecastTitle: "Crime Trend Forecasting (3-Month Reg)",
    correlationTitle: "Socio-Economic Crime Correlation",
    anomalyTitle: "Z-Score Anomaly Alerts",
    comparisonTitle: "District Case Load Comparison",
    comparisonSubtext: "Click a bar to filter dashboard",
    showingEntries: "Showing entries",

    // Map
    mapTitle: "Karnataka Geospatial Crime Matrix (Google Maps)",
    mapLow: "Low Density",
    mapMedium: "Elevated",
    mapSpike: "Spike Alert",

    // Chat
    chatHeader: "SCRB Intelligence Assistant",
    chatSubtitle: "Contextual RAG & SCRB Database Queries",
    suggestedQueriesTitle: "Recommended Operations Queries:",
    inputPlaceholder: "Type FIR query, suspect name, MO pattern, or use mic...",
    listeningKannada: "🎤 Listening for Kannada voice input...",
    listeningSubtext: "Auto-transcription active. Speak clearly into mic.",
    exportChatToast: "Chat log exported successfully!",
    suggestedQueries: [
      { label: "Which district has the highest theft cases?", icon: "📊" },
      { label: "Tell me about chain snatching patterns near MG Road", icon: "🔍" },
      { label: "Show suspect network connections", icon: "🕸️" },
      { label: "Profile of suspect Ravi Kumar", icon: "👤" },
      { label: "Summarize FIR-2024-BLR-0042 and find similar cases", icon: "📝" },
      { label: "Show emerging crime trends or spikes", icon: "⚠️" },
    ],

    // Network
    networkTitle: "Suspect Network Graph",
    networkSubtitle: "Force-directed criminal syndicate connection matrix",
    suspectsCount: "Logged Suspects",
    connectionsCount: "Linked Cases",
    highRiskCount: "Red Category",
    clustersCount: "Syndicate Groups",

    // Reports
    reportsTitle: "Official Intelligence Reports",
    reportsSubtitle: "Exportable FIR dossiers & predictive trend briefs",
    generateReportBtn: "Generate New Dossier",
    searchPlaceholder: "Search report title, ID, or district...",
    printPdf: "Print Official PDF",
    typeAll: "All Types",
    reportTypes: {
      Quarterly: "Quarterly",
      Intelligence: "Intelligence",
      Assessment: "Assessment",
      Monthly: "Monthly",
    },
    statusLabels: {
      Ready: "Ready",
      Processing: "Processing",
    },
    smartBrowzNote: "Zoho Catalyst SmartBrowz Integration: Official PDF dossiers rendered via headless browser engine.",
    modalTitle: "Generate Intelligence Dossier",
    modalTitleLabel: "Report Title",
    modalDistrictLabel: "Target District",
    modalTypeLabel: "Report Type",
    modalCancel: "Cancel",
    modalSubmit: "Generate Dossier",
    initialReports: [
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
    ],

    // Footer
    footerText: "Official Portal of Karnataka State Police • SCRB • Government of Karnataka",

    // District Translation Map
    districts: {
      "Bengaluru Urban": "Bengaluru Urban",
      "Bengaluru Rural": "Bengaluru Rural",
      Mysuru: "Mysuru",
      Mangaluru: "Mangaluru",
      "Mangaluru & Udupi": "Mangaluru & Udupi",
      "Hubli-Dharwad": "Hubballi-Dharwad",
      "Hubballi-Dharwad": "Hubballi-Dharwad",
      Belagavi: "Belagavi",
      Kalaburagi: "Kalaburagi",
      Shivamogga: "Shivamogga",
      Tumakuru: "Tumakuru",
      Davangere: "Davangere",
    },
  },

  kn: {
    govtBanner: "ಕರ್ನಾಟಕ ಸರ್ಕಾರ • ಪೊಲೀಸ್ ಇಲಾಖೆ",
    appName: "ಸಹಾಯ AI",
    subTitle: "ಕೆಎಸ್‌ಪಿ ಅಪರಾಧ ಬುದ್ಧಿವಂತಿಕೆ ವ್ಯವಸ್ಥೆ",
    kspTitle: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ • ಎಸ್‌ಸಿಆರ್‌ಬಿ",
    confidentialBadge: "ಅಧಿಕೃತ ಪೊಲೀಸ್ ಬಳಕೆಗೆ ಮಾತ್ರ",

    // Navigation
    navChat: "ಬುದ್ಧಿವಂತ ಸಂಭಾಷಣೆ",
    navDashboard: "ಕಾರ್ಯಾಚರಣೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    navNetwork: "ಸಂಶಯಾಸ್ಪದ ನೆಟ್‌ವರ್ಕ್",
    navReports: "ಅಪರಾಧ ವರದಿಗಳು (Dossiers)",
    settingsTitle: "ಪೋರ್ಟಲ್ ಸಂರಚನೆ",

    // Header & Controls
    systemStatus: "ಎಸ್‌ಸಿಆರ್‌ಬಿ ವ್ಯವಸ್ಥೆ",
    online: "ಸಕ್ರಿಯವಾಗಿದೆ",
    activeSession: "ಸಕ್ರಿಯ ಸೆಷನ್",
    refreshData: "ಡೇಟಾ ನವೀಕರಿಸಿ",
    syncing: "ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...",
    exportData: "ವರದಿ ರಫ್ತು ಮಾಡಿ",
    exportSession: "ಸೆಷನ್ ರಫ್ತು ಮಾಡಿ",
    allKarnataka: "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು",
    districtLabel: "ಜಿಲ್ಲೆ:",
    rangeLabel: "ಅವಧಿ:",
    fullYear: "2024 - 2025 ಸಂಪೂರ್ಣ ವರ್ಷ",
    q4Period: "Q4 2024 (ಅಕ್ಟೋಬರ್ - ಡಿಸೆಂಬರ್)",
    last30Days: "ಕಳೆದ 30 ದಿನಗಳು",
    dashboardSubtitle: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ • ರಾಜ್ಯ ಅಪರಾಧ ದಾಖಲೆಗಳ ಬ್ಯೂರೋ (SCRB)",
    lastSynced: "ನವೀಕರಿಸಿದ ಸಮಯ",
    dataPeriod: "ಮಾಹಿತಿಯ ಅವಧಿ",

    // Gateway Ping & Status
    pingingGateway: "ಗೇಟ್‌ವೇ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    gatewayActive: "ಗೇಟ್‌ವೇ ಸಕ್ರಿಯವಾಗಿದೆ",
    gatewayOffline: "ಲೋಕಲ್ ಮೋಡ್ (ಆಫ್‌ಲೈನ್)",
    gatewayError: "ಗೇಟ್‌ವೇ ದೋಷ",

    // Empty & Loading States
    noAnomalies: "ಯಾವುದೇ ತೀವ್ರ ಅಪರಾಧ ವ್ಯತ್ಯಾಸಗಳು ಕಂಡುಬಂದಿಲ್ಲ (2σ ಸಾಮಾನ್ಯ ಮಟ್ಟ).",
    noHotspots: "ಆಯ್ಕೆಮಾಡಿದ ಫಿಲ್ಟರ್‌ಗೆ ಯಾವುದೇ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    noReports: "ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ವರದಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    loadingIntelligence: "ಮಾಹಿತಿಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",

    // Dashboard Stats
    totalCases: "ಒಟ್ಟು ಎಫ್‌ಐಆರ್ (FIR) ಪ್ರಕರಣಗಳು",
    risingHotspots: "ಹೆಚ್ಚುತ್ತಿರುವ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು",
    crimeRings: "ಅಪರಾಧ ಜಾಲಗಳು",
    highRiskSuspects: "ಹೆಚ್ಚಿನ ಅಪಾಯದ ಆರೋಪಿಗಳು",
    highPriority: "⬆ ಹೆಚ್ಚಿನ ಆದ್ಯತೆಯ ಎಚ್ಚರಿಕೆ",
    normalPriority: "ಸಾಮಾನ್ಯ ಮಟ್ಟ",

    // Dashboard Subcomponents & Titles
    spatiotemporalTitle: "ಕಾಲ ಮತ್ತು ಸ್ಥಳ ಆಧಾರಿತ ಅಪರಾಧ ಮಾದರಿ (7×24)",
    peakCrimeTime: "ಗರಿಷ್ಠ ಅಪರಾಧದ ಸಮಯ",
    forecastTitle: "ಅಪರಾಧ ಪ್ರವೃತ್ತಿ ಮುನ್ಸೂಚನೆ (3 ತಿಂಗಳ ವರದಿ)",
    correlationTitle: "ಸಾಮಾಜಿಕ-ಆರ್ಥಿಕ ಅಪರಾಧ ಸಂಬಂಧ",
    anomalyTitle: "ಅಪರಾಧ ಹೆಚ್ಚಳದ ತೀವ್ರ ಎಚ್ಚರಿಕೆಗಳು (Z-Score)",
    comparisonTitle: "ಜಿಲ್ಲಾವಾರು ಪ್ರಕರಣಗಳ ಪ್ರಮಾಣ ಹೋಲಿಕೆ",
    comparisonSubtext: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಫಿಲ್ಟರ್ ಮಾಡಲು ಬಾರ್ ಕ್ಲಿಕ್ ಮಾಡಿ",
    showingEntries: "ತೋರಿಸಲಾಗುತ್ತಿರುವ ಎಂಟ್ರಿಗಳು",

    // Map
    mapTitle: "ಕರ್ನಾಟಕ ಭೂಗೋಳ ಅಪರಾಧ ನಕ್ಷೆ (ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್)",
    mapLow: "ಕಡಿಮೆ",
    mapMedium: "ಮಧ್ಯಮ",
    mapSpike: "ತೀವ್ರ ಎಚ್ಚರಿಕೆ",

    // Chat
    chatHeader: "ಎಸ್‌ಸಿಆರ್‌ಬಿ ಬುದ್ಧಿವಂತ ಸಹಾಯಕ",
    chatSubtitle: "ಸಂದರ್ಭೋಚಿತ RAG ಮತ್ತು ಎಸ್‌ಸಿಆರ್‌ಬಿ ಡೇಟಾಬೇಸ್",
    suggestedQueriesTitle: "ಶಿಫಾರಸು ಮಾಡಿದ ಪ್ರಶ್ನೆಗಳು:",
    inputPlaceholder: "ಎಫ್‌ಐಆರ್ (FIR), ಆರೋಪಿಯ ಹೆಸರು, ಅಥವಾ ಕಳ್ಳತನದ ವಿವರ ನಮೂದಿಸಿ...",
    listeningKannada: "🎤 ಕನ್ನಡ ಧ್ವನಿ ಆಲಿಸಲಾಗುತ್ತಿದೆ...",
    listeningSubtext: "ಸ್ವಯಂಚಾಲಿತ ಪ್ರತಿಲೇಖನ ಸಕ್ರಿಯವಾಗಿದೆ.",
    exportChatToast: "ಸಂಭಾಷಣೆಯ ದಾಖಲೆ ರಫ್ತು ಮಾಡಲಾಗಿದೆ!",
    suggestedQueries: [
      { label: "ಯಾವ ಜಿಲ್ಲೆಯಲ್ಲಿ ಹೆಚ್ಚಿನ ಕಳ್ಳತನ ಪ್ರಕರಣಗಳಿವೆ?", icon: "📊" },
      { label: "ಎಂ.ಜಿ. ರಸ್ತೆ ಹತ್ತಿರದ ಸರಗಳ್ಳತನದ ವಿವರ ತಿಳಿಸಿ", icon: "🔍" },
      { label: "ಆರೋಪಿಗಳ ಅಪರಾಧ ಜಾಲದ ಸಂಪರ್ಕಗಳನ್ನು ತೋರಿಸಿ", icon: "🕸️" },
      { label: "ಆರೋಪಿ ರವಿ ಕುಮಾರ್ ಅವರ ಕ್ರಿಮಿನಲ್ ಪ್ರೊಫೈಲ್", icon: "👤" },
      { label: "FIR-2024-BLR-0042 ಸಾರಾಂಶ ಮತ್ತು ಇದೇ ರೀತಿಯ ಪ್ರಕರಣಗಳು", icon: "📝" },
      { label: "ಇತ್ತೀಚೆಗೆ ಹೆಚ್ಚುತ್ತಿರುವ ಅಪರಾಧ ಟ್ರೆಂಡ್‌ಗಳನ್ನು ತೋರಿಸಿ", icon: "⚠️" },
    ],

    // Network
    networkTitle: "ಸಂಶಯಾಸ್ಪದ ನೆಟ್‌ವರ್ಕ್ ಗ್ರಾಫ್",
    networkSubtitle: "ಅಪರಾಧ ಜಾಲಗಳ ಸಂಬಂಧಗಳ ನಕ್ಷೆ",
    suspectsCount: "ದಾಖಲಾದ ಆರೋಪಿಗಳು",
    connectionsCount: "ಸಂಪರ್ಕಿತ ಪ್ರಕರಣಗಳು",
    highRiskCount: "ತೀವ್ರ ಅಪಾಯಕಾರಿ (ಕೆಂಪು)",
    clustersCount: "ಅಪರಾಧ ಗುಂಪುಗಳು",

    // Reports
    reportsTitle: "ಅಧಿಕೃತ ಅಪರಾಧ ವರದಿಗಳು",
    reportsSubtitle: "ಮುದ್ರಿಸಬಹುದಾದ ಎಫ್‌ಐಆರ್ (FIR) ವರದಿಗಳು",
    generateReportBtn: "ಹೊಸ ವರದಿ ರಚಿಸಿ",
    searchPlaceholder: "ವರದಿಯ ಹೆಸರು ಅಥವಾ ಜಿಲ್ಲೆ ಹುಡುಕಿ...",
    printPdf: "ಪಿಡಿಎಫ್ ಮುದ್ರಿಸಿ",
    typeAll: "ಎಲ್ಲಾ ಪ್ರಕಾರಗಳು",
    reportTypes: {
      Quarterly: "Quarterly (ತ್ರೈಮಾಸಿಕ)",
      Intelligence: "Intelligence (ಬುದ್ಧಿವಂತಿಕೆ ವರದಿ)",
      Assessment: "Assessment (ಮೌಲ್ಯಮಾಪನ)",
      Monthly: "Monthly (ಮಾಸಿಕ)",
    },
    statusLabels: {
      Ready: "Ready (ಸಿದ್ಧವಾಗಿದೆ)",
      Processing: "Processing (ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ)",
    },
    smartBrowzNote: "ಜೋಹೋ ಕ್ಯಾಟಲಿಸ್ಟ್ ಸ್ಮಾರ್ಟ್ ಬ್ರೌಸ್ ಸಂಯೋಜನೆ: ಪೊಲೀಸ್ ಅಪರಾಧ ವರದಿಗಳನ್ನು ಪಿಡಿಎಫ್ (PDF) ರೂಪದಲ್ಲಿ ಮುದ್ರಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ.",
    modalTitle: "ಅಪರಾಧ ವರದಿ ರಚಿಸಿ",
    modalTitleLabel: "ವರದಿಯ ಶೀರ್ಷಿಕೆ",
    modalDistrictLabel: "ಉದ್ದೇಶಿತ ಜಿಲ್ಲೆ",
    modalTypeLabel: "ವರದಿಯ ಪ್ರಕಾರ",
    modalCancel: "ರದ್ದುಮಾಡಿ",
    modalSubmit: "ವರದಿ ರಚಿಸಿ",
    initialReports: [
      {
        id: "RPT-001",
        title: "Bengaluru Urban Crime Summary Q4 2024 (ಬೆಂಗಳೂರು ನಗರ ಅಪರಾಧ ಸಾರಾಂಶ)",
        date: "2024-12-15",
        type: "Quarterly",
        status: "Ready",
        district: "Bengaluru Urban",
        contentSummary: "Quarterly statistical breakdown of Property Crime vs Violent Crime across 14 police stations in Bengaluru Urban.",
      },
      {
        id: "RPT-002",
        title: "Drug Network Analysis — Cross-District Syndicate (ಮಾದಕ ದ್ರವ್ಯ ಜಾಲ ವಿಶ್ಲೇಷಣೆ)",
        date: "2024-12-10",
        type: "Intelligence",
        status: "Ready",
        district: "Mangaluru & Udupi",
        contentSummary: "Suspect connection graph mapping 12 key operatives involved in NDPS syndicate operations.",
      },
      {
        id: "RPT-003",
        title: "Suspect Risk Assessment — Batch 12 High Risk Profiles (ಆರೋಪಿಗಳ ಮೌಲ್ಯಮಾಪನ)",
        date: "2024-12-08",
        type: "Assessment",
        status: "Processing",
        district: "Mysuru",
        contentSummary: "Automated risk scores derived from past FIR frequency, gang ties, and bail violations.",
      },
      {
        id: "RPT-004",
        title: "Monthly Crime Trend & Anomaly Report — November (ಮಾಸಿಕ ಅಪರಾಧ ಪ್ರವೃತ್ತಿ ವರದಿ)",
        date: "2024-11-30",
        type: "Monthly",
        status: "Ready",
        district: "Hubballi-Dharwad",
        contentSummary: "Spatiotemporal hotspot shifts and nighttime theft spikes detected by forecaster circuit worker.",
      },
    ],

    // Footer
    footerText: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ • ಎಸ್‌ಸಿಆರ್‌ಬಿ (SCRB) • ಕರ್ನಾಟಕ ಸರ್ಕಾರ",

    // District Translation Map
    districts: {
      "Bengaluru Urban": "Bengaluru Urban (ಬೆಂಗಳೂರು ನಗರ)",
      "Bengaluru Rural": "Bengaluru Rural (ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ)",
      Mysuru: "Mysuru (ಮೈಸೂರು)",
      Mangaluru: "Mangaluru (ಮಂಗಳೂರು)",
      "Mangaluru & Udupi": "Mangaluru & Udupi (ಮಂಗಳೂರು ಮತ್ತು ಉಡುಪಿ)",
      "Hubli-Dharwad": "Hubballi-Dharwad (ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ)",
      "Hubballi-Dharwad": "Hubballi-Dharwad (ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ)",
      Belagavi: "Belagavi (ಬೆಳಗಾವಿ)",
      Kalaburagi: "Kalaburagi (ಕಲಬುರಗಿ)",
      Shivamogga: "Shivamogga (ಶಿವಮೊಗ್ಗ)",
      Tumakuru: "Tumakuru (ತುಮಕೂರು)",
      Davangere: "Davangere (ದಾವಣಗೆರೆ)",
    },
  },
};

/** Helper to format district name into selected language */
export function formatDistrict(name: string, t: Translations): string {
  return t.districts[name] || name;
}
