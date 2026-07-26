"use client";

import { useState, useEffect } from "react";
import { ChatWindow } from "./ChatWindow";
import dynamic from "next/dynamic";

// Lazy-load heavy page components to keep initial bundle fast
const DashboardPage = dynamic(() => import("@/app/dashboard/page"), { ssr: false });
const NetworkPage = dynamic(() => import("@/app/network/page"), { ssr: false });
const ReportsPage = dynamic(() => import("@/app/reports/page"), { ssr: false });

/**
 * Client-side URL router for Zoho Slate static hosting.
 *
 * Zoho Slate serves the root index.html for ALL URLs (SPA fallback).
 * This component reads window.location.pathname and renders the correct page.
 */
export function ClientRouter() {
  const [currentPage, setCurrentPage] = useState<string>("chat");

  useEffect(() => {
    function detectPage() {
      const path = window.location.pathname.toLowerCase();
      if (path.includes("dashboard")) return "dashboard";
      if (path.includes("network")) return "network";
      if (path.includes("report")) return "reports";
      return "chat";
    }

    setCurrentPage(detectPage());

    // Listen for popstate (browser back/forward)
    const handlePopState = () => setCurrentPage(detectPage());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  switch (currentPage) {
    case "dashboard":
      return <DashboardPage />;
    case "network":
      return <NetworkPage />;
    case "reports":
      return <ReportsPage />;
    default:
      return <ChatWindow />;
  }
}
