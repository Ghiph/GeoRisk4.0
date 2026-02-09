"use client"

import { useEffect, useRef, useCallback } from "react"
import type L from "leaflet"
import {
  SESAR_LEMBANG_COORDS,
  JABAR_BOUNDARY,
  VS30_ZONES,
  HISTORICAL_QUAKES,
  PGA_ZONE,
} from "@/lib/risk-data"

interface RiskMapProps {
  lat: number
  lon: number
  onLocationSelect: (lat: number, lon: number) => void
}

export function RiskMap({ lat, lon, onLocationSelect }: RiskMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const initializingRef = useRef(false)

  const initMap = useCallback(async () => {
    if (!containerRef.current || mapRef.current || initializingRef.current) return
    initializingRef.current = true

    const leaflet = (await import("leaflet")).default

    // Bail out if cleanup ran while we were loading leaflet
    if (!containerRef.current || mapRef.current) {
      initializingRef.current = false
      return
    }

    // Clear any stale Leaflet state on the DOM node (strict mode / fast refresh)
    const container = containerRef.current as HTMLDivElement & { _leaflet_id?: number }
    if (container._leaflet_id) {
      delete container._leaflet_id
      container.innerHTML = ""
    }

    // Fix default marker icon
    delete (leaflet.Icon.Default.prototype as Record<string, unknown>)._getIconUrl
    leaflet.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    })

    const map = leaflet.map(containerRef.current).setView([lat, lon], 9)

    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      .addTo(map)

    // Boundary layer
    const boundaryLayer = leaflet.layerGroup()
    leaflet
      .polyline(JABAR_BOUNDARY, {
        color: "#3b82f6",
        weight: 3,
        opacity: 0.6,
        dashArray: "10, 10",
      })
      .bindTooltip("Batas Administrasi Jawa Barat")
      .addTo(boundaryLayer)

    // Fault layer
    const faultLayer = leaflet.layerGroup()
    leaflet
      .polyline(SESAR_LEMBANG_COORDS, {
        color: "#ef4444",
        weight: 5,
        opacity: 0.8,
        dashArray: "10",
      })
      .bindTooltip("Jalur Sesar Lembang (Aktif)")
      .bindPopup("Sesar Lembang - Potensi Mag: 6.8 Mw")
      .addTo(faultLayer)

    // Vs30 layer
    const vs30Layer = leaflet.layerGroup()
    leaflet
      .polygon(VS30_ZONES.soft, {
        color: "#f97316",
        fillColor: "#f97316",
        fillOpacity: 0.4,
        weight: 1,
      })
      .bindTooltip("Zona Vs30 Rendah (Tanah Lunak)")
      .addTo(vs30Layer)

    leaflet
      .polygon(VS30_ZONES.hard, {
        color: "#22c55e",
        fillColor: "#22c55e",
        fillOpacity: 0.4,
        weight: 1,
      })
      .bindTooltip("Zona Vs30 Tinggi (Tanah Keras)")
      .addTo(vs30Layer)

    // PGA layer
    const pgaLayer = leaflet.layerGroup()
    leaflet
      .circle([PGA_ZONE.lat, PGA_ZONE.lon], {
        radius: PGA_ZONE.radius,
        color: "#8b5cf6",
        fillColor: "#8b5cf6",
        fillOpacity: 0.3,
        weight: 0,
      })
      .bindTooltip("Zona PGA Tinggi (> 0.5g)")
      .addTo(pgaLayer)

    // Historical layer
    const historyLayer = leaflet.layerGroup()
    HISTORICAL_QUAKES.forEach((q) => {
      leaflet
        .circleMarker([q.lat, q.lon], {
          radius: q.radius,
          color: "#1e293b",
          fillColor: "#ef4444",
          fillOpacity: 1,
          weight: 2,
        })
        .bindTooltip(q.label)
        .addTo(historyLayer)
    })

    // Add default layers
    boundaryLayer.addTo(map)
    faultLayer.addTo(map)
    vs30Layer.addTo(map)
    pgaLayer.addTo(map)
    historyLayer.addTo(map)

    // Layer control
    leaflet
      .control.layers(
        {},
        {
          "Batas Wilayah Jawa Barat": boundaryLayer,
          "Patahan Aktif (Sesar Lembang)": faultLayer,
          "Vs30 (Kondisi Tanah)": vs30Layer,
          "Distribusi PGA": pgaLayer,
          "Kegempaan Historis": historyLayer,
        },
        { collapsed: false }
      )
      .addTo(map)

    // User marker
    const marker = leaflet.marker([lat, lon], { draggable: true }).addTo(map)
    marker.bindPopup("Lokasi Anda / Titik Analisis").openPopup()

    marker.on("dragend", () => {
      const pos = marker.getLatLng()
      onLocationSelect(pos.lat, pos.lng)
    })

    // Click to move marker
    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng)
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    })

    mapRef.current = map
    markerRef.current = marker
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    initMap()
    return () => {
      initializingRef.current = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [initMap])

  // Update marker when lat/lon props change externally (e.g. GPS)
  useEffect(() => {
    if (markerRef.current && mapRef.current) {
      markerRef.current.setLatLng([lat, lon])
      mapRef.current.setView([lat, lon], mapRef.current.getZoom())
    }
  }, [lat, lon])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin="anonymous"
      />
      <div ref={containerRef} className="h-full w-full rounded-lg" />
    </>
  )
}
