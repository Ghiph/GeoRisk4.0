"use client"

import { Activity, Mountain, Waves, Ruler } from "lucide-react"

export function HomeSection() {
  const parameters = [
    {
      icon: Waves,
      title: "Peak Ground Acceleration (PGA)",
      description: "Percepatan tanah maksimum yang dirasakan di permukaan.",
    },
    {
      icon: Mountain,
      title: "Vs30",
      description: "Kecepatan gelombang geser untuk klasifikasi kekerasan tanah.",
    },
    {
      icon: Activity,
      title: "Litologi",
      description: "Jenis batuan geologi yang menentukan respons terhadap gelombang seismik.",
    },
    {
      icon: Ruler,
      title: "Jarak Patahan",
      description: "Kedekatan dengan Sesar Lembang & Cimandiri.",
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight text-balance">
          Selamat Datang di GeoRisk Dashboard
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">
          Platform ini dirancang untuk memberikan informasi risiko gempa bumi
          secara real-time dan spesifik lokasi (mikrozonasi). Menggunakan
          pendekatan Weighted Overlay dari parameter geofisika:
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {parameters.map((param) => {
          const Icon = param.icon
          return (
            <div
              key={param.title}
              className="flex gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-secondary/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {param.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {param.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Populasi Cisarua
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            ~80.000
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Jiwa</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Potensi Mag. Sesar Lembang
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">6.8 Mw</p>
          <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            Siaga
          </span>
        </div>
      </div>
    </div>
  )
}
