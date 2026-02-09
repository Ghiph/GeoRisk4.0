"use client"

import { cn } from "@/lib/utils"
import type { RiskData } from "@/lib/risk-data"
import { ShieldAlert, ShieldCheck, Shield, Mountain, Waves, Ruler, Layers } from "lucide-react"

interface RiskResultsProps {
  result: RiskData
}

export function RiskResults({ result }: RiskResultsProps) {
  const levelConfig = {
    TINGGI: {
      bg: "bg-red-50 border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      textColor: "text-red-800",
      badgeBg: "bg-red-600",
      Icon: ShieldAlert,
    },
    SEDANG: {
      bg: "bg-amber-50 border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      textColor: "text-amber-800",
      badgeBg: "bg-amber-600",
      Icon: Shield,
    },
    RENDAH: {
      bg: "bg-emerald-50 border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-800",
      badgeBg: "bg-emerald-600",
      Icon: ShieldCheck,
    },
  }

  const config = levelConfig[result.level]
  const LevelIcon = config.Icon

  const metrics = [
    { label: "PGA (Guncangan)", value: result.pga, Icon: Waves },
    { label: "Vs30 (Kondisi Tanah)", value: result.vs30, Icon: Mountain },
    { label: "Jarak Patahan", value: result.jarak_sesar, Icon: Ruler },
    { label: "Litologi", value: result.litologi, Icon: Layers },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className={cn("rounded-xl border p-5", config.bg)}>
        <div className="flex items-start gap-4">
          <div className={cn("rounded-lg p-2.5", config.iconBg)}>
            <LevelIcon className={cn("h-6 w-6", config.iconColor)} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className={cn("text-lg font-semibold", config.textColor)}>
                Tingkat Risiko: {result.level}
              </h3>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium text-white", config.badgeBg)}>
                Skor: {result.score}/10
              </span>
            </div>
            <p className={cn("mt-2 text-sm leading-relaxed", config.textColor)}>
              {result.saran}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((metric) => {
          const MetricIcon = metric.Icon
          return (
            <div
              key={metric.label}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <MetricIcon className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{metric.label}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground leading-snug">
                {metric.value}
              </p>
            </div>
          )
        })}
      </div>

      <details className="rounded-lg border border-border bg-card">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors">
          Lihat Perhitungan Teknis (Metodologi)
        </summary>
        <div className="border-t border-border px-4 py-4">
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            Indeks risiko dihitung menggunakan metode Weighted Overlay:
          </p>
          <div className="rounded-md bg-secondary/50 p-4 font-mono text-sm text-foreground">
            {"RiskIndex = (W_PGA * S_PGA) + (W_Vs30 * S_Vs30) + (W_Dist * S_Dist)"}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Dimana bobot (W) ditentukan berdasarkan AHP (Analytic Hierarchy
            Process).
          </p>
        </div>
      </details>
    </div>
  )
}
