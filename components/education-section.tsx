"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { BookOpen, ShieldCheck } from "lucide-react"

const tabs = [
  { id: "pga" as const, label: "Apa itu PGA?", icon: BookOpen },
  { id: "evakuasi" as const, label: "Prosedur Evakuasi", icon: ShieldCheck },
]

export function EducationSection() {
  const [activeTab, setActiveTab] = useState<"pga" | "evakuasi">("pga")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Ensiklopedia Kebencanaan
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pelajari parameter geofisika dan prosedur mitigasi gempa bumi.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-secondary/50 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === "pga" && (
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Shakemap_Example.jpg"
              alt="Contoh Peta PGA dari USGS menunjukkan distribusi percepatan tanah saat gempa"
              className="h-56 w-full object-cover"
              crossOrigin="anonymous"
            />
            <p className="px-4 py-2 text-xs text-muted-foreground">
              Contoh Peta PGA (USGS)
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">
              Peak Ground Acceleration (PGA)
            </h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Peak Ground Acceleration (PGA) adalah ukuran seberapa kuat tanah
              berguncang saat gempa terjadi. Berbeda dengan Skala Richter yang
              mengukur energi di pusat gempa, PGA mengukur dampak di lokasi Anda
              berdiri.
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Nilai PGA dinyatakan dalam satuan gravitasi (g). Semakin tinggi nilai PGA di
              suatu lokasi, semakin besar guncangan yang dirasakan dan semakin tinggi potensi
              kerusakan pada bangunan dan infrastruktur.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-100">
                <p className="text-xs font-medium text-emerald-800">PGA Rendah</p>
                <p className="mt-1 text-lg font-bold text-emerald-700">
                  {"< 0.2 g"}
                </p>
                <p className="mt-1 text-xs text-emerald-600">
                  Guncangan ringan, kerusakan minimal
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 p-4 border border-amber-100">
                <p className="text-xs font-medium text-amber-800">PGA Sedang</p>
                <p className="mt-1 text-lg font-bold text-amber-700">
                  0.2 - 0.5 g
                </p>
                <p className="mt-1 text-xs text-amber-600">
                  Kerusakan sedang pada bangunan
                </p>
              </div>
              <div className="rounded-lg bg-red-50 p-4 border border-red-100">
                <p className="text-xs font-medium text-red-800">PGA Tinggi</p>
                <p className="mt-1 text-lg font-bold text-red-700">
                  {"> 0.5 g"}
                </p>
                <p className="mt-1 text-xs text-red-600">
                  Kerusakan parah, risiko runtuh
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "evakuasi" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">
            Prosedur Evakuasi Gempa Bumi
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Ingat tiga langkah utama saat gempa bumi terjadi:
          </p>

          <div className="mt-6 flex flex-col gap-4">
            {[
              {
                step: "1",
                title: "Drop (Merunduk)",
                desc: "Jatuhkan diri ke lantai dengan posisi merangkak. Posisi ini melindungi Anda dari terjatuh dan memungkinkan Anda bergerak ke tempat berlindung.",
                color: "bg-primary/10 text-primary",
              },
              {
                step: "2",
                title: "Cover (Berlindung)",
                desc: "Lindungi kepala dan leher Anda. Jika ada meja atau furniture kokoh di dekat Anda, masuklah ke bawahnya. Jika tidak ada, lindungi kepala dengan tangan dan lengan.",
                color: "bg-primary/10 text-primary",
              },
              {
                step: "3",
                title: "Hold On (Bertahan)",
                desc: "Jika Anda berlindung di bawah meja, pegang erat kaki meja tersebut. Tetap pada posisi hingga guncangan berhenti dan aman untuk bergerak.",
                color: "bg-primary/10 text-primary",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 rounded-lg border border-border p-4"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold",
                    item.color
                  )}
                >
                  {item.step}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-primary/5 border border-primary/10 p-4">
            <p className="text-sm font-medium text-foreground">
              Setelah guncangan berhenti:
            </p>
            <ul className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
              <li>- Periksa apakah Anda dan orang sekitar terluka</li>
              <li>- Keluar dari bangunan melalui jalur evakuasi</li>
              <li>- Jauhi bangunan, tiang listrik, dan pohon</li>
              <li>- Siap menghadapi gempa susulan (aftershock)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
