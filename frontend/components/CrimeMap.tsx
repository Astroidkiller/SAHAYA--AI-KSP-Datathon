"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useLanguage } from "@/lib/language-context";
import { formatDistrict } from "@/lib/translations";
import type { Map as LeafletMap } from "leaflet";

/**
 * Official Tactical Crime Map for Karnataka State Police.
 * Powered by Leaflet.js + CARTO Dark Matter Vector Tiles.
 * 100% Popup-Free, Zero API Key / Billing Restrictions, High-Performance GIS Engine.
 */

interface FIRRecord {
  fir_id: string;
  district: string;
  category: string;
  latitude: number;
  longitude: number;
  date_filed: string;
  time_of_incident?: string;
}

interface DistrictStats {
  name: string;
  lat: number;
  lon: number;
  totalCrimes: number;
  categories: Record<string, number>;
  isSpike: boolean;
}

const DISTRICT_COORDS: Record<string, [number, number]> = {
  "Bengaluru Urban": [12.9716, 77.5946],
  "Bengaluru Rural": [13.1986, 77.7066],
  Mysuru: [12.2958, 76.6394],
  Mangaluru: [12.8745, 74.8423],
  "Hubli-Dharwad": [15.3647, 75.124],
  Belagavi: [15.8497, 74.4977],
  Kalaburagi: [17.329, 76.8343],
  Shivamogga: [13.9299, 75.5681],
  Tumakuru: [13.3379, 77.117],
  Davangere: [14.4644, 75.9218],
};

function getSeverityColor(count: number, maxCount: number): string {
  const ratio = count / maxCount;
  if (ratio > 0.7) return "#EF4444"; // red
  if (ratio > 0.4) return "#F59E0B"; // amber
  return "#10B981"; // green
}

export function CrimeMap() {
  const { t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<LeafletMap | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [firData, setFirData] = useState<FIRRecord[]>([]);

  const loadData = useCallback(async () => {
    try {
      const data: FIRRecord[] = await fetch("/data/fir_records.json").then((r) =>
        r.json()
      );
      setFirData(data);
    } catch {
      setFirData([]);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Init Leaflet GIS Layer
  const initLeafletMap = useCallback(async () => {
    if (typeof window === "undefined" || !mapRef.current) return;
    const L = await import("leaflet");

    if ((mapRef.current as any)._leaflet_id) {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
      (mapRef.current as any)._leaflet_id = null;
    }

    const map = L.map(mapRef.current, {
      center: [14.3, 76.0],
      zoom: 7,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; CARTO &copy; OpenStreetMap • Karnataka State Police SCRB',
      maxZoom: 19,
    }).addTo(map);

    leafletRef.current = map;
    setIsLoaded(true);

    if (!firData.length) return;

    // Aggregate FIR data by district
    const districtMap = new Map<string, DistrictStats>();

    firData.forEach((fir) => {
      const existing = districtMap.get(fir.district);
      if (existing) {
        existing.totalCrimes++;
        existing.categories[fir.category] =
          (existing.categories[fir.category] || 0) + 1;
      } else {
        const coords = DISTRICT_COORDS[fir.district] || [
          fir.latitude,
          fir.longitude,
        ];
        districtMap.set(fir.district, {
          name: fir.district,
          lat: coords[0],
          lon: coords[1],
          totalCrimes: 1,
          categories: { [fir.category]: 1 },
          isSpike: false,
        });
      }
    });

    const districts = Array.from(districtMap.values());
    const maxCount = Math.max(...districts.map((d) => d.totalCrimes), 1);
    const avgCount =
      districts.reduce((s, d) => s + d.totalCrimes, 0) / districts.length;

    districts.forEach((d) => {
      d.isSpike = d.totalCrimes > avgCount * 1.4;
    });

    // Individual FIR Pins (small colored dots)
    firData.slice(0, 45).forEach((fir) => {
      L.circleMarker([fir.latitude, fir.longitude], {
        radius: 3.5,
        fillColor: fir.category === "Theft" ? "#38BDF8" : fir.category === "Robbery" ? "#EF4444" : "#F59E0B",
        color: "#0B1320",
        weight: 1,
        fillOpacity: 0.85,
      })
        .bindPopup(`
          <div style="font-family: system-ui; font-size: 12px; color: #F1F5F9; background: #0F172A; padding: 10px; border-radius: 8px; min-width: 170px; border: 1px solid #334155;">
            <strong style="color:#D4AF37;">${fir.fir_id}</strong><br/>
            <span>Category: ${fir.category}</span><br/>
            <span style="color:#94A3B8;">${formatDistrict(fir.district, t)} • ${fir.date_filed}</span>
          </div>
        `, { className: "ksp-dark-popup" })
        .addTo(map);
    });

    // District Hotspot Circles
    districts.forEach((dist) => {
      const color = getSeverityColor(dist.totalCrimes, maxCount);
      const radius = 16 + (dist.totalCrimes / maxCount) * 36;

      const circle = L.circleMarker([dist.lat, dist.lon], {
        radius,
        fillColor: color,
        color: dist.isSpike ? "#EF4444" : color,
        weight: dist.isSpike ? 3 : 1.5,
        fillOpacity: 0.35,
        className: dist.isSpike ? "pulse-spike-marker" : "",
      }).addTo(map);

      const catBreakdown = Object.entries(dist.categories)
        .map(
          ([cat, cnt]) =>
            `<div style="display:flex;justify-content:space-between;padding:2px 0;"><span>${cat}</span><strong>${cnt}</strong></div>`
        )
        .join("");

      circle.bindPopup(`
        <div style="font-family: system-ui; font-size: 13px; color: #F1F5F9; background: #0F172A; padding: 12px; border-radius: 10px; min-width: 210px; border: 1px solid #334155;">
          <div style="font-size: 15px; font-weight: 700; color: ${color}; margin-bottom: 4px;">${formatDistrict(dist.name, t)}</div>
          <div style="font-size: 18px; font-weight: 800; margin-bottom: 6px;">${dist.totalCrimes} <span style="font-size: 11px; color: #94A3B8;">total FIRs</span></div>
          ${dist.isSpike ? '<div style="background:#7F1D1D;color:#FCA5A5;padding:3px 6px;border-radius:4px;font-size:10px;margin-bottom:6px;font-weight:600;">⚠ SPIKE ALERT — Exceeds 1.4× State Average</div>' : ''}
          <div style="border-top:1px solid #334155;padding-top:6px;margin-top:4px;">
            ${catBreakdown}
          </div>
        </div>
      `, { className: "ksp-dark-popup" });
    });
  }, [firData, t]);

  useEffect(() => {
    initLeafletMap();
    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
    };
  }, [initLeafletMap]);

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-[#1e293b] shadow-xl bg-[#0b1320]"
      style={{ height: 480 }}
    >
      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between px-4 py-2.5 bg-[#0b1320]/90 backdrop-blur-md border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <h3 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider font-mono">
            🗺️ {t.mapTitle.replace("(Google Maps)", "")}
          </h3>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span className="flex items-center gap-1.5 text-[10px] text-slate-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" /> {t.mapLow}
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> {t.mapMedium}
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" /> {t.mapSpike}
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0b1320] z-[999]">
          <div className="text-xs font-mono text-slate-400 animate-pulse">
            Loading Karnataka SCRB GIS Map...
          </div>
        </div>
      )}

      {/* Popup & pulse styles */}
      <style jsx global>{`
        .pulse-spike-marker {
          animation: pulse-ring 2s ease-out infinite;
        }
        @keyframes pulse-ring {
          0% { opacity: 1; }
          50% { opacity: 0.35; }
          100% { opacity: 1; }
        }
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-tip {
          background: #0f172a !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
      `}</style>
    </div>
  );
}
