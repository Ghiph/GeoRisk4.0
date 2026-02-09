"use client"

import { cn } from "@/lib/utils"
import { Map, Home, BookOpen } from "lucide-react"

export type NavPage = "beranda" | "peta" | "edukasi"

interface AppSidebarProps {
  activePage: NavPage
  onPageChange: (page: NavPage) => void
}

const navItems: { id: NavPage; label: string; icon: React.ElementType }[] = [
  { id: "beranda", label: "Beranda & Latar Belakang", icon: Home },
  { id: "peta", label: "Peta Analisis Risiko", icon: Map },
  { id: "edukasi", label: "Edukasi & Mitigasi", icon: BookOpen },
]

export function AppSidebar({ activePage, onPageChange }: AppSidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card p-6">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-foreground tracking-tight">
          GeoRisk
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Analisis Mitigasi Gempa
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-border bg-secondary/50 p-4">
        <p className="text-xs font-medium text-foreground">Info PKM-RE</p>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Prototype ini menggunakan data simulasi untuk keperluan demonstrasi proposal.
        </p>
      </div>
    </aside>
  )
}
