"use client";

import { useState, useEffect, useCallback } from "react";
import { MOCK_HOTSPOTS } from "./mock-data";

// ── Embedded static graph data (no network fetch needed) ──
const STATIC_GRAPH_DATA = {
  nodes: [
    { id: "S001", name: "Ravi Kumar",    risk: "High"   as const, district: "Bengaluru Urban", group: 1 },
    { id: "S002", name: "Suresh Reddy",  risk: "Medium" as const, district: "Bengaluru Urban", group: 1 },
    { id: "S003", name: "Manoj Gowda",   risk: "Medium" as const, district: "Bengaluru Urban", group: 1 },
    { id: "S004", name: "Kiran Shetty",  risk: "High"   as const, district: "Bengaluru Urban", group: 1 },
    { id: "S005", name: "Prakash Naik",  risk: "Low"    as const, district: "Mysuru",          group: 2 },
    { id: "S006", name: "Naveen Patil",  risk: "Medium" as const, district: "Mysuru",          group: 2 },
    { id: "S007", name: "Deepak Rao",    risk: "High"   as const, district: "Mangaluru",       group: 3 },
    { id: "S008", name: "Anil Hegde",    risk: "Medium" as const, district: "Mangaluru",       group: 3 },
    { id: "S009", name: "Ganesh Murthy", risk: "Low"    as const, district: "Hubli-Dharwad",   group: 4 },
  ],
  links: [
    { source: "S001", target: "S002" },
    { source: "S001", target: "S003" },
    { source: "S002", target: "S004" },
    { source: "S003", target: "S004" },
    { source: "S005", target: "S006" },
    { source: "S007", target: "S008" },
    { source: "S008", target: "S009" },
  ],
};

/**
 * Fully offline data hook — returns embedded static data instantly.
 * No network fetches are made. Works 100% reliably on Zoho Catalyst / Slate.
 */
export function usePublicData<T>(
  filename: string,
  fallback: T
): { data: T; loading: boolean; mutate: () => Promise<void>; refetch: () => Promise<void> } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    // Serve embedded static data immediately — no HTTP calls
    if (filename === "hotspot_answers.json") {
      setData(MOCK_HOTSPOTS as unknown as T);
    } else if (filename === "graph_data.json") {
      setData(STATIC_GRAPH_DATA as unknown as T);
    } else {
      setData(fallback);
    }
    setLoading(false);
  }, [filename, fallback]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, mutate: loadData, refetch: loadData };
}
