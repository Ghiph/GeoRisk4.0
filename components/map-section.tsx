"use client"

import { useState, useCallback } from "react"
import { RiskMap } from "@/components/risk-map"
import { RiskResults } from "@/components/risk-results"
import { getRiskData } from "@/lib/risk-data"
import type { RiskData } from "@/lib/risk-data"
import { MapPin, Search, Crosshair } from "lucide-react"

export function MapSection() {
  const [lat, setLat] = useState(-6.79)
  const [lon, setLon] = useState(107.56)
  const [result, setResult] = useState<RiskData | null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)

  const handleLocationSelect = useCallback((newLat: number, newLon: number) => {
    setLat(parseFloat(newLat.toFixed(5)))
    setLon(parseFloat(newLon.toFixed(5)))
  }, [])

  const handleAnalyze = () => {
    const data = getRiskData(lat, lon)
    setResult(data)
  }

  const handleGps = () => {
    if (!navigator.geolocation) return
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = parseFloat(pos.coords.latitude.toFixed(5))
        const newLon = parseFloat(pos.coords.longitude.toFixed(5))
        setLat(newLat)
        setLon(newLon)
        setGpsLoading(false)
      },
      () => {
        setGpsLoading(false)
      }
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Analisis Mikrozonasi Interaktif
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Klik pada peta atau seret marker untuk memilih titik analisis. Gunakan layer control untuk toggle data geofisika.
        </p>
      </div>

      {/* Map */}
      <div className="h-[500px] overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <RiskMap lat={lat} lon={lon} onLocationSelect={handleLocationSelect} />
      </div>

      {/* Input controls */}
      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>Koordinat</span>
        </div>

        <div className="flex flex-1 flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="lat-input" className="text-xs text-muted-foreground">Latitude</label>
            <input
              id="lat-input"
              type="number"
              step={0.0001}
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
              className="h-9 w-36 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none ring-ring focus:ring-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="lon-input" className="text-xs text-muted-foreground">Longitude</label>
            <input
              id="lon-input"
              type="number"
              step={0.0001}
              value={lon}
              onChange={(e) => setLon(parseFloat(e.target.value) || 0)}
              className="h-9 w-36 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none ring-ring focus:ring-2"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleGps}
            disabled={gpsLoading}
            className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
          >
            <Crosshair className="h-3.5 w-3.5" />
            {gpsLoading ? "Mencari..." : "GPS"}
          </button>
          <button
            onClick={handleAnalyze}
            className="flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Search className="h-3.5 w-3.5" />
            Hitung Risiko
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Hasil Analisis Risiko Geofisika
          </h3>
          <RiskResults result={result} />
        </div>
      )}
    </div>
  )
}
