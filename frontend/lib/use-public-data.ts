"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hook to load JSON data from public/data/ at runtime.
 * Supports multiple path fallbacks for production static hosting (Zoho Slate / Catalyst).
 */
export function usePublicData<T>(
  filename: string,
  fallback: T
): { data: T; loading: boolean; mutate: () => Promise<void>; refetch: () => Promise<void> } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const paths = [
      `/data/${filename}?t=${Date.now()}`,
      `./data/${filename}?t=${Date.now()}`,
      `/frontend/out/data/${filename}?t=${Date.now()}`,
      `/data/samples/${filename}?t=${Date.now()}`,
    ];

    for (const path of paths) {
      try {
        const res = await fetch(path);
        if (res.ok) {
          const json = await res.json();
          if (json && (Array.isArray(json) ? json.length > 0 : Object.keys(json).length > 0)) {
            setData(json);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // try next fallback path
      }
    }
    setLoading(false);
  }, [filename]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, mutate: loadData, refetch: loadData };
}

