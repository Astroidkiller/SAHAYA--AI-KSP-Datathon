"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hook to load JSON data from public/data/ at runtime.
 * Avoids Turbopack panics caused by large static JSON imports.
 */
export function usePublicData<T>(
  filename: string,
  fallback: T
): { data: T; loading: boolean; mutate: () => Promise<void>; refetch: () => Promise<void> } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch(`/data/${filename}?t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      // keep fallback
    } finally {
      setLoading(false);
    }
  }, [filename]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, mutate: loadData, refetch: loadData };
}

